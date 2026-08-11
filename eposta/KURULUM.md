# noreply@mltraining.org · kurulum

Şu an doğrulama e-postaları `noreply@mail.app.supabase.io` adresinden
geliyor ve tasarımsız. İkisinin sebebi ayrı, çözümü de ayrı:

| Sorun | Sebep | Çözüm |
|---|---|---|
| Gönderen yabancı bir adres | Supabase'in paylaşımlı göndericisi kullanılıyor | Özel SMTP bağla |
| Metin İngilizce ve tasarımsız | Supabase'in varsayılan şablonu | Şablonları değiştir |

**SIRA ÖNEMLİ: önce SMTP, sonra şablonlar.** Supabase şablon düzenlemeyi
özel SMTP'ye bağlamış durumda; SMTP kurulmadan Templates ekranında şu
uyarı çıkıyor ve kutular kilitli kalıyor:

> Set up custom SMTP to edit templates

Yani alan adı doğrulanmadan şablonlara sıra gelmiyor. Bölüm 2'yi bitir,
sonra Bölüm 1'e dön.

DNS notu: `mltraining.org` **GoDaddy**'de duruyor (ad sunucuları
`ns11/ns12.domaincontrol.com`). Alan adında şu an hiç MX ya da TXT kaydı
yok, yalnızca GitHub Pages'in A kayıtları var; eklenecek kayıtlar siteyi
etkilemiyor.

---

## Bölüm 1 · Şablonlar (SMTP kurulduktan SONRA)

Üç dosya hazır:

| Dosya | Supabase'deki şablon | Konu satırı |
|---|---|---|
| `dogrulama.html` | Confirm signup | `ML Academy · confirm your email address` |
| `sifirlama.html` | Reset password | `ML Academy · reset your password` |
| `adres-degistir.html` | Change email address | `ML Academy · confirm your new email address` |

Önce nasıl göründüklerine bak:

```
node eposta/onizle.js
open eposta/onizleme.html
```

Beğendiysen her biri için:

1. **Supabase → Authentication → Emails → Templates**
2. Soldan şablonu seç (önce **Confirm signup**)
3. **Subject heading** kutusuna yukarıdaki konu satırını yaz
4. **Message body** kutusundaki her şeyi sil, ilgili dosyanın **tamamını**
   yapıştır
5. **Save**

Üçü için tekrarla.

> Yapıştırırken dosyanın en üstündeki yorum bloğunu da bırakabilirsin,
> zararı yok; e-postada görünmez. Ama istersen `<!doctype html>` satırından
> başlayarak da alabilirsin.

