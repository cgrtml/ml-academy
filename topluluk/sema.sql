-- ML Academy · community: reviews, ratings and counters
-- COMPLETELY separate from the research layer. Writing a review needs no
-- research consent, and giving research consent does not require a review.
--
-- Identifiers are English for the same reason as the research schema.

-- ═══════════════════════════════════════════════════════════
-- 1 · MODERATOR
-- ═══════════════════════════════════════════════════════════
-- The people who can approve reviews. One row is enough (your own user id).
-- Policies read this table; authority is never held on the client.

create table if not exists moderator (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);

create or replace function is_moderator() returns boolean
language sql stable security definer as $$
  select exists (select 1 from moderator where user_id = auth.uid());
$$;

-- ═══════════════════════════════════════════════════════════
-- 2 · REVIEW and RATING
-- ═══════════════════════════════════════════════════════════
-- One review per person. Editing it sends it back for approval.

create table if not exists review (
  id           bigserial primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  rating       int  not null check (rating between 1 and 5),
  body         text check (char_length(body) <= 600),
  display_name text not null check (char_length(display_name) between 2 and 40),
  status       text not null default 'pending'
               check (status in ('pending','approved','rejected')),
  mod_note     text,                    -- visible to the moderator only
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  approved_at  timestamptz,
  unique (user_id)
);

create index if not exists review_status_idx on review (status, approved_at desc);

-- An edited review goes back to pending. This trigger must not fire while the
-- moderator is approving, so the status change is checked separately.
create or replace function on_review_changed() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  if (new.body is distinct from old.body or new.rating is distinct from old.rating)
     and new.status = old.status then
    new.status := 'pending';
    new.approved_at := null;
  end if;
  if new.status = 'approved' and old.status <> 'approved' then
    new.approved_at := now();
  end if;
  return new;
end $$;

drop trigger if exists review_changed_trigger on review;
create trigger review_changed_trigger before update on review
for each row execute function on_review_changed();

-- ═══════════════════════════════════════════════════════════
-- 3 · ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════

alter table review    enable row level security;
alter table moderator enable row level security;

-- Nobody can read the moderator table; it is only consulted from is_moderator().
create policy moderator_hidden on moderator for select using (false);

-- Reading: approved reviews are public, your own is always visible to you,
-- the moderator sees everything.
create policy review_read on review for select using (
  status = 'approved' or auth.uid() = user_id or is_moderator()
);

-- Writing: only in your own name and always as 'pending'.
-- A user cannot approve their own review.
create policy review_write on review for insert with check (
  auth.uid() = user_id and status = 'pending'
);

create policy review_edit on review for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id and status = 'pending');

create policy review_delete on review for delete using (auth.uid() = user_id or is_moderator());

-- Moderation
create policy review_moderate on review for update using (is_moderator()) with check (is_moderator());

-- ═══════════════════════════════════════════════════════════
-- 3b · DATA API ACCESS
-- ═══════════════════════════════════════════════════════════
-- Needed because the project is created with "Automatically expose new tables" OFF.

grant usage on schema public to anon, authenticated;

-- A signed-in user writes, edits and deletes their own review.
grant select, insert, update, delete on review to authenticated;
grant usage on sequence review_id_seq to authenticated;

-- An anonymous visitor does NOT see the raw table. Approved reviews are reached
-- only through the review_public view (granted below).
-- No grant is given to anyone on the moderator table.

-- ═══════════════════════════════════════════════════════════
-- 4 · PUBLIC COUNTERS
-- ═══════════════════════════════════════════════════════════
-- The numbers shown on the home page. They come from a single function so an
-- anonymous visitor never touches the raw tables.
--
-- THRESHOLD: with fewer than 5 reviews the average rating is not returned.
-- A single-person "5.0 average" does not read as trustworthy and backfires.

create or replace function community_stats()
returns json language sql stable security definer as $$
  select json_build_object(
    'users',            (select count(*) from auth.users),
    'lesson_finishers', (select count(distinct user_id) from progress where completed),
    'reviews',          (select count(*) from review where status = 'approved'),
    'avg_rating',       (select case when count(*) >= 5
                                then round(avg(rating)::numeric, 1) else null end
                         from review where status = 'approved'),
    'rating_histogram', (select coalesce(json_object_agg(rating, n), '{}'::json)
                         from (select rating, count(*) as n from review
                               where status = 'approved' group by rating) d)
  );
$$;

grant execute on function community_stats() to anon, authenticated;

-- The approved reviews listed on the home page (no identity leaked).
create or replace view review_public as
select id, display_name, rating, body, approved_at
from   review
where  status = 'approved'
order  by approved_at desc;

grant select on review_public to anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 5 · SETUP
-- ═══════════════════════════════════════════════════════════
-- Make yourself a moderator (take the uuid from Supabase > Authentication > Users):
--   insert into moderator (user_id) values ('YOUR-UUID-HERE');
--
-- To see pending reviews (while signed in as a moderator):
--   select id, display_name, rating, body, created_at
--   from review where status = 'pending' order by created_at;
--
-- Approve:  update review set status = 'approved' where id = 12;
-- Reject:   update review set status = 'rejected', mod_note = 'reason' where id = 12;
