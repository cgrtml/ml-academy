-- ML Academy · profil alanları göçü
-- ─────────────────────────────────────────────────────────────────────
-- Kayıt formu genişledi: ad, ünvan ve kurum soruluyor. Bu betik `profile`
-- tablosunu o alanlarla tamamlar ve kayıt anında otomatik doldurur.
--
-- Supabase panelinde: SQL Editor → New query → hepsini yapıştır → Run.
-- Betik iki kez çalıştırılsa da bozulmaz (idempotent).
--
-- YAZIM KURALI: yorumlar Türkçe, tanımlayıcılar (tablo, sütun, politika,
-- fonksiyon, tetikleyici) İNGİLİZCE. Bu kural projenin başında konuldu:
-- şema dışarıyla paylaşılabilir olmalı. Mevcut sema.sql dosyaları da böyle
-- (`profile_own`, `review_read`, `moderator_hidden`, ...).
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

-- Ünvan serbest metin değil, sayılı bir liste. Boş olabilir: Google ve
-- GitHub ile gelen kullanıcı kayıt formunu hiç görmüyor.
alter table profile drop constraint if exists profile_title_chk;
alter table profile add  constraint profile_title_chk check (
  title is null or title = '' or title in (
    'Öğrenci','Akademisyen / Araştırmacı','Yazılım Geliştirici',
    'Veri Bilimci / ML Mühendisi','Öğretmen / Eğitmen',
    'Meraklı / Diğer',
    'Student','Academic / Researcher','Software Developer',
    'Data Scientist / ML Engineer','Teacher / Instructor',
    'Enthusiast / Other'
  )
);

-- Araştırma katmanı durduruldu; yaş eşiği yalnızca o çalışma için
-- gerekiyordu. Sütun varsa kaldırılır.
alter table profile drop column if exists birth_year;

-- ── 3 · satır düzeyi güvenlik ──
-- arastirma/sema.sql zaten `profile_own` politikasını `for all` olarak
-- tanımlamıştı. Yenisini eklemek yerine onu tazeliyoruz, yoksa aynı işi
-- yapan iki politika üst üste binerdi.
alter table profile enable row level security;

drop policy if exists profile_own on profile;
create policy profile_own on profile
  for all using (auth.uid() = id) with check (auth.uid() = id);

grant select, insert, update on profile to authenticated;

-- ── 4 · kayıt anında profili doldur ──
-- Kayıt formu ad/ünvan/kurum bilgisini auth metadata'sına yazıyor.
-- Bu tetikleyici onu profile tablosuna taşır, böylece istemcinin ayrıca
-- bir yazma isteği atmasına gerek kalmaz.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  full_name text;
begin
  /* Adın hangi anahtarda geleceği giriş yoluna göre değişir:
       kendi formumuz : display_name
       Google         : full_name, sonra name
       GitHub         : name, sonra user_name
     İlk dolu olan alınır. Hiçbiri yoksa e-postanın @ öncesi kullanılır,
     böylece yorum yazarken boş bir ad kutusuyla karşılaşılmaz. */
  full_name := coalesce(
          nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
          nullif(trim(new.raw_user_meta_data ->> 'full_name'),    ''),
          nullif(trim(new.raw_user_meta_data ->> 'name'),         ''),
          nullif(trim(new.raw_user_meta_data ->> 'user_name'),    ''),
          nullif(split_part(coalesce(new.email, ''), '@', 1),     '')
        );

  insert into profile (id, display_name, title, organization)
  values (
    new.id,
    full_name,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'title',        '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'organization', '')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 5 · kitle dağılımı (yalnızca toplam sayılar) ──
-- Kimlik sızdırmaz: yalnızca ünvan başına kaç kişi olduğunu döndürür ve
-- 3 kişiden az olan grupları gizler, böylece küçük gruplardan kimse
-- tekilleştirilemez.
create or replace function audience_breakdown()
returns json language sql stable security definer as $$
  select coalesce(json_object_agg(title, n), '{}'::json)
  from (
    select coalesce(nullif(title,''), '—') as title, count(*) as n
    from profile
    group by 1
    having count(*) >= 3
  ) d;
$$;

grant execute on function audience_breakdown() to anon, authenticated;

-- ── 6 · temizlik ──
-- Bu betiğin ilk sürümünde tanımlayıcılar yanlışlıkla Türkçe yazılmıştı.
-- O sürüm çalıştırıldıysa artıkları burada silinir; çalıştırılmadıysa bu
-- satırlar zararsızca geçer.
drop trigger  if exists yeni_kullanici_profili_trg on auth.users;
drop function if exists public.yeni_kullanici_profili();
drop function if exists kitle_dagilimi();
drop policy   if exists profile_kendi_okur   on profile;
drop policy   if exists profile_kendi_yazar  on profile;
drop policy   if exists profile_kendi_guncel on profile;
