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

- [ ] **Kalibrasyon** · güvenilirlik diyagramı, Platt / isotonic
      `bayes-ag[4]` birebir şunu diyor: "ayrı bir kalibrasyon adımı gerekir".
      O ders yok. Ayrıca `lojistik[2]` ve `adillik[3]` de kalibrasyona atıf yapıyor.
      Widget: güvenilirlik diyagramı + kapsama oranı ölçer.

- [ ] **Dengesiz veriyle ne yapılır** · eşik kaydırma, sınıf ağırlığı, yeniden örnekleme
      `metrikler` sorunu kuruyor (accuracy neden yalan söyler) ama çözümü
      hiçbir derste yok. `dagilim-kaymasi[4]` ve `cokdilli[4]` de değiniyor.
      Widget: eşik kaydırıcısı, hatırlama-kesinlik takası canlı.

- [ ] **LoRA / PEFT** · düşük ranklı uyarlama
      `transformer[2]` birebir şunu diyor: "LoRA ve nicemlemenin varlık sebebi budur".
      O ders yok. `transfer[2]` ve `kuantizasyon[1]` de anıyor.
      Widget: rank kaydırıcısı, eğitilen parametre sayısı ve kalite yan yana.

## B · Hiç geçmeyenler

Tarama sonucu: müfredatta tek bir kez bile geçmiyor.

- [ ] **A/B testi ve çevrimiçi değerlendirme**
      `eval` ve `arena` tamamen çevrimdışı. Örneklem büyüklüğü, güç, durdurma kuralı yok.
      Widget: örneklem büyüklüğü ve güç hesabı, erken durdurmanın yanlılığı.

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

- [ ] **Bilgi kuramı** · entropi, KL ıraksaması, karşılıklı bilgi
      12 ayrı derste hesaplanıyor (`agac` Gini, `sampling` entropi, `perplexity`,
      `mdn` KL, `icl` sonsal entropi) ama kavramın kendisi hiçbir yerde anlatılmıyor.

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
2. Kalibrasyon
3. Dengesiz veri
4. A/B testi
5. Bilgi kuramı
6. LoRA / PEFT
7. Üretimde izleme
8. Gizlilik

Bu sekizi widget formatına iyi oturuyor ve toplam 25-30 adım eder
(konu anlatımı ve İngilizcesiyle birlikte).

## Çözülmemiş yerleştirme soruları

- `MoE` ve `çok kipli` hangi rotaya girecek: R3 mü, R4 mü?
- `nedensellik` R1'e mi (istatistiksel temel) yoksa R4'e mi (karar verme) ait?
- `GNN` bu müfredatın kapsamında olmalı mı, yoksa bilinçli olarak dışarıda mı kalsın?
