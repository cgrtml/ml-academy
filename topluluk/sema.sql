-- ML Academy · topluluk: yorumlar, puanlar ve sayaçlar
-- Araştırma katmanından TAMAMEN ayrıdır. Yorum yazmak için araştırma
-- rızası gerekmez, araştırma rızası vermek yorum yazmayı gerektirmez.

-- ═══════════════════════════════════════════════════════════
-- 1 · YÖNETİCİ
-- ═══════════════════════════════════════════════════════════
-- Yorum onaylayabilecek kişiler. Tek satır yeter (senin kullanıcı id'in).
-- Politikalar bu tabloya bakar; yetki istemci tarafında tutulmaz.

create table if not exists yonetici (
  kullanici uuid primary key references auth.users(id) on delete cascade,
  eklendi   timestamptz not null default now()
);

create or replace function yonetici_mi() returns boolean
language sql stable security definer as $$
  select exists (select 1 from yonetici where kullanici = auth.uid());
$$;

-- ═══════════════════════════════════════════════════════════
-- 2 · YORUM ve PUAN
-- ═══════════════════════════════════════════════════════════
-- Kişi başına tek yorum. Düzenlerse tekrar onaya düşer.

create table if not exists yorum (
  id          bigserial primary key,
  kullanici   uuid not null references auth.users(id) on delete cascade,
  puan        int  not null check (puan between 1 and 5),
  metin       text check (char_length(metin) <= 600),
  gorunen_ad  text not null check (char_length(gorunen_ad) between 2 and 40),
  durum       text not null default 'bekliyor'
              check (durum in ('bekliyor','onayli','red')),
  mod_notu    text,                    -- yalnızca yöneticiye görünür
  olusturuldu timestamptz not null default now(),
  guncellendi timestamptz not null default now(),
  onaylandi   timestamptz,
  unique (kullanici)
);

create index if not exists yorum_durum_idx on yorum (durum, onaylandi desc);

-- Düzenlenen yorum yeniden onaya düşer. Yönetici onaylarken bu tetik
-- devreye girmemeli, o yüzden durum değişimi ayrıca kontrol ediliyor.
create or replace function yorum_degisti() returns trigger
language plpgsql as $$
begin
  new.guncellendi := now();
  if (new.metin is distinct from old.metin or new.puan is distinct from old.puan)
     and new.durum = old.durum then
    new.durum := 'bekliyor';
    new.onaylandi := null;
  end if;
  if new.durum = 'onayli' and old.durum <> 'onayli' then
    new.onaylandi := now();
  end if;
  return new;
end $$;

drop trigger if exists yorum_degisti_tetik on yorum;
create trigger yorum_degisti_tetik before update on yorum
for each row execute function yorum_degisti();

-- ═══════════════════════════════════════════════════════════
-- 3 · SATIR DÜZEYİ GÜVENLİK
-- ═══════════════════════════════════════════════════════════

alter table yorum    enable row level security;
alter table yonetici enable row level security;

-- Yönetici tablosunu kimse okuyamaz; yalnızca yonetici_mi() içinden bakılır.
create policy yonetici_gizli on yonetici for select using (false);

-- Okuma: onaylı yorumlar herkese açık, kendi yorumun her hâlükârda sana açık,
-- yönetici hepsini görür.
create policy yorum_oku on yorum for select using (
  durum = 'onayli' or auth.uid() = kullanici or yonetici_mi()
);

-- Yazma: yalnızca kendi adına ve daima 'bekliyor' durumunda.
-- Kullanıcı kendi yorumunu doğrudan onaylayamaz.
create policy yorum_yaz on yorum for insert with check (
  auth.uid() = kullanici and durum = 'bekliyor'
);

create policy yorum_duzenle on yorum for update using (auth.uid() = kullanici)
  with check (auth.uid() = kullanici and durum = 'bekliyor');

create policy yorum_sil on yorum for delete using (auth.uid() = kullanici or yonetici_mi());

-- Yönetici moderasyonu
create policy yorum_moderasyon on yorum for update using (yonetici_mi()) with check (yonetici_mi());

-- ═══════════════════════════════════════════════════════════
-- 3b · DATA API ERİŞİMİ
-- ═══════════════════════════════════════════════════════════
-- Proje "Automatically expose new tables" KAPALI kurulduğu için gerekli.

grant usage on schema public to anon, authenticated;

-- Giriş yapmış kullanıcı kendi yorumunu yazar, düzenler, siler.
grant select, insert, update, delete on yorum to authenticated;
grant usage on sequence yorum_id_seq to authenticated;

-- Anonim ziyaretçi ham tabloyu GÖRMEZ. Onaylı yorumlara yalnızca
-- yorum_acik görünümü üzerinden erişir (aşağıda grant'i var).
-- yonetici tablosuna kimseye grant verilmiyor.

-- ═══════════════════════════════════════════════════════════
-- 4 · GENEL SAYAÇLAR
-- ═══════════════════════════════════════════════════════════
-- Ana sayfada gösterilecek sayılar. Tek bir fonksiyondan gelir ki
-- anonim ziyaretçi ham tabloları görmesin.
--
-- ESİK: yorum sayısı 5'in altındaysa ortalama puan döndürülmez.
-- Tek kişilik "5.0 ortalama" güvenilir görünmez ve ters teper.

create or replace function topluluk_sayaclari()
returns json language sql stable security definer as $$
  select json_build_object(
    'kullanici',      (select count(*) from auth.users),
    'ders_bitiren',   (select count(distinct kullanici) from ilerleme where bitti),
    'yorum',          (select count(*) from yorum where durum = 'onayli'),
    'ortalama_puan',  (select case when count(*) >= 5
                              then round(avg(puan)::numeric, 1) else null end
                       from yorum where durum = 'onayli'),
    'puan_dagilimi',  (select coalesce(json_object_agg(puan, adet), '{}'::json)
                       from (select puan, count(*) as adet from yorum
                             where durum = 'onayli' group by puan) d)
  );
$$;

grant execute on function topluluk_sayaclari() to anon, authenticated;

-- Ana sayfada listelenecek onaylı yorumlar (kimlik sızdırmadan).
create or replace view yorum_acik as
select id, gorunen_ad, puan, metin, onaylandi
from   yorum
where  durum = 'onayli'
order  by onaylandi desc;

grant select on yorum_acik to anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 5 · KURULUM
-- ═══════════════════════════════════════════════════════════
-- Kendini yönetici yap (uuid'yi Supabase > Authentication > Users'tan al):
--   insert into yonetici (kullanici) values ('BURAYA-KENDI-UUID');
--
-- Bekleyen yorumları görmek için (yönetici olarak giriş yapmışken):
--   select id, gorunen_ad, puan, metin, olusturuldu
--   from yorum where durum = 'bekliyor' order by olusturuldu;
--
-- Onaylamak:  update yorum set durum = 'onayli' where id = 12;
-- Reddetmek:  update yorum set durum = 'red', mod_notu = 'sebep' where id = 12;
