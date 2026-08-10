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

- [x] **LoRA / PEFT** · düşük ranklı uyarlama  ✔ 8 Ağustos 2026
      `DERSLER['lora']`, Rota 3 (`kvcache` sonrası), 4 adım, 210 XP.
      Ölçülen: 48×48 matris görev A da eğitildi (%80.0), görev B de uyarlanmadan
      %58.8, tam ince ayarla %74.2. ΔW nin tekil değerleri sekizinciden dokuzuncuya
      1.327 den 0.465 e düşüyor; ilk 8 bileşen Frobenius normunun %94.5 ini tutuyor,
      etkin rank 7.
      Gerçekten LoRA eğitimi yapıldı (W donmuş, yalnızca A ve B öğrenildi):
      r = 8 tam ince ayara birebir oturdu (%74.2 = %74.2), r = 1 bile kazancın
      %90.2 sini geri aldı. r = 16, r = 8 den daha iyi çıkmadı.
      Ölçek kısmı ölçüm değil tam sayı aritmetiği ve derste böyle etiketlendi:
      oran 2r/d, 7B modelde 256 kat.
      Kapsanmayan: prefix/prompt tuning ve BitFit yalnızca anlatımda anılıyor,
      DoRA ve rank-adaptif yöntemler yok, QLoRA nicemleme tarafı `kuantizasyon`
      dersine bırakıldı.

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

- [x] **Gizlilik ve kişisel veri** · PII, anonimleştirme, diferansiyel gizlilik  ✔ 9 Ağustos 2026
      `DERSLER['gizlilik']`, Rota 4 (`adillik` sonrası), 4 adım, 225 XP.
      Ölçülen: 20.000 kişilik nüfusta doğum yılı ve cinsiyet kimseyi ayırt etmiyor,
      ilçe eklenince %44.9, doğum tarihinin tamamı eklenince %99.8 tekil.
      k-anonimlik seviye 2'de ortalama grup 7.9 kişi ve %95.6 uyum var ama en küçük
      grup hâlâ 1 kişilik; gerçek k ≥ 5 seviye 3'te geliyor ve bilginin %45.1'i gidiyor.
      Üyelik çıkarımı saldırısı gerçekten kuruldu: 200 özellik / 200 örnekle eğitilen
      model eğitimde %100.0, testte %73.7 veriyor ve saldırı AUC 0.7384.
      Üç savunma ayrı ayrı ölçüldü ve ikisi beklendiği gibi çıkmadı: gürültü AUC'yi
      0.6427'ye indiriyor ama testi %66.0'a düşürüyor ve 0.5'e hiç inmiyor;
      düzenlileştirme saldırıyı AZALTMIYOR, 0.7602'ye çıkarıyor; yalnızca daha çok
      veri ikisini birden düzeltiyor (AUC 0.5168, test %94.3). Denetim bu üç aykırı
      sonucu ayrıca sınıyor, ters çıkarlarsa hata veriyor.
      Kapsanmayan: ε hesabı yapılmıyor ve ders bunu açıkça söylüyor; gradyan kırpma,
      gizlilik muhasebesi, federe öğrenme, gölge modelli saldırı ve makine unutturma
      yalnızca anlatımda anılıyor.

- [x] **MLOps ve üretimde izleme** · yeniden eğitim kararı, geri alma, model kaydı  ✔ 8 Ağustos 2026
      `DERSLER['izleme']`, Rota 4 (`ab-testi` sonrası), 4 adım, 220 XP.
      Ölçülen: 3000 adımlık kayan akışta hiç eğitilmeyen model %93.0 dan %48.0 a
      düşüyor, yani yazı turadan kötü (kayma ilişkiyi ters çeviriyor).
      Etiket gecikmesi yalıtıldı: yeniden eğitim sayısı beş koşulda da tam 25
      tutularak, gecikme 0 iken %91.4, gecikme 1000 iken %74.3. Kayıp 17.1 puan
      ve tamamen veri altyapısından geliyor.
      Beş politika karşılaştırıldı. Beklenmedik sonuç: "gerçek doğruluğa bak"
      politikası (%84.3) girdi kaymasına bakandan (%86.3) DAHA KÖTÜ, çünkü
      doğruluk gecikmeli, girdi kayması öncü göstergedir. Denetim bu sonucu
      ayrıca kontrol ediyor, ters çıkarsa hata veriyor.
      Geri alma: aynı aday model çevrimdışı %93.8, canlıda %66.7 (27.1 puan).
      Gölge dağıtımda n=25 te %80.0 görünüyor, gerçek %66.7.
      Kapsanmayan: geri besleme döngüleri ve kanarya dağıtımı yalnızca anlatımda
      anılıyor, özellik deposu (feature store) yok, eğitim-servis tutarsızlığı
      (training-serving skew) ayrı bir ders olarak ele alınmadı.