Denemek için kendine yeni bir hesap aç. Aynı adrese saat başı kaç e-posta
gidebileceği sınırlı, o yüzden her denemede farklı bir adres kullan
(Gmail'de `adin+deneme1@gmail.com` yazımı işe yarar, hepsi aynı kutuya düşer).

---

## Bölüm 2 · Gönderen adresi (DNS gerekir)

Supabase'in yerleşik göndericisi **değiştirilemez** ve iki sınırı var:
gönderen adresi `mail.app.supabase.io` kalır, ve saatte yalnızca birkaç
e-posta gönderir. İkisi de yayına çıkmadan çözülmesi gereken şeyler.

Çözüm bir SMTP sağlayıcısı bağlamak. **Resend** öneriyorum: kurulumu en
kısa olan, ücretsiz katmanı bu ölçek için fazlasıyla yeten sağlayıcı.
SendGrid, Postmark ve Amazon SES de çalışır, adımlar benzer.

### 2.1 · Resend hesabı ve alan adı

1. https://resend.com adresinde hesap aç
2. **Domains → Add Domain**
3. Alan adı olarak `mltraining.org` yaz
4. Resend sana **DNS kayıtları** verir. Tipik olarak üç tane:
   - bir **MX** kaydı (`send` alt alanı için)
   - bir **TXT** kaydı, SPF (yine `send` için)
   - bir **TXT** kaydı, DKIM (`resend._domainkey`)

Ekranda ne yazıyorsa harfi harfine o. Buraya örnek değer yazmıyorum,
çünkü DKIM anahtarı her hesapta farklı ve yanlış kopyalanırsa doğrulama
sessizce başarısız olur.

### 2.2 · Kayıtları DNS'e gir

Alan adı **GoDaddy**'de. Yol:

1. https://dcc.godaddy.com/domains adresine gir
2. `mltraining.org` satırında **DNS** ya da **Manage DNS**
3. **Add New Record** ile Resend'in verdiği kayıtları tek tek ekle

GoDaddy'de alanların adı Resend'inkinden farklı:

| Resend'de yazan | GoDaddy'de karşılığı |
|---|---|
| Type | Type |
| Name / Host | **Name** |
| Value / Content | **Value** |
| Priority (yalnız MX) | **Priority** |
| TTL | **TTL** (1 saat / varsayılan yeterli) |

İki yaygın hata:

- **Ana bilgisayar adını iki kez yazmak.** Panel `resend._domainkey`
  isterken bazı sağlayıcılar alan adını otomatik ekler; sen
  `resend._domainkey.mltraining.org` yazarsan kayıt
  `resend._domainkey.mltraining.org.mltraining.org` olur ve bulunamaz.
- **TXT değerini tırnak içine almak.** Çoğu panel tırnağı kendi ekler.

Kayıtları girdikten sonra Resend'de **Verify** de. Genelde birkaç dakika
sürer, bazen birkaç saat. Yeşil olana kadar bekle.

> Bu adım GitHub Pages'i etkilemez. Site `CNAME` dosyasıyla ayakta
> duruyor ve eklediğin kayıtlar `send` ile `resend._domainkey` alt
> alanlarına ait, kök kayda dokunmuyorsun.

### 2.3 · API anahtarı

Resend'de **API Keys → Create API Key**. Çıkan değer `re_` ile başlar.

> Bu anahtar **gizlidir**. Depoya, `yapilandirma.js` dosyasına ya da
> başka bir yere yazma. Yalnızca Supabase panelindeki SMTP kutusuna
> girilecek. Yanlışlıkla paylaşırsan Resend panelinden iptal edip
> yenisini üret.

### 2.4 · Supabase'e bağla

**Supabase → Project Settings → Authentication → SMTP Settings**
(bazı sürümlerde **Authentication → Emails → SMTP Settings**)

**Enable Custom SMTP** aç ve doldur:

| Alan | Değer |
|---|---|
| Sender email | `noreply@mltraining.org` |
| Sender name | `ML Academy` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | Resend API anahtarın (`re_...`) |

Kaydet.

> Host, port ve kullanıcı adını Resend kendi panelinde de gösteriyor
> (**Domains → SMTP**). Panelde yazan neyse onu kullan; yukarıdakiler
> değişirse doğru kaynak orasıdır.

### 2.5 · Hız sınırını yükselt

Özel SMTP açılınca Supabase'in kendi sınırı hâlâ devrede ve düşük
kalıyor. **Authentication → Rate Limits → "Rate limit for sending
emails"** değerini saatte 100 gibi bir sayıya çek.

Bu, senin bugün karşılaştığın *"For security purposes, you can only
request this after 49 seconds"* uyarısının kaynağıyla akraba ama aynı
şey değil: o uyarı **aynı adrese** art arda istek atınca çıkar ve
kalkmaz. Arayüzdeki çift gönderim kilidi onu zaten engelliyor.

---

## Bölüm 3 · Kontrol listesi

- [ ] Resend hesabı açıldı, `mltraining.org` eklendi
- [ ] Üç DNS kaydı girildi
- [ ] Resend'de alan adı **Verified** göründü
- [ ] API anahtarı üretildi
- [ ] Supabase SMTP ayarları dolduruldu, Sender `noreply@mltraining.org`
- [ ] E-posta hız sınırı yükseltildi
- [ ] Üç şablon Supabase'e yapıştırıldı, konu satırları yazıldı
- [ ] Deneme kaydı yapıldı: gönderen `noreply@mltraining.org`, tasarım yerinde

---

## Bölüm 4 · Bir şey çalışmazsa

**E-posta hiç gelmiyor** · Supabase → **Logs → Auth Logs**. SMTP hatası
varsa orada görünür. En sık sebep yanlış API anahtarı ya da henüz
doğrulanmamış alan adı.

**Spam'e düşüyor** · Alan adı doğrulaması tamamlanmamış olabilir. SPF ve
DKIM yeşil değilse Gmail e-postayı şüpheli sayar. Ayrıca bir **DMARC**
kaydı eklemek güven puanını yükseltir; Resend nasıl olacağını gösteriyor.

**Tasarım bozuk görünüyor** · Şablonun tamamı yapıştırılmamış olabilir.
`Message body` kutusunda `<!doctype html>` ile başlayıp `</html>` ile
bitmeli.

**Bağlantıya tıklayınca yanlış sayfaya gidiyor** · Bu şablonla ilgili
değil, **Authentication → URL Configuration** ile ilgili. Ayrıntı için
`topluluk/GIRIS-KURULUM.md`.

---

## Şablonları neden görsel dosya yerine HTML ile çizdim

Sen "banner gömülü olsun" dedin, ben görsel yerine bandı HTML ile çizdim.
Sebebi tasarım tercihi değil, teslimat:

- **Gmail ve Outlook tanımadığı göndericinin uzak görsellerini engeller.**
  Banner bir PNG olsaydı, ilk e-postada çoğu kullanıcı boş bir kutu
  görürdü. Yani en kritik anda, ilk izlenimde bozuk görünürdü.
- **Gömülü (base64) görsel de çare değil.** Gmail `data:` kaynaklı
  görselleri tamamen atar.
- **HTML ile çizilen bant her ekranda net.** Retina için ikinci dosya,
  karanlık mod için üçüncü dosya gerekmiyor.
- Sitenin kendisi de baştan sona kodla çiziliyor, tek bir görsel dosyası
  yok. E-posta da aynı dili konuşuyor.

Banttaki beş renkli çizgi rastgele değil, sitedeki beş adımın renkleri:
01 HEDEF yeşil, 02 GÖR mavi, 03 OYNA turuncu, 04 SORU mor, 05 ÖZET pembe.

İleride gerçek bir logo görseli istersen, doğru yol onu `mltraining.org`
üzerinde barındırıp `<img>` ile çağırmak ve **görsel engellendiğinde de
e-posta anlamlı kalacak şekilde** tasarlamak olur.
