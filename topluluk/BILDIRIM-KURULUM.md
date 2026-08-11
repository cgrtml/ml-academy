# Yorum bildirimi · kurulum

Bir kullanıcı yıldız verip yorum yazdığında moderatöre e-posta gider.
Onay ve ret yine sitede yapılır; e-posta yalnızca haber verir.

Zincir şöyle işliyor:

```
kullanıcı yorum yazar
   ↓
review tablosuna satır düşer (status = 'pending')
   ↓
Database Webhook tetiklenir
   ↓
yorum-bildirimi (Edge Function)
   ↓
Resend  →  cagritemel34@gmail.com
```

Kod hazır: `supabase/functions/yorum-bildirimi/index.ts`. Geriye üç adım
kalıyor ve hepsi panelden yapılıyor.

---

## 0 · Önce şunu bil: bildirim olmasa da güvendesin

Bildirim bir kolaylık, güvenlik katmanı değil. Koruma zaten veritabanında:

| Katman | Ne yapıyor |
|---|---|
| Kayıt zorunlu | Yorum için doğrulanmış hesap gerekiyor |
| Kişi başına tek yorum | `unique (user_id)` |
| Varsayılan `pending` | Yeni yorum kimseye görünmüyor |
| Kendini onaylayamama | Yazma politikası `status = 'pending'` şartı koyuyor |
| Düzenleme sıraya düşürür | Onaylı yorum değişirse tekrar bekliyor |
| Moderatör tablosu okunamaz | `moderator_hidden` politikası herkese `false` |

Bir bot ordusu yorum yazsa bile hiçbiri yayına çıkmaz. Bildirim sadece
senin haberdar olmanı sağlar.

---

## 1 · Edge Function'ı oluştur

**Supabase → Edge Functions → Deploy a new function → Via Editor**

- **Name:** `yorum-bildirimi`
- Açılan kod kutusundaki her şeyi sil
- `supabase/functions/yorum-bildirimi/index.ts` dosyasının tamamını yapıştır

Panoya almak için:

```
cat supabase/functions/yorum-bildirimi/index.ts | pbcopy
```

**Deploy** de.

> **JWT doğrulaması KAPALI olmalı.** Dağıtım ekranında "Verify JWT with
> legacy secret" ya da benzeri bir seçenek varsa kapat. Sebebi: projenin
> yeni biçim publishable anahtarı (`sb_publishable_...`) bir JWT değil,
> doğrulamadan geçmiyor. Fonksiyon kendi korumasını kullanıyor, aşağıda.

---

## 2 · Üç gizli değer gir

**Edge Functions → Secrets** (bazı sürümlerde **Settings → Edge Functions**)

| Ad | Değer |
|---|---|
| `RESEND_API_KEY` | Resend API anahtarın (`re_...`), SMTP'de kullandığının aynısı |
| `WEBHOOK_SECRET` | Uzun ve rastgele bir dize, aşağıda üretiyoruz |
| `MOD_EPOSTA` | `cagritemel34@gmail.com` |

`WEBHOOK_SECRET` üretmek için terminalde:

```
openssl rand -hex 32
```

Çıkan değeri hem buraya hem bir sonraki adıma gireceksin. Bir yere not al.

> Bu değer neden gerekiyor: Edge Function adresi herkese açık. Gizli
> başlık olmasaydı adresi bilen herkes sana sahte bildirim yağdırabilirdi.
> Fonksiyon, başlık eşleşmezse 401 döndürüp hiçbir şey göndermiyor.

---

## 3 · Database Webhook kur

**Supabase → Database → Webhooks → Create a new hook**

| Alan | Değer |
|---|---|
| Name | `yorum-bildirimi` |
| Table | `review` (schema `public`) |
| Events | **Insert** ve **Update** işaretli, Delete boş |
| Type | **Supabase Edge Functions** |
| Edge Function | `yorum-bildirimi` |
| Method | `POST` |
| Timeout | `5000` ms |

**HTTP Headers** bölümüne bir başlık ekle:

| Header | Value |
|---|---|
| `x-webhook-secret` | 2. adımda ürettiğin değerin **aynısı** |

**Create webhook**.

Neden Update de dinliyoruz: onaylanmış bir yorum düzenlenirse tetikleyici
onu tekrar `pending` yapıyor, o da yeniden onay gerektiriyor. Fonksiyon
yalnızca `pending` durumuna GEÇİŞTE e-posta atıyor; senin onay ve ret
işlemlerin de Update üretiyor ama onlar için e-posta gitmiyor.

---

## 4 · Dene

Siteye başka bir hesapla gir (kendi moderatör hesabınla değil), **Deneyimini
yaz** düğmesinden yıldız ver ve bir şeyler yaz, gönder.

Birkaç saniye içinde `cagritemel34@gmail.com` adresine şu konuyla bir
e-posta düşmeli:

```
ML Academy · yeni yorum onay bekliyor
```

İçinde yazarın adı, yıldızı ve yorum metni olacak.

Sonra kendi hesabınla girdiğinde üst çubukta **Onay bekleyen yorumlar**
düğmesinin yanında turuncu bir sayaç göreceksin.

---

## 5 · Bir şey çalışmazsa

**E-posta gelmiyor** · **Edge Functions → yorum-bildirimi → Logs**. Orada
her istek görünür.

- `401 unauthorized` · `x-webhook-secret` başlığı ile `WEBHOOK_SECRET`
  değeri birbirini tutmuyor. İkisini de yeniden gir.
- `resend hatasi 403` · `RESEND_API_KEY` yanlış ya da izni yetersiz.
- Hiç kayıt yok · webhook kurulmamış ya da yanlış tabloya bağlı.
  **Database → Webhooks** listesinde `review` tablosunda mı bak.

**`{"atlandi":true}` dönüyor** · Fonksiyon çalıştı ama e-posta atmadı.
Bu beklenen davranış: satır `pending` değilse ya da zaten `pending`
durumundan `pending` durumuna geçtiyse haber verilmiyor. Onay/ret
işlemlerinde bunu görürsün.

**Aynı yorum için iki e-posta** · Kullanıcı gönderip hemen düzenlemiştir.
Her `pending` geçişi ayrı bir bildirim üretiyor, bu kasıtlı.
