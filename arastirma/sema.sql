-- ML Academy · araştırma telemetrisi · Supabase şeması
-- Tasarım kuralı: HİZMET verisi ile ARAŞTIRMA verisi ayrı tablolarda durur.
-- Hizmet verisi hesabın çalışması için gerekli, ayrı rıza istemez.
-- Araştırma verisi gerekli değildir, ayrı ve geri alınabilir rıza ister,
-- ve rıza verilmese de site tam olarak çalışır.

-- ═══════════════════════════════════════════════════════════
-- 1 · HİZMET KATMANI  (dayanak: sözleşmenin ifası)
-- ═══════════════════════════════════════════════════════════

create table if not exists profil (
  id          uuid primary key references auth.users(id) on delete cascade,
  olusturuldu timestamptz not null default now(),
  dil         text not null default 'tr' check (dil in ('tr','en')),
  ulke        text,                    -- rıza akışını belirler (AB / TR / ABD / diğer)
  dogum_yili  int                      -- yaş eşiği kontrolü için; tam tarih tutulmuyor
);

create table if not exists ilerleme (
  kullanici uuid not null references auth.users(id) on delete cascade,
  ders      text not null,
  adim      int  not null,
  bitti     boolean not null default false,
  xp        int  not null default 0,
  guncel    timestamptz not null default now(),
  primary key (kullanici, ders, adim)
);

-- ═══════════════════════════════════════════════════════════
-- 2 · RIZA KAYDI
-- ═══════════════════════════════════════════════════════════
-- Her rıza değişikliği YENİ satır olarak yazılır, güncellenmez.
-- Geri alma da bir satırdır. Böylece "o an neye onay vermişti"
-- sorusunun cevabı her zaman elde kalır. Denetimde istenen budur.

create table if not exists riza (
  id         bigserial primary key,
  kullanici  uuid not null references auth.users(id) on delete cascade,
  amac       text not null check (amac in ('telemetri','ogrenme_profili','iletisim')),
  verildi    boolean not null,
  metin_sur  text not null,            -- onaylanan metnin sürümü, ör. '2026-08-08.1'
  zaman      timestamptz not null default now(),
  kaynak     text                      -- 'kayit_sonrasi' | 'ayarlar' | 'geri_alma'
);

create index if not exists riza_kullanici_idx on riza (kullanici, amac, zaman desc);

-- O anki geçerli rıza durumu: her amaç için en son satır.
create or replace view riza_guncel as
select distinct on (kullanici, amac)
       kullanici, amac, verildi, metin_sur, zaman
from   riza
order  by kullanici, amac, zaman desc;

-- ═══════════════════════════════════════════════════════════
-- 3 · ARAŞTIRMA KATMANI  (dayanak: açık rıza)
-- ═══════════════════════════════════════════════════════════
-- Yazma yetkisi, rıza görünümüne bakan bir politikayla korunuyor.
-- Yani rıza yoksa satır yazılamaz; bu istemci tarafına bırakılmıyor.

create table if not exists olay (
  id        bigserial primary key,
  kullanici uuid not null references auth.users(id) on delete cascade,
  oturum    uuid not null,             -- tek bir ziyaret; kullanıcıdan bağımsız gruplama
  ders      text not null,
  adim      int  not null,
  tur       text not null check (tur in (
              'adim_acildi','adim_kapandi','sik_secildi','dogru','yanlis',
              'tekrar_denendi','kaydirici','animasyon_oynatildi','ipucu_acildi',
              'anlatim_acildi','kod_calistirildi','terk_edildi')),
  deger     jsonb,                     -- ör. {"sik":2, "deneme":3, "sure_ms":8400}
  zaman     timestamptz not null default now()
);

create index if not exists olay_kullanici_idx on olay (kullanici, zaman desc);
create index if not exists olay_madde_idx     on olay (ders, adim, tur);

-- ═══════════════════════════════════════════════════════════
-- 4 · SATIR DÜZEYİ GÜVENLİK
-- ═══════════════════════════════════════════════════════════

alter table profil    enable row level security;
alter table ilerleme  enable row level security;
alter table riza      enable row level security;
alter table olay      enable row level security;

-- Herkes yalnızca kendi satırını görür ve yazar.
create policy profil_kendi   on profil   for all using (auth.uid() = id)        with check (auth.uid() = id);
create policy ilerleme_kendi on ilerleme for all using (auth.uid() = kullanici) with check (auth.uid() = kullanici);

-- Rıza kaydı: yazılır ve okunur, ASLA silinmez veya değiştirilmez.
create policy riza_oku  on riza for select using (auth.uid() = kullanici);
create policy riza_yaz  on riza for insert with check (auth.uid() = kullanici);

-- Olay yazımı yalnızca geçerli telemetri rızası varken mümkün.
create policy olay_yaz on olay for insert with check (
  auth.uid() = kullanici
  and exists (
    select 1 from riza_guncel r
    where r.kullanici = auth.uid() and r.amac = 'telemetri' and r.verildi
  )
);
create policy olay_oku on olay for select using (auth.uid() = kullanici);

-- Rıza geri alınınca olayları silen fonksiyon.
-- "Geri almak vermek kadar kolay olmalı" şartını teknik olarak karşılar.
create or replace function riza_geri_alindi() returns trigger
language plpgsql security definer as $$
begin
  if new.amac = 'telemetri' and new.verildi = false then
    delete from olay where kullanici = new.kullanici;
  end if;
  return new;
end $$;

drop trigger if exists riza_geri_alma_tetik on riza;
create trigger riza_geri_alma_tetik after insert on riza
for each row execute function riza_geri_alindi();

-- ═══════════════════════════════════════════════════════════
-- 5 · ARAŞTIRMA GÖRÜNÜMÜ  (kimliksiz)
-- ═══════════════════════════════════════════════════════════
-- Analiz bu görünüm üzerinden yapılır, ham tablo üzerinden değil.
-- Kullanıcı kimliği takma bir anahtara dönüştürülür.

create or replace view olay_anonim as
select encode(digest(kullanici::text || current_setting('app.tuz', true), 'sha256'), 'hex') as takma,
       oturum, ders, adim, tur, deger, date_trunc('hour', zaman) as saat
from   olay;
