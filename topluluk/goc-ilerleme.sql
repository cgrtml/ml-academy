-- ML Academy · ilerleme senkronizasyonu göçü
-- ─────────────────────────────────────────────────────────────────────
-- Kayıt penceresi, kilit ekranı ve doğrulama e-postaları "ilerlemen
-- cihazlar arasında saklanır" diyordu. Kod bunu hiç yapmıyordu:
-- ilerleme yalnızca localStorage'a yazılıyor, `progress` tablosuna tek
-- satır bile düşmüyordu. Bu betik tabloyu kullanılabilir hâle getirir,
-- istemci tarafı da onu doldurmaya başlar.
--
-- Supabase panelinde: SQL Editor → New query → hepsini yapıştır → Run.
--
-- YAZIM KURALI: yorumlar Türkçe, tanımlayıcılar İngilizce.

-- ── 1 · şekil değişikliği ──
-- Eski tablo (user_id, lesson, step) anahtarlıydı: tamamlanan HER adım
-- için ayrı satır. İstemci ilerlemeyi ders başına tek nesne olarak
-- tutuyor ({done:[0,1,2], xp:180}), yani her kayıtta onlarca satır
-- yazmak gerekirdi. Ders başına tek satır hem yazma sayısını hem de
-- birleştirme mantığını basitleştiriyor.
--
-- Tablo bugüne kadar hiç yazılmadı, dolayısıyla veri kaybı yok.
-- Yine de emin olmak için önce sayıyı gör:
--     select count(*) from progress;
-- Sıfırdan büyükse buradan devam etme, önce konuş.

drop table if exists progress;

create table progress (
  user_id    uuid not null references auth.users(id) on delete cascade,
  lesson     text not null,
  done       int[] not null default '{}',      -- tamamlanan adım indeksleri
  xp         int  not null default 0,
  completed  boolean not null default false,   -- dersin tamamı bitti mi
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson)
);

create index if not exists progress_user_idx on progress (user_id);

-- ── 2 · satır düzeyi güvenlik ──
-- Kimse başkasının ilerlemesini göremez ve yazamaz.
alter table progress enable row level security;

drop policy if exists progress_own on progress;
create policy progress_own on progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update, delete on progress to authenticated;

-- ── 3 · updated_at kendiliğinden ──
create or replace function touch_progress() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists progress_touch on progress;
create trigger progress_touch before update on progress
for each row execute function touch_progress();

-- ── 4 · ana sayfadaki sayaç ──
-- community_stats() "ders bitiren" sayısını progress üzerinden
-- hesaplıyor. Tablo yeniden kurulduğu için fonksiyonu da tazeliyoruz;
-- sorgunun kendisi değişmedi, yalnızca yeni şekle uyuyor.
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

-- ── 5 · kontrol ──
-- Aşağıdaki üç satır dönmeli: tablo, politika, tetikleyici.
select 'tablo' as tur, table_name as ad
from   information_schema.tables
where  table_schema = 'public' and table_name = 'progress'
union all
select 'politika', policyname from pg_policies
where  schemaname = 'public' and tablename = 'progress'
union all
select 'tetikleyici', tgname from pg_trigger
where  tgrelid = 'public.progress'::regclass and not tgisinternal;
