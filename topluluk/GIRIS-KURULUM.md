# Google ve GitHub ile giriş · kurulum

Kod tarafı hazır. `sosyalHTML()` düğmeleri çiziyor, `sosyalBagla()` OAuth
akışını başlatıyor. Eksik olan tek şey sağlayıcıların **panelden açılması**.

Sıra önemli: önce Google/GitHub tarafında uygulama oluşturulur, oradan alınan
iki anahtar Supabase'e girilir, en son kod tarafında sağlayıcı listesine
eklenir. Ters sırada yaparsan düğme çıkar ama tıklanınca hata verir.

Her yerde geçecek olan **geri dönüş adresi** bu:

```
https://uhiwcrkwmyjzprmbuyja.supabase.co/auth/v1/callback
```

---

## 0 · Önce Supabase'de adresleri ayarla

Bu adım atlanırsa giriş çalışır ama kullanıcı yanlış adrese döner.

**Supabase → Authentication → URL Configuration**

- **Site URL:** `https://mltraining.org`
- **Redirect URLs:** aşağıdakilerin hepsini ekle

```
https://mltraining.org
https://mltraining.org/
https://mltraining.org/lesson.html
https://mltraining.org/modeller.html
http://localhost:8000
```

Son satır yerel denemeler için. Yerelde farklı bir port kullanıyorsan onu yaz.

Kod `redirectTo` olarak `location.origin + location.pathname` gönderiyor, yani
kullanıcı **hangi sayfadaysa oraya** döner. Bu yüzden üç sayfanın da listede
olması gerekiyor.

---

## 1 · Google

### 1.1 · Google Cloud Console'da proje

1. https://console.cloud.google.com adresine gir
2. Üstte proje seçiciden **New Project**, adı `ML Academy` olsun
3. Proje oluşunca o projeye geç

### 1.2 · İzin ekranı (OAuth consent screen)

**APIs & Services → OAuth consent screen**

- **User Type:** External → Create
- **App name:** ML Academy
- **User support email:** cagritemelusa@gmail.com
- **App logo:** isteğe bağlı
- **Authorized domains:** `mltraining.org` ve `supabase.co`
- **Developer contact:** cagritemelusa@gmail.com
- Save and Continue

**Scopes** adımında ek bir şey seçmene gerek yok, varsayılan
(`email`, `profile`, `openid`) yeterli. Save and Continue.

**Test users** adımında kendi e-postanı ekle. Uygulama "Testing" durumundayken
yalnızca bu listedekiler giriş yapabilir.

> **Önemli:** herkese açmak için sonra **Publish App** demen gerekiyor.
> Yayımlamadan önce yalnızca test kullanıcıları girebilir. Yayımlarken Google
> doğrulama isteyebilir; yalnızca `email`/`profile` kapsamı kullandığın için
> genelde hızlı geçer.

### 1.3 · Kimlik bilgisi

**APIs & Services → Credentials → Create Credentials → OAuth client ID**

- **Application type:** Web application
- **Name:** ML Academy Web
- **Authorized JavaScript origins:**
  ```
  https://mltraining.org
  ```
- **Authorized redirect URIs:**
  ```
  https://uhiwcrkwmyjzprmbuyja.supabase.co/auth/v1/callback
  ```
- Create

Çıkan kutudaki **Client ID** ve **Client Secret** değerlerini kopyala.

### 1.4 · Supabase'e gir

**Supabase → Authentication → Sign In / Providers → Google**

- Enable Sign in with Google: **açık**
- Client ID: yapıştır
- Client Secret: yapıştır
- Save

---

## 2 · GitHub

### 2.1 · OAuth App oluştur

https://github.com/settings/developers → **OAuth Apps → New OAuth App**

- **Application name:** ML Academy
- **Homepage URL:** `https://mltraining.org`
- **Application description:** isteğe bağlı
- **Authorization callback URL:**
  ```
  https://uhiwcrkwmyjzprmbuyja.supabase.co/auth/v1/callback
  ```
- Register application

### 2.2 · Anahtarlar

Açılan sayfada **Client ID** görünür. **Generate a new client secret** deyip
çıkan değeri kopyala.

> Secret yalnızca **bir kez** gösterilir. Kopyalamadan sayfadan çıkarsan
> yenisini üretmen gerekir.

### 2.3 · Supabase'e gir

**Supabase → Authentication → Sign In / Providers → GitHub**

- Enable Sign in with GitHub: **açık**
- Client ID ve Client Secret: yapıştır
- Save

---

## 3 · Kod tarafında aç

`yapilandirma.js` içinde tek satır:

```js
SUPA.saglayicilar = ['email', 'google', 'github'];
```

Yalnızca birini açtıysan yalnızca onu yaz. Panelde açılmamış bir sağlayıcıyı
buraya eklersen düğme çıkar ama tıklandığında hata döner.

Sonra `node surum-damgala.js` çalıştır ve commit et, yoksa tarayıcı eski
dosyayı önbellekten servis eder.

---

## 4 · Ad alanı ne olacak

Kendi kayıt formumuz Ad Soyad ve Ünvan'ı **zorunlu** istiyor. Google ve GitHub
ile gelen kişi o formu hiç görmüyor, dolayısıyla:

- **Ad:** otomatik doluyor. `goc-profil.sql` içindeki tetikleyici sırayla
  `display_name`, `full_name`, `name`, `user_name` anahtarlarına bakıyor;
  hiçbiri yoksa e-postanın `@` öncesini kullanıyor. Yani ad hiçbir zaman boş
  kalmıyor.
- **Ünvan:** boş kalıyor. Kendi formumuzda zorunlu ama OAuth'ta sorulamıyor.

Bu bir tutarsızlık ve bilerek bırakılıyor: OAuth akışının ortasına ek soru
koymak girişin en hızlı yolunu yavaşlatır. Ünvanı sonradan istemek gerekirse
hesap ayarlarına küçük bir tamamlama kutusu eklenebilir.

`audience_breakdown()` fonksiyonu ünvanı boş olanları `—` altında topluyor, yani
sayım bozulmuyor.

---

## 5 · Denemeden önce kontrol listesi

- [ ] Supabase → URL Configuration → Site URL ve Redirect URLs girildi
- [ ] Google Cloud'da OAuth client oluşturuldu, callback adresi doğru
- [ ] Google izin ekranına kendi e-postan test kullanıcısı olarak eklendi
- [ ] GitHub OAuth App oluşturuldu, callback adresi doğru
- [ ] İki sağlayıcının Client ID ve Secret'ı Supabase'e girildi
- [ ] `yapilandirma.js` içinde `saglayicilar` güncellendi
- [ ] `topluluk/goc-profil.sql` Supabase SQL Editor'de çalıştırıldı
- [ ] `node surum-damgala.js` çalıştırıldı ve commit edildi

---

## 6 · Bir şey çalışmazsa

**"redirect_uri_mismatch"** · Google/GitHub tarafındaki callback adresi
Supabase'inkiyle harfi harfine aynı değil. Sonda `/` olup olmamasına kadar
aynı olmalı.

**Giriş oluyor ama yanlış sayfaya dönüyor** · Supabase → URL Configuration →
Redirect URLs listesinde o sayfa yok.

**"Unsupported provider"** · Sağlayıcı Supabase panelinde açılmamış, ama
`yapilandirma.js` içinde listeye eklenmiş.

**Düğme hiç çıkmıyor** · `yapilandirma.js` içinde `saglayicilar` güncellenmemiş
ya da tarayıcı eski dosyayı önbellekten veriyor. `node surum-damgala.js`
çalıştırılıp commit edildi mi kontrol et.