- [x] **MoE (uzman karışımı)**  ✔ 9 Ağustos 2026
      `DERSLER['moe']`, Rota 3 (`olcek-yasalari` sonrası), 4 adım, 220 XP.
      Yerleştirme kararı: ölçek yasaları dersi büyütmenin bedelini anlatıyor,
      MoE tam olarak o bedeli kıran yöntem. Bu yüzden hemen ardından geliyor.
      Ölçülen: 8 uzman, 24 boyut, veride 4 gizli küme. Yönlendiriciye küme
      etiketi HİÇ verilmedi ve eğitim sonunda her küme tek bir uzmana %100'e
      yakın eşleşti (0→u0, 1→u2, 2→u1, 3→u5). Gözetimsiz işbölümü.
      8 uzmandan 4'ü hiç seçilmedi, ve veride tam olarak 4 küme var.
      Denge kaybı bu çöküşü açamadı: ağırlık 2.0'da bile yalnızca bir uzman
      canlandı, ve bastırdıkça doğruluk %96.33'ten %96.13'e düştü. Yani denge
      kaybı burada gerçek yapıya karşı savaşıyor.
      top-k taraması: top-1 hem en ucuz hem en doğru (%12.5 çalışma, %96.33),
      yoğun model (top-8) %100 çalışıp %94.50 veriyor.
      Ölçek kısmı ölçüm değil tam sayı aritmetiği ve derste böyle etiketlendi:
      128 uzman top-2 ile toplam 549.8B, aktif 8.59B, oran %1.56 (64 kat).
      Denetim dört aykırı sonucu ayrıca sınıyor: aktif parametrenin uzman
      sayısından bağımsız olması, her kümenin tek uzmana eşleşmesi, denge
      kaybının doğruluğu düşürmesi ve seyreğin yoğunu geçmesi.
      Kapsanmayan: gürültülü yönlendirme, kapasite faktörü ve token düşürme,
      paylaşılan uzman tasarımı, all-to-all iletişim maliyeti ve MoE ince
      ayarının kırılganlığı yalnızca anlatımda anılıyor.

