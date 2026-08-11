# Araştırma katmanı · DURDURULDU

**Karar tarihi:** 10 Ağustos 2026

Bu klasördeki araştırma telemetrisi **yapılmayacak**. Karar gerekçesi:

- Platform ücretsiz kalacak ve ticari bir yönü olmayacak.
- Kullanıcıların karakter ya da davranış profili **çıkarılmayacak**.
- Dolayısıyla etik kurul (IRB) süreci de gerekmiyor.

## Şu anki durum

**Hiçbir veri toplanmadı ve toplanmıyor.** Bu bir niyet beyanı değil, teknik
bir gerçek: bu klasördeki `onay.js` hiçbir sayfaya bağlı değil, `event`
tablosuna yazan kod hiç yazılmadı.

Doğrulama:

```
grep -rn "ONAY\|onay.js" index.html lesson.html modeller.html topluluk/*.js
→ hiçbir sonuç yok
```

## Dosyalar neden duruyor

Silinmedi çünkü tasarımın kendisi (ayrıştırılmış rıza, geri alınabilirlik,
append-only rıza kaydı, RLS politikaları) ileride başka bir bağlamda işe
yarayabilir. Ama **aktif değil** ve aktif hâle getirilmeden önce bu dosyanın
başındaki kararın yeniden gözden geçirilmesi gerekir.

`sema.sql` içindeki `event` ve `consent` tabloları Supabase'de **oluşturulmuş
durumda ama boş**. Kullanılmıyorlar.

## Bunun yerine ne yapılıyor

Sistemi canlı tutan şey topluluk tarafı:

- hesap açma ve giriş (ilerlemeyi cihazlar arası saklamak için)
- yıldızlı değerlendirme ve yorum
- moderasyon: yorumlar okunduktan sonra yayımlanır
- ana sayfada sayaçlar

Bunların hiçbiri davranış profili çıkarmaz. Toplanan tek şey kullanıcının
**kendi yazdığı** yorum ve verdiği puandır.
