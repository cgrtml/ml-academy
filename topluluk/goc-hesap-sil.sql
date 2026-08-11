-- ML Academy · hesabı silme
-- ─────────────────────────────────────────────────────────────────────
-- Kayıt penceresi, kilit ekranı ve doğrulama e-postaları "hesabını
-- istediğin zaman silebilirsin" diyordu; silme diye bir şey yoktu.
-- Bu yalnızca eksik bir özellik değil: GDPR 17. madde (silme hakkı) ve
-- KVKK aynı şeyi zaten zorunlu kılıyor.
--
-- Supabase panelinde: SQL Editor → New query → hepsini yapıştır → Run.
--
-- YAZIM KURALI: yorumlar Türkçe, tanımlayıcılar İngilizce.

-- ── neden fonksiyon, neden istemciden doğrudan değil ──
-- Tarayıcıdaki publishable anahtar auth.users tablosuna dokunamaz ve
-- dokunabilmesi de istenmez: o anahtar herkese açıktır. Silme işlemi
-- bu yüzden `security definer` bir fonksiyonla yapılıyor. Fonksiyon
-- yetkiyi sahibinden alır ama YALNIZCA çağıranın kendi satırını siler:
-- `auth.uid()` istemci tarafından değiştirilemez, oturum jetonundan
-- gelir. Yani bir kullanıcı başkasının hesabını silemez.

create or replace function delete_own_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  kim uuid := auth.uid();
begin
  if kim is null then
    raise exception 'not signed in';
  end if;

  /* profile, progress ve review satırları auth.users'a
     `on delete cascade` ile bağlı, yani tek silmeyle hepsi gider.
     Yine de moderator tablosunu açıkça temizliyoruz: oraya yanlışlıkla
     yetim satır kalmasın. */
  delete from moderator where user_id = kim;
  delete from auth.users  where id = kim;
end $$;

revoke all on function delete_own_account() from public, anon;
grant execute on function delete_own_account() to authenticated;

-- ── kontrol ──
-- Tek satır dönmeli: delete_own_account · true (security definer)
select routine_name as fonksiyon,
       security_type = 'DEFINER' as tanimlayici_yetkisi
from   information_schema.routines
where  routine_schema = 'public' and routine_name = 'delete_own_account';
