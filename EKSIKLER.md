# Eksik konular · yapılacaklar

Müfredat 111 ders / 353 adım. Bu dosya **anlatılmayan** konuların listesi.
Adım adım eklenecek; her satır tamamlanınca işaretlenir.

Ölçüm tarihi: 8 Ağustos 2026. Yöntem: `content.js` içindeki bütün
`body / goal / learned / t` alanlarında anahtar terim taraması.

---

## Neden bu liste var

İki şeyi kayda geçirmek gerekiyor, çünkü ikisi de yanlış hatırlanmaya müsait:

1. **Boşlukların sebebi RAG korpusu değil.** `ml-books-rag` korpusundaki
   72 dosyanın kabaca yarısı Python dili kitabı ve mülakat soru derlemesi;
   konu taşıyan gerçek kitap sayısı 20-25 civarı. Ayrıca dersler korpustan
   üretilmedi: 104.346 ders 8-gramına karşı 3.7 milyon korpus 8-gramı
   karşılaştırıldığında örtüşme 9 adet (%0,0086). Kapsam bir tasarım
   kararıydı, korpus sınırı değil.

2. **Boşlukların çoğu "hiç bilinmiyor" değil, "dersi yok".** Aşağıdaki
   konuların büyük kısmı mevcut derslerin içinde bir cümleyle geçiyor ama
   kendi dersi yok.

---

## A · Müfredatın söz verip tutmadıkları

En yüksek öncelik: beklentiyi dersin kendisi yaratıyor, karşılığı yok.

- [x] **Kalibrasyon** · güvenilirlik diyagramı, Platt / isotonik  ✔ 8 Ağustos 2026
      `DERSLER['kalibrasyon']`, Rota 1 (`softmax` sonrası), 4 adım, 220 XP.
      Üç model gerçekten eğitiliyor; veri 700 eğitim / 500 kalibrasyon / 1200 test.
      Ölçülen ECE: lojistik 0.0601, derin ağaç 0.1381, torbalama 0.0385.
      Derin ağaçta düzeltme: 0.1381 → Platt 0.0483 → isotonik 0.0183, AUC sabit.
      Ayrıca `lojistik[2]`'nin "doğal olarak kalibredir" cümlesine koşul eklendi.
      Kapsanmayan: sıcaklık ölçekleme (çok sınıflı), sınıf başına kalibrasyon,
      conformal prediction.

- [x] **Dengesiz veriyle ne yapılır** · eşik, ağırlık, örnekleme  ✔ 8 Ağustos 2026
      `DERSLER['dengesiz']`, Rota 1 (`kalibrasyon` sonrası), 4 adım, 220 XP.
      Ölçülen: %5 pozitifli veride 0.5 eşiğinde doğruluk %96.9 ama hatırlama 0.521.
      En iyi F1 0.39 eşiğinde. Sınıf ağırlığı ve üç yeniden örnekleme yöntemi
      AUC'yi (0.9561-0.9563) ve en iyi F1'i (0.674-0.679) değiştirmiyor,
      yalnızca en iyi eşiği kaydırıyor ve ECE'yi 0.0069'dan 0.10-0.19'a çıkarıyor.
      Kapalı form eşik: t* = C_alarm / (C_alarm + C_kaçırma).
      Kapsanmayan: maliyete duyarlı öğrenme, odak kaybı (focal loss),
      tek sınıf yöntemleri, aşırı dengesizlik (%0.1 altı).

- [ ] **LoRA / PEFT** · düşük ranklı uyarlama
      `transformer[2]` birebir şunu diyor: "LoRA ve nicemlemenin varlık sebebi budur".
      O ders yok. `transfer[2]` ve `kuantizasyon[1]` de anıyor.
      Widget: rank kaydırıcısı, eğitilen parametre sayısı ve kalite yan yana.

## B · Hiç geçmeyenler

Tarama sonucu: müfredatta tek bir kez bile geçmiyor.

- [x] **A/B testi ve çevrimiçi değerlendirme**  ✔ 8 Ağustos 2026
      `DERSLER['ab-testi']`, Rota 4 (`eval` sonrası), 4 adım, 225 XP.
      Ölçülen: taban %10'da %2'lik farkı görmek kol başına 356.336 kullanıcı istiyor.
      A/A testinde yanlış pozitif sadece sonda bakınca %4.9, 20 ara bakışta %24.6.
      Gerçek etki %20 iken n=500'de güç %17 ve anlamlı çıkanların ortalaması %48.1
      (2.41× şişme, Type M hatası).
      Kapsanmayan: çok kollu testler, katmanlı deney altyapısı, CUPED gibi
      varyans azaltma, ağ etkisi olan ortamlarda birim seçimi.