- [x] **Çok kipli modeller (görsel-dil)**  ✔ 9 Ağustos 2026
      `DERSLER['cokkipli']`, Rota 3 (`temel-model` sonrası), 4 adım, 225 XP.
      CLIP'in çekirdeği (InfoNCE kontrastif kayıp) gerçekten eğitildi.
      Ölçülen: görsel ham boyut 16, metin 20, ortak eksen yok, 6 gizli kavram ve
      modele kavram etiketi hiç verilmedi. Sıfır-atış sınıflandırma eğitimsiz
      %5.56 (şans %16.67'nin ALTINDA), kontrastif eğitimden sonra %77.33.
      Geri getirme top-1 %2.00 ve top-5 %10.00 çıktı; bunlar tam olarak kuramsal
      tavan (1/50 ve 5/50), çünkü aynı kavramdaki 50 çifti ayıran bilgi veride
      yok. Model tavana birebir oturuyor.
      Kiplik boşluğu ölçüldü: bir görsel kendi metnine 0.1499, başka bir görsele
      0.2128 benziyor. Tek bir yön iki kipi %100.00 doğrulukla ayırıyor. Liang
      2022'nin CLIP'te ölçtüğü olgu burada da çıktı.
      Sıcaklıkta CLIP'in tersine yüksek τ kazandı (%83.67) ve ders bunun sebebini
      açıkça veriyor: 6 kavram ve 64'lük toplu işta ortalama 10 yanlış negatif var.
      Negatif sayısı ise beklenen yönde: toplu iş 8'de %75.78, 128'de %83.11.
      Uygulamada bir hata bulunup düzeltildi: ilk yazımda L2 normalizasyonun
      türevi ihmal edilmişti ve düşük sıcaklıkta adım patlıyordu. Doğru izdüşüm
      ve RMSProp eklendikten sonra sıfır-atış %33.67'den %77.33'e çıktı.
      Kapsanmayan: gerçek görsel kodlayıcı (ViT) ve metin kodlayıcı yok, alt
      yazı üretimi yok, SigLIP gibi ikili kayıp alternatifleri ve boşluk kapatma
      yöntemleri yalnızca anlatımda anılıyor.

- [~] **Grafik sinir ağları (GNN)** · BİLİNÇLİ OLARAK KAPSAM DIŞI  ·  9 Ağustos 2026
      Karar: bu müfredata girmeyecek. Gerekçe, omurganın tablo verisi, görüntü ve
      metin üzerine kurulu olması. Grafik ayrı bir veri tipi ailesi ve tek derste
      anlatılırsa yüzeysel kalır: komşuluk toplama, mesaj geçirme, aşırı düzleşme
      (over-smoothing) ve örnekleme stratejileri en az dört adım ister, ve öncesinde
      grafik gösterimi diye ayrı bir temel gerekir.
      Yarım anlatmaktansa dışarıda bırakmak daha dürüst. Bu satır kararın kendisidir,
      atlanmış bir madde değil. İleride grafik verisi kendi rotasını hak ederse
      yeniden açılır.

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

- [x] **Nedensellik** · korelasyon-nedensellik, karıştırıcı, Simpson paradoksu  ✔ 9 Ağustos 2026
      `DERSLER['nedensellik']`, **Rota 1** (`dagilim-kaymasi` öncesi), 4 adım, 230 XP.
      Yerleştirme kararı: R4 değil R1. Sebep, Simpson paradoksu ve karıştırıcının
      istatistiksel temel olması; R4'e konsaydı kullanıcı R1'deki regresyon
      derslerinde yanlış sezgiyi çoktan kurmuş olurdu.
      Ölçülen: gerçek nedensel etki −0.60 olarak kuruldu. Karıştırıcı yokken ham
      regresyon −0.6066 veriyor (yani sorun regresyonda değil), güç 0.3'te
      −0.0732 (ilişki yok gibi görünüyor), güç 1.2'de +1.1004 (işaret ters).
      Z kontrol edilince her güçte −0.6065.
      Simpson: Charig 1986 böbrek taşı verisi. A her iki grupta kazanıyor
      (%93.1 > %86.7 ve %73.0 > %68.8) ama toplamda kaybediyor (%78.0 < %82.6).
      Çarpışıcı: X ve Y bağımsız üretildi, ham katsayı 0.0052. C kontrol edilince
      −0.9603 doğuyor, yani kontrol etmek sapmayı düzeltmedi, yarattı.
      Rastgeleleştirme: aynı karıştırıcı gücünde gözlemsel katsayı −0.6066'dan
      +1.2185'e savrulurken deneysel katsayı −0.5953 ile −0.5732 arasında kalıyor,
      ve deneyde Z hiç ölçülmedi.
      Denetim dört aykırı sonucu ayrıca sınıyor: işaret çevrilmesi, Simpson'ın
      gerçekten oluşması, çarpışıcının sahte ilişki üretmesi ve rastgeleleştirmenin
      gözlemselden en az beş kat iyi olması.
      Kapsanmayan: do-operatörü gösterimi, DAG çizimi ve d-ayrımı, araç değişkeni,
      süreksizlik tasarımı ve fark-içinde-fark yalnızca anlatımda anılıyor.

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
6. ~~LoRA / PEFT~~ ✔ tamamlandı
7. ~~Üretimde izleme~~ ✔ tamamlandı
8. ~~Gizlilik~~ ✔ tamamlandı

Bu sekizi widget formatına iyi oturuyor ve toplam 25-30 adım eder
(konu anlatımı ve İngilizcesiyle birlikte).

## Çözülmemiş yerleştirme soruları

- `MoE` ve `çok kipli` hangi rotaya girecek: R3 mü, R4 mü?
- `nedensellik` R1'e mi (istatistiksel temel) yoksa R4'e mi (karar verme) ait?
- `GNN` bu müfredatın kapsamında olmalı mı, yoksa bilinçli olarak dışarıda mı kalsın?
