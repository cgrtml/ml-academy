-- ML Academy · profil alanları göçü
-- ─────────────────────────────────────────────────────────────────────
-- 10 Ağustos 2026. Kayıt formu genişledi: ad, ünvan ve kurum soruluyor.
-- Bu betik `profile` tablosunu o alanlarla tamamlar ve kayıt anında
-- otomatik doldurur.
--
-- Supabase panelinde: SQL Editor → New query → hepsini yapıştır → Run.
-- Betik iki kez çalıştırılsa da bozulmaz (idempotent).
--
-- NOT: `profile` tablosu daha önce arastirma/sema.sql ile oluşturulmuştu.
-- O katman durduruldu ama `profile` ve `progress` hizmet verisidir ve
-- kullanılmaya devam eder. Tablo yoksa aşağıdaki create onu kurar.

-- ── 1 · tablo (yoksa) ──
create table if not exists profile (
  id         uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  lang       text not null default 'tr' check (lang in ('tr','en'))
);

-- ── 2 · yeni alanlar ──
alter table profile add column if not exists display_name text;
alter table profile add column if not exists title        text;
alter table profile add column if not exists organization text;
alter table profile add column if not exists country      text;

-- Ünvan serbest metin değil, sayılı bir liste. Boş bırakılabilir, çünkü
-- kayıt formunda isteğe bağlı.
alter table profile drop constraint if exists profile_title_chk;
alter table profile add  constraint profile_title_chk check (
  title is null or title = '' or title in (
    'Öğrenci','Akademisyen / araştırmacı','Yazılım geliştirici',
    'Veri bilimci / ML mühendisi','Öğretmen / eğitmen',
    'Başka bir alandan meraklı',
    'Student','Academic / researcher','Software developer',
    'Data scientist / ML engineer','Teacher / instructor',
    'Curious from another field'
  )
);

-- Araştırma katmanı durduruldu; yaş eşiği yalnızca o çalışma için
-- gerekiyordu. Sütun varsa kaldırılır.
alter table profile drop column if exists birth_year;

-- ── 3 · satır düzeyi güvenlik ──
alter table profile enable row level security;

drop policy if exists profile_kendi_okur  on profile;
drop policy if exists profile_kendi_yazar on profile;
drop policy if exists profile_kendi_guncel on profile;

create policy profile_kendi_okur on profile
  for select using (auth.uid() = id);
create policy profile_kendi_yazar on profile
  for insert with check (auth.uid() = id);
create policy profile_kendi_guncel on profile
  for update using (auth.uid() = id) with check (auth.uid() = id);

grant select, insert, update on profile to authenticated;

-- ── 4 · kayıt anında profili doldur ──
-- Kayıt formu ad/ünvan/kurum bilgisini auth metadata'sına yazıyor.
-- Bu tetikleyici onu profile tablosuna taşır, böylece istemcinin ayrıca
-- bir yazma isteği atmasına gerek kalmaz.
create or replace function public.yeni_kullanici_profili()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profile (id, display_name, title, organization)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'title',        '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'organization', '')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists yeni_kullanici_profili_trg on auth.users;
create trigger yeni_kullanici_profili_trg
  after insert on auth.users
  for each row execute function public.yeni_kullanici_profili();

-- ── 5 · kitle dağılımı (yalnızca toplam sayılar) ──
-- Kimlik sızdırmaz: yalnızca ünvan başına kaç kişi olduğunu döndürür ve
-- 3 kişiden az olan grupları gizler, böylece küçük gruplardan kimse
-- tekilleştirilemez.
create or replace function kitle_dagilimi()
returns json language sql stable security definer as $$
  select coalesce(json_object_agg(title, n), '{}'::json)
  from (
    select coalesce(nullif(title,''), '—') as title, count(*) as n
    from profile
    group by 1
    having count(*) >= 3
  ) d;
$$;

grant execute on function kitle_dagilimi() to anon, authenticated;