- [ ] **Gizlilik ve kişisel veri** · PII, anonimleştirme, diferansiyel gizlilik
      `adillik` var, gizlilik yok. R4 için ciddi bir eksik.
      Widget: k-anonimlik, yeniden kimliklendirme riski.

- [ ] **MLOps ve üretimde izleme** · yeniden eğitim kararı, geri alma, model kaydı
      `dagilim-kaymasi` kaymayı ölçüyor ama "ne zaman yeniden eğitilir,
      nasıl geri alınır" sorusunun cevabı yok.

- [ ] **MoE (uzman karışımı)**
      R3 güncel mimari gerçekliğini kaçırıyor.

- [ ] **Çok kipli modeller (görsel-dil)**

- [ ] **Grafik sinir ağları (GNN)**

## C · Kullanılıyor ama öğretilmiyor

- [x] **Bilgi kuramı** · entropi, KL ıraksaması, karşılıklı bilgi  ✔ 8 Ağustos 2026
      `DERSLER['bilgi-kurami']`, Rota 1 (`softmax` öncesi), 4 adım, 205 XP.
      Ölçülen: her dağılım için gerçek bir Huffman kodu kuruluyor ve entropinin
      alt sınır olduğu doğrudan sınanıyor. Düzgün 8 sonuçta H = 3.0000 ve
      Huffman = 3.0000; çok eğik dağılımda H = 0.7046 ama Huffman = 1.2420
      (kod tam sayı bit kullanmak zorunda olduğu için 0.5374 bit israf).
      H(p,q) = H(p) + KL(p‖q) özdeşliği her kaydırıcı konumunda 6 basamağa kadar
      doğrulandı. KL'nin simetrik olmadığı ölçüldü: sapma 0.50'de
      KL(p‖q) = 0.2335 ama KL(q‖p) = 0.3526.
      Karşılıklı bilgi gürültüsüz kanalda 1.0000 bit, gürültü 0.50'de tam 0.0000.
      Kapsanmayan: kanal kapasitesi teoremi, MDL, sürekli değişkenlerde MI tahmini
      (kNN tabanlı tahmin ediciler yalnızca anlatımda anılıyor), çapraz entropinin
      özellik seçiminde kullanımı.

- [x] **Zaman serisi** · otokorelasyon, walk-forward doğrulama  ✔ 8 Ağustos 2026
      `DERSLER['zaman-serisi']`, Rota 1, 4 adım, 210 XP.
      Ölçülen: rastgele bölmede R² 0.959, ileri bölmede −1.089, naif taban 0.861.
      Mekanizma: test noktasının en yakın eğitim komşusu rastgele bölmede
      1.07 adım, ileri bölmede 36.00 adım uzakta.
      Kapsanmayan: mevsimsellik ayrıştırma (trendden arındırma), ARIMA/ETS
      gibi klasik yöntemler, çok değişkenli seriler.

- [ ] **Nedensellik** · korelasyon-nedensellik, karıştırıcı, Simpson paradoksu
      Yalnızca `ozellik-onemi[4]` içinde bir cümle.

## D · Kavramsal delik, ama bu formata zor oturuyor

Bunlar R2'nin gerçek eksiği. Ama tarayıcıda gerçekten hesaplanamazlar;
eklenirse ya sahte animasyon olur ya da çok pahalıya mal olur. Müfredatın
**"her sayı gerçekten ölçülür"** kuralını bozmadan eklemenin yolu bulunmadan
başlanmamalı.

- [ ] **Üretici görsel modeller** · VAE → GAN → difüzyon
      `otokodlayici[4]` VAE'yi bir varyant olarak anıyor, öğretmiyor.

---

## Öncelik sırası

1. ~~Zaman serisi~~ ✔ tamamlandı
2. ~~Kalibrasyon~~ ✔ tamamlandı
3. ~~Dengesiz veri~~ ✔ tamamlandı
4. ~~A/B testi~~ ✔ tamamlandı
5. ~~Bilgi kuramı~~ ✔ tamamlandı
6. LoRA / PEFT
7. Üretimde izleme
8. Gizlilik

Bu sekizi widget formatına iyi oturuyor ve toplam 25-30 adım eder
(konu anlatımı ve İngilizcesiyle birlikte).

## Çözülmemiş yerleştirme soruları

- `MoE` ve `çok kipli` hangi rotaya girecek: R3 mü, R4 mü?
- `nedensellik` R1'e mi (istatistiksel temel) yoksa R4'e mi (karar verme) ait?
- `GNN` bu müfredatın kapsamında olmalı mı, yoksa bilinçli olarak dışarıda mı kalsın?
