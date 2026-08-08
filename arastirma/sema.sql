-- ML Academy · research telemetry · Supabase schema
--
-- Design rule: SERVICE data and RESEARCH data live in separate tables.
-- Service data is required for the account to work and needs no separate consent.
-- Research data is not required, needs its own revocable consent, and the site
-- works fully without it.
--
-- Identifiers are English so the schema can be shared: published datasets,
-- ethics board data dictionaries and outside collaborators all expect it.

-- ═══════════════════════════════════════════════════════════
-- 1 · SERVICE LAYER  (lawful basis: performance of a contract)
-- ═══════════════════════════════════════════════════════════

create table if not exists profile (
  id         uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  lang       text not null default 'tr' check (lang in ('tr','en')),
  country    text,                     -- drives the consent flow (EU / TR / US / other)
  birth_year int                       -- for the age threshold; no full date stored
);

create table if not exists progress (
  user_id    uuid not null references auth.users(id) on delete cascade,
  lesson     text not null,
  step       int  not null,
  completed  boolean not null default false,
  xp         int  not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson, step)
);

-- ═══════════════════════════════════════════════════════════
-- 2 · CONSENT LOG
-- ═══════════════════════════════════════════════════════════
-- Every consent change is written as a NEW row, never updated.
-- Withdrawal is a row too. That way "what had they consented to at the time"
-- is always answerable, which is exactly what an audit asks for.

create table if not exists consent (
  id           bigserial primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  purpose      text not null check (purpose in ('telemetry','learning_profile','contact')),
  granted      boolean not null,
  text_version text not null,          -- version of the consent text, e.g. '2026-08-08.1'
  created_at   timestamptz not null default now(),
  source       text                    -- 'after_signup' | 'settings' | 'withdrawal'
);

create index if not exists consent_user_idx on consent (user_id, purpose, created_at desc);

-- Current consent state: the latest row per purpose.
create or replace view consent_current as
select distinct on (user_id, purpose)
       user_id, purpose, granted, text_version, created_at
from   consent
order  by user_id, purpose, created_at desc;

-- ═══════════════════════════════════════════════════════════
-- 3 · RESEARCH LAYER  (lawful basis: explicit consent)
-- ═══════════════════════════════════════════════════════════
-- Write access is guarded by a policy that reads the consent view.
-- With no consent no row can be written; this is not left to the client.

create table if not exists event (
  id         bigserial primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  session    uuid not null,            -- one visit; groups rows independently of the user
  lesson     text not null,
  step       int  not null,
  kind       text not null check (kind in (
               'step_opened','step_closed','option_selected','correct','wrong',
               'retried','slider_moved','animation_played','hint_opened',
               'explainer_opened','code_run','abandoned')),
  value      jsonb,                    -- e.g. {"option":2, "attempt":3, "ms":8400}
  created_at timestamptz not null default now()
);

create index if not exists event_user_idx on event (user_id, created_at desc);
create index if not exists event_item_idx on event (lesson, step, kind);

-- ═══════════════════════════════════════════════════════════
-- 4 · ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════

alter table profile  enable row level security;
alter table progress enable row level security;
alter table consent  enable row level security;
alter table event    enable row level security;

-- Everyone sees and writes only their own rows.
create policy profile_own  on profile  for all using (auth.uid() = id)      with check (auth.uid() = id);
create policy progress_own on progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Consent log: written and read, NEVER updated or deleted.
create policy consent_read  on consent for select using (auth.uid() = user_id);
create policy consent_write on consent for insert with check (auth.uid() = user_id);

-- Events can only be written while a valid telemetry consent exists.
create policy event_write on event for insert with check (
  auth.uid() = user_id
  and exists (
    select 1 from consent_current c
    where c.user_id = auth.uid() and c.purpose = 'telemetry' and c.granted
  )
);
create policy event_read on event for select using (auth.uid() = user_id);

-- Delete the events when consent is withdrawn.
-- This is what technically satisfies "withdrawing must be as easy as giving".
create or replace function on_consent_revoked() returns trigger
language plpgsql security definer as $$
begin
  if new.purpose = 'telemetry' and new.granted = false then
    delete from event where user_id = new.user_id;
  end if;
  return new;
end $$;

drop trigger if exists consent_revoked_trigger on consent;
create trigger consent_revoked_trigger after insert on consent
for each row execute function on_consent_revoked();

-- ═══════════════════════════════════════════════════════════
-- 4b · DATA API ACCESS
-- ═══════════════════════════════════════════════════════════
-- The project is created with "Automatically expose new tables" OFF, so tables
-- are not exposed to the Data API on their own. Without the grants below the
-- client sees no rows at all. The real protection is still RLS: a grant answers
-- "may you look at this table", RLS answers "which rows". They work together.

grant usage on schema public to anon, authenticated;

grant select, insert, update on profile  to authenticated;
grant select, insert, update on progress to authenticated;
grant select, insert          on consent to authenticated;   -- no update, no delete
grant select, insert          on event   to authenticated;   -- no update, no delete

grant usage on sequence consent_id_seq to authenticated;
grant usage on sequence event_id_seq   to authenticated;

-- An anonymous visitor has no business in any of these tables.

-- ═══════════════════════════════════════════════════════════
-- 5 · RESEARCH VIEW  (de-identified)
-- ═══════════════════════════════════════════════════════════
-- Analysis runs on this view, never on the raw table.
-- The user id is replaced by a salted pseudonym.

create or replace view event_anonymous as
select encode(digest(user_id::text || current_setting('app.salt', true), 'sha256'), 'hex') as pseudonym,
       session, lesson, step, kind, value, date_trunc('hour', created_at) as hour
from   event;
