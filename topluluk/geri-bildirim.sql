-- ML Academy · per-step feedback
-- Run this once in Supabase > SQL Editor. It only adds; nothing existing changes.
--
-- WHY PER STEP, NOT PER LESSON. Someone who gets lost does not finish the
-- lesson: they stall on step 3 and close the tab. Feedback collected at the
-- end of a lesson therefore only reaches people who were never lost. The
-- signal we want lives exactly in the person who left, so the prompt sits at
-- the end of every step and records WHICH step it came from.
--
-- WHY ANONYMOUS WRITES ARE ALLOWED. The first three lessons of every track
-- are open without an account, and those are precisely the lessons a new
-- visitor gets confused in. Requiring sign-in would filter out the people
-- this table exists for. The cost is that the endpoint is open to spam; the
-- guards are the length limits below and the moderator being able to delete.
-- If it is ever abused, tighten feedback_write to auth.uid() is not null.
--
-- NOBODY CAN READ IT BACK, not even the person who wrote it. This is private
-- feedback, not a public review, and there is no reason to expose it.

create table if not exists feedback (
  id         bigserial primary key,
  -- context, filled by the page rather than typed by the person
  lesson_id  text not null check (char_length(lesson_id) between 1 and 60),
  step_no    int  not null check (step_no between 1 and 60),
  lang       text not null check (lang in ('tr','en')),
  -- what they wrote
  body       text not null check (char_length(btrim(body)) between 3 and 1200),
  -- null when the visitor is not signed in, which is the common case
  user_id    uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists feedback_lesson_idx on feedback (lesson_id, step_no);
create index if not exists feedback_time_idx   on feedback (created_at desc);

alter table feedback enable row level security;

-- Writing: anyone, but only as themselves. A signed-in visitor cannot write
-- in someone else's name; an anonymous one leaves user_id null.
create policy feedback_write on feedback for insert with check (
  user_id is null or user_id = auth.uid()
);

-- Reading and deleting: moderator only.
create policy feedback_read   on feedback for select using (is_moderator());
create policy feedback_delete on feedback for delete using (is_moderator());

-- The project is created with "Automatically expose new tables" OFF, so the
-- grants are explicit. INSERT only: no select for anon or authenticated.
grant insert on feedback to anon, authenticated;
grant usage  on sequence feedback_id_seq to anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- READING IT (as a moderator, in the SQL editor)
-- ═══════════════════════════════════════════════════════════
-- Newest first:
--   select created_at, lesson_id, step_no, lang, body
--   from feedback order by created_at desc limit 50;
--
-- WHERE PEOPLE GET STUCK, the reason this table exists:
--   select lesson_id, step_no, count(*) as n
--   from feedback group by lesson_id, step_no
--   order by n desc limit 20;
--
-- Delete spam:
--   delete from feedback where id = 12;
