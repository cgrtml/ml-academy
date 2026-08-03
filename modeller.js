/* ═══════════════════════════════════════════════════════════════
   MODEL KATALOĞU
   Her model için: ne yapar · nasıl çalışır · ne zaman kullan ·
   ne zaman kullanma · gerçek kod · kilit ayarlar · klasik tuzak
   ═══════════════════════════════════════════════════════════════ */

const GOREVLER = {
  reg:   {ad:'Regresyon',        renk:'#4cc4ff', ac:'sayı tahmin et'},
  sin:   {ad:'Sınıflandırma',    renk:'#22d3a0', ac:'kategori tahmin et'},
  kume:  {ad:'Kümeleme',         renk:'#fb923c', ac:'etiketsiz grup bul'},
  boyut: {ad:'Boyut indirgeme',  renk:'#a78bfa', ac:'sıkıştır / görselleştir'},
  anom:  {ad:'Anomali',          renk:'#f87171', ac:'aykırıyı yakala'},
  uret:  {ad:'Üretici',          renk:'#f472b6', ac:'yeni içerik üret'},
  dil:   {ad:'Dil / LLM',        renk:'#facc15', ac:'metinle çalış'},
};

const MODELLER = [
/* ─────────────── TEMEL ─────────────── */
{
  id:'linreg', ad:'Linear Regression', gorev:['reg'], seviye:'temel',
  bir:'Veriye düz bir çizgi (veya düzlem) uydurup sayısal bir değer tahmin eder.',
  nasil:'Her özelliğe bir ağırlık atar, hepsini toplar. Ağırlıklar, tahmin ile gerçek arasındaki kare hataların toplamını en küçük yapacak şekilde seçilir. Kapalı formülü de vardır, gradient descent ile de bulunabilir.',
  neZaman:['İlişki kabaca doğrusalsa','Katsayıları yorumlamak istiyorsan ("her ek saat +7.7 puan")','Temel çizgi (baseline) kurarken, her projede ilk denenmesi gereken model'],
  neZamanDegil:['İlişki eğriyse (önce özellik mühendisliği veya polinom gerekir)','Aykırı değerler çoksa (kare hata onları abartır → Huber kullan)','Özellikler birbirinin kopyasıysa (çoklu doğrusallık → Ridge/Lasso)'],
  kod:`from sklearn.linear_model import LinearRegression
model = LinearRegression().fit(X_train, y_train)
print(model.coef_, model.intercept_)   # yorumlanabilir katsayılar
y_pred = model.predict(X_test)`,
  hiper:[['fit_intercept','sabit terim (b) öğrenilsin mi'],['-','ayarlanacak hiperparametresi yok; sadeliği avantajı']],
  tuzak:'R² yüksek diye ilişkinin doğrusal olduğunu sanmak. Mutlaka artıkları (residual) çiz, desen varsa model yanlış.',
  ders:'nasil-ogrenir',
},
{
  id:'ridge', ad:'Ridge / Lasso / ElasticNet', gorev:['reg'], seviye:'temel',
  bir:'Linear regression + ağırlıkları küçük tutmaya zorlayan bir ceza. Aşırı uyumu bastırır.',
  nasil:'Kayıp fonksiyonuna ağırlıkların büyüklüğü eklenir. Ridge kareyi (L2) cezalandırır → ağırlıklar küçülür. Lasso mutlak değeri (L1) cezalandırır → bazı ağırlıklar tam sıfır olur, yani özellik seçimi yapar.',
  neZaman:['Özellik sayısı örnek sayısına yakın veya fazlaysa','Özellikler birbiriyle bağlantılıysa (Ridge)','Otomatik özellik seçimi istiyorsan (Lasso)'],
  neZamanDegil:['Az özellik + bol veri varsa (düz linear yeter)','Özellikleri ölçeklendirmediysen, ceza yanlış çalışır'],
  kod:`from sklearn.linear_model import Ridge, Lasso
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

# ÖLÇEKLEME ŞART, yoksa ceza büyük ölçekli özelliği haksız cezalandırır
model = make_pipeline(StandardScaler(), Ridge(alpha=1.0)).fit(X, y)`,
  hiper:[['alpha','ceza gücü. Büyük = daha basit model, daha çok yanlılık'],['l1_ratio','ElasticNet\'te L1/L2 karışım oranı']],
  tuzak:'Ölçeklemeyi unutmak. Ridge/Lasso ölçeğe duyarlıdır; StandardScaler olmadan sonuç anlamsızdır.',
  ders:'ezberleme',
},
{
  id:'logreg', ad:'Logistic Regression', gorev:['sin'], seviye:'temel',
  bir:'Doğrusal bir sınırla iki (veya çok) sınıfı ayırır ve olasılık üretir.',
  nasil:'Ağırlıklı toplamı sigmoid\'den geçirir → 0–1 arası olasılık. Kayıp olarak çapraz entropi kullanır ve gradient descent ile eğitilir. Adında "regression" var ama işi sınıflandırmadır.',
  neZaman:['Kalibre olasılık istediğinde ("%73 ihtimalle dolandırıcılık")','Katsayı yorumu gerektiğinde, kredi, sağlık, denetim','Hızlı, sağlam bir temel çizgi olarak'],
  neZamanDegil:['Sınır eğriyse (halka içinde halka gibi)','Özellikler arası etkileşim önemliyse (elle eklemen gerekir)'],
  kod:`from sklearn.linear_model import LogisticRegression
model = LogisticRegression(max_iter=1000, class_weight='balanced').fit(X, y)
proba = model.predict_proba(X_test)[:, 1]   # ham olasılık, eşiği SEN seç
import numpy as np
y_pred = (proba > 0.3).astype(int)          # 0.5 kutsal bir sayı değil`,
  hiper:[['C','ceza gücünün TERSİ. Küçük C = güçlü ceza'],['class_weight','dengesiz sınıflarda "balanced" yap'],['solver','lbfgs (varsayılan), liblinear (küçük veri), saga (L1 + büyük veri)']],
  tuzak:'0.5 eşiğini sorgusuz kabul etmek. Dengesiz veride doğru eşik ROC/PR eğrisinden seçilir.',
  ders:null,
},
{
  id:'knn', ad:'k-Nearest Neighbors', gorev:['sin','reg'], seviye:'temel',
  bir:'Yeni örneğe en yakın k komşuya bakar, çoğunluk ne diyorsa onu söyler.',
  nasil:'Eğitim yapmaz, tüm veriyi hafızada tutar. Tahmin anında uzaklıkları hesaplar, en yakın k tanesini bulur, oy verdirir. Buna "tembel öğrenme" denir.',
  neZaman:['Küçük veri kümelerinde hızlı bir temel çizgi olarak','Karar sınırı çok düzensiz ve yerel ise','Öneri sistemlerinde benzer öğe bulmada'],
  neZamanDegil:['Veri büyükse, her tahmin tüm veriyi gezer','Boyut yüksekse, uzaklık kavramı anlamını yitirir (boyut laneti)','Özellikler farklı ölçeklerdeyse (ölçekleme zorunlu)'],
  kod:`from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

model = make_pipeline(
    StandardScaler(),                       # uzaklık tabanlı → ölçekleme ŞART
    KNeighborsClassifier(n_neighbors=5, weights='distance')
).fit(X, y)`,
  hiper:[['n_neighbors','k. Küçük = gürültüye duyarlı, büyük = sınır bulanık'],['weights','uniform / distance (yakın komşu daha çok oy)'],['metric','euclidean, manhattan, cosine']],
  tuzak:'Çift sayılı k seçip berabere kalmak; ve ölçeklemeyi atlamak, geliri TL, yaşı yıl olan veride gelir her şeyi ezer.',
  ders:null,
},
{
  id:'nb', ad:'Naive Bayes', gorev:['sin'], seviye:'temel',
  bir:'Bayes kuralıyla olasılık hesaplar; tüm özelliklerin birbirinden bağımsız olduğunu varsayar.',
  nasil:'P(sınıf | özellikler) ∝ P(sınıf) × ∏ P(özellik | sınıf). "Naive" (saf) olması, çarpımdaki bağımsızlık varsayımından gelir, gerçekte neredeyse hiç doğru değildir, ama şaşırtıcı biçimde işe yarar.',
  neZaman:['Metin sınıflandırma, spam, duygu analizi, konu etiketleme','Çok yüksek boyut + az veri','Anında eğitim gerektiğinde (tek geçiş yeter)'],
  neZamanDegil:['Özellikler güçlü ilişkiliyse','Kalibre olasılık gerekiyorsa, NB olasılıkları aşırı uç verir (0.99 / 0.01)'],
  kod:`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

model = make_pipeline(TfidfVectorizer(), MultinomialNB(alpha=1.0)).fit(metinler, etiketler)`,
  hiper:[['alpha','Laplace düzeltmesi, eğitimde görülmemiş kelime olasılığı sıfırlamasın'],['GaussianNB / MultinomialNB / BernoulliNB','sürekli / sayım / ikili veriye göre seç']],
  tuzak:'NB\'nin olasılıklarına karar eşiği olarak güvenmek. Sıralaması iyidir, kalibrasyonu kötüdür.',
  ders:null,
},
/* ─────────────── AĞAÇLAR ─────────────── */
{
  id:'tree', ad:'Decision Tree (CART)', gorev:['sin','reg'], seviye:'orta',
  bir:'Art arda evet/hayır soruları sorarak veriyi böler; her yaprak bir tahmin verir.',
  nasil:'Her düğümde tüm olası eşikleri tarar, bölünmeyi en çok "saflaştıranı" seçer (Gini veya entropi). Açgözlüdür: o anki en iyiyi alır, geleceği düşünmez. Türev kullanmaz.',
  neZaman:['Kararı bir insana cümleyle anlatman gerektiğinde','Özellikler karışık tipteyse (sayısal + kategorik)','Ölçekleme yapmak istemiyorsan, ağaçlar ölçeğe duyarsızdır'],
  neZamanDegil:['Tek başına doğruluk istiyorsan, kararsızdır, veri biraz değişse ağaç tamamen değişir','Sınır eğik/doğrusalsa, ağaç sadece dikey-yatay keser, merdiven yapar'],
  kod:`from sklearn.tree import DecisionTreeClassifier, export_text
model = DecisionTreeClassifier(max_depth=4, min_samples_leaf=20).fit(X, y)
print(export_text(model, feature_names=list(X.columns)))   # kuralları oku`,
  hiper:[['max_depth','derinlik. Sınırlamazsan her örneği ezberler'],['min_samples_leaf','yaprakta en az kaç örnek, aşırı uyuma karşı en etkili fren'],['criterion','gini / entropy, pratikte farkı küçüktür']],
  tuzak:'Derinliği sınırlamamak. Sınırsız ağaç eğitim doğruluğunu %100 yapar ve hiçbir şey öğrenmemiştir.',
  ders:'soft-split',
},
{
  id:'rf', ad:'Random Forest', gorev:['sin','reg'], seviye:'orta',
  bir:'Yüzlerce farklı ağaç yetiştirir, hepsine oy verdirir. Tek ağacın kararsızlığını yok eder.',
  nasil:'Her ağaç, verinin rastgele bir örneklemiyle (bootstrap) ve her bölünmede rastgele bir özellik alt kümesiyle eğitilir. Bu iki rastgelelik ağaçları birbirinden farklı kılar; ortalamaları alınınca varyans düşer. Buna bagging denir.',
  neZaman:['Tablo verisinde ilk ciddi model olarak, ayar yapmadan iyi çalışır','Özellik önemi görmek istediğinde','Aşırı uyuma karşı doğal dirence ihtiyaç varsa'],
  neZamanDegil:['Tek bir kuralı gerekçe olarak sunman gerekiyorsa (yorumlanabilirlik kaybolur)','Bellek/hız kritikse, 500 ağaç yer kaplar','Doğrusal ilişki varsa (gereksiz karmaşıklık)'],
  kod:`from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(
    n_estimators=500, max_features='sqrt',
    min_samples_leaf=2, n_jobs=-1, random_state=42).fit(X, y)

import pandas as pd
print(pd.Series(model.feature_importances_, index=X.columns).sort_values(ascending=False))`,
  hiper:[['n_estimators','ağaç sayısı. Çok olması zarar vermez, sadece yavaşlatır'],['max_features','her bölünmede kaç özellik denensin, çeşitliliğin kaynağı'],['min_samples_leaf','tek fren; 1 bırakırsan her ağaç ezberler (ama ortalama kurtarır)']],
  tuzak:'feature_importances_ değerlerini nedensellik sanmak. Yüksek kardinaliteli özellikleri şişirir; permutation importance veya SHAP kullan.',
  ders:null,
},
{
  id:'gbm', ad:'Gradient Boosting (XGBoost / LightGBM / CatBoost)', gorev:['sin','reg'], seviye:'ileri',
  bir:'Ağaçları sırayla ekler; her yeni ağaç, önceki ağaçların yaptığı hatayı düzeltmeye çalışır.',
  nasil:'Random Forest ağaçları paralel ve bağımsız yetiştirir; boosting ise sıralı yetiştirir. Her adımda kalan hatanın (residual) gradyanına bir ağaç uydurulur. Yavaş yavaş, adım adım hata azaltılır.',
  neZaman:['Tablo verisinde en yüksek doğruluğu istiyorsan, Kaggle\'ın kral modeli','Karışık tipli, eksik değerli gerçek dünya verisinde (LightGBM/CatBoost doğrudan yönetir)','Orta ölçekli veride (bin – birkaç milyon satır)'],
  neZamanDegil:['Görüntü/ses/metin ham verisinde, derin öğrenme daha iyi','Çok az veri varsa, kolayca ezberler','Ayar yapacak vaktin yoksa (RF daha affedicidir)'],
  kod:`import lightgbm as lgb
model = lgb.LGBMClassifier(
    n_estimators=2000, learning_rate=0.03,
    num_leaves=31, subsample=0.8, colsample_bytree=0.8).fit(
    X_tr, y_tr,
    eval_set=[(X_val, y_val)],
    callbacks=[lgb.early_stopping(100)])   # ERKEN DURDURMA ŞART`,
  hiper:[['learning_rate','küçük = daha iyi ama daha yavaş. 0.01–0.1 arası'],['n_estimators','learning_rate ile ters ilişkili; erken durdurma ile birlikte kullan'],['num_leaves / max_depth','model karmaşıklığı, aşırı uyumun ana kaynağı'],['subsample / colsample','satır ve sütun örnekleme, düzenlileştirme']],
  tuzak:'Erken durdurmasız eğitmek. Boosting durmazsa mutlaka ezberler; doğrulama seti ile early_stopping olmazsa olmaz.',
  ders:null,
},
{
  id:'softtree', ad:'Soft Decision Tree', gorev:['sin','reg'], seviye:'ileri', rozet:'neural-trees',
  bir:'Karar ağacının sert eşiğini sigmoide çevirir; ağaç böylece gradient descent ile eğitilebilir hâle gelir.',
  nasil:'Klasik düğüm "x > t ? sağ : sol" der ve türevi sıfırdır. Soft düğüm σ((x−t)/T) döndürür: her örnek iki dala da ağırlıkla gider. Sıcaklık T bir kadrandır, T→0 klasik ağaca, T büyüdükçe sinir ağına yaklaşır.',
  neZaman:['Hem gerekçe hem esneklik gerektiğinde, denetimli sektörler (banka, sağlık)','Eşik kenarındaki sert sıçramalar sorun olduğunda','Ağacı bir sinir ağı boru hattına uçtan uca takmak istediğinde'],
  neZamanDegil:['Sadece doğruluk istiyorsan (GBM genelde önde)','Tam kesin kural listesi gerekiyorsa (soft yapı olasılıklıdır)'],
  kod:`# pip install neural-trees
from neural_trees import SoftDecisionTree
model = SoftDecisionTree(depth=4, temperature=0.5, lr=0.01)
model.fit(X_train, y_train, epochs=200)

# klasik ağaçla İSTATİSTİKSEL karşılaştır, sadece accuracy'ye bakma
from neural_trees.stats import cv52_f_test
f, p = cv52_f_test(model, DecisionTreeClassifier(max_depth=4), X, y)`,
  hiper:[['temperature (T)','yorumlanabilirlik ↔ esneklik kadranı. Küçük T = ağaca yakın'],['depth','ağaç derinliği, parametre sayısı 2^depth ile büyür'],['lr','gradient descent adım boyu']],
  tuzak:'T\'yi çok büyük seçip yorumlanabilirliği kaybetmek, o noktada zaten bir MLP eğitiyorsun demektir.',
  ders:'soft-split',
},
{
  id:'svm', ad:'Support Vector Machine', gorev:['sin','reg'], seviye:'orta',
  bir:'Sınıfları en geniş boşlukla ayıran sınırı arar; çekirdek hilesiyle bu sınır eğri olabilir.',
  nasil:'Sadece sınıra en yakın örnekleri (destek vektörleri) dikkate alır. RBF çekirdeği veriyi zihinsel olarak yüksek boyuta taşır ve orada düz bir düzlemle ayırır, gerçekte o boyuta hiç çıkmaz, sadece iç çarpımları hesaplar.',
  neZaman:['Orta boy veri (< ~100 bin satır) + yüksek boyut','Metin sınıflandırma (doğrusal SVM hâlâ çok güçlü)','Net bir marj varsa'],
  neZamanDegil:['Büyük veride, eğitim O(n²)–O(n³) ölçeklenir','Olasılık gerektiğinde (SVM doğal olasılık üretmez)','Yorumlanabilirlik gerektiğinde'],
  kod:`from sklearn.svm import SVC
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

model = make_pipeline(StandardScaler(),
    SVC(kernel='rbf', C=1.0, gamma='scale')).fit(X, y)`,
  hiper:[['C','hata toleransı. Büyük C = eğitim hatasına tahammülsüz = aşırı uyum riski'],['gamma','RBF genişliği. Büyük gamma = her nokta kendi adacığını kurar'],['kernel','linear (metin), rbf (genel), poly']],
  tuzak:'Ölçeklemeden kullanmak ve C ile gamma\'yı birlikte aramamak, ikisi etkileşimlidir, grid search şart.',
  ders:null,
},
/* ─────────────── GÖZETİMSİZ ─────────────── */
{
  id:'kmeans', ad:'k-Means', gorev:['kume'], seviye:'temel',
  bir:'Veriyi k gruba böler: her nokta en yakın merkeze atanır, merkezler noktalarının ortasına taşınır, tekrarlanır.',
  nasil:'İki adım dönüşümlü tekrarlanır, ata, güncelle. Küme içi kare uzaklık toplamını (inertia) küçültür. Yerel optimuma takılabilir, bu yüzden farklı başlangıçlarla defalarca çalıştırılır.',
  neZaman:['Müşteri segmentasyonu, belge gruplama','Kümeler kabaca küresel ve benzer boyuttaysa','Hızlı bir keşif aracı olarak'],
  neZamanDegil:['Kümeler uzun/halka/iç içe şekilliyse (DBSCAN kullan)','k\'yı bilmiyorsan (dirsek yöntemi + silhouette gerekir)','Aykırı değerler varsa, merkezleri çeker'],
  kod:`from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

for k in range(2, 9):
    km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(X)
    print(k, km.inertia_, silhouette_score(X, km.labels_))   # k'yı BÖYLE seç`,
  hiper:[['n_clusters','k, sen vermek zorundasın, model bulmaz'],['n_init','kaç farklı başlangıç denensin. 10 makul, 1 tehlikeli'],['init','k-means++ (varsayılan) merkezleri bilerek uzak seçer']],
  tuzak:'n_init=1 ile çalıştırmak. Kötü başlangıçta bir merkez ölü kalır ve algoritma bunu fark etmez.',
  ders:'kumeleme',
},
{
  id:'dbscan', ad:'DBSCAN', gorev:['kume','anom'], seviye:'orta',
  bir:'Yoğun bölgeleri küme sayar; seyrek kalanları gürültü olarak işaretler. Küme sayısını sen vermezsin.',
  nasil:'Bir noktanın eps yarıçapı içinde en az min_samples komşusu varsa "çekirdek nokta" olur. Çekirdek noktalar zincirleme birleşerek kümeleri oluşturur. Hiçbir kümeye ulaşamayan noktalar −1 etiketi alır.',
  neZaman:['Kümeler garip şekilliyse (hilal, halka, uzun şerit)','Küme sayısını bilmiyorsan','Aykırı değer tespiti de istiyorsan, bedavaya gelir'],
  neZamanDegil:['Kümelerin yoğunlukları çok farklıysa (HDBSCAN dene)','Boyut yüksekse, eps anlamsızlaşır','eps için sezgin yoksa (k-uzaklık grafiği çizmen gerekir)'],
  kod:`from sklearn.cluster import DBSCAN
import numpy as np
db = DBSCAN(eps=0.4, min_samples=8).fit(X)
print('küme:', len(set(db.labels_)) - (1 if -1 in db.labels_ else 0))
print('gürültü:', np.sum(db.labels_ == -1))`,
  hiper:[['eps','komşuluk yarıçapı, en kritik ayar'],['min_samples','çekirdek olmak için gereken komşu sayısı; genelde 2×boyut']],
  tuzak:'eps\'i gözü kapalı seçmek. Önce k-uzaklık grafiği çiz, dirseğin olduğu yeri al.',
  ders:null,
},
{
  id:'pca', ad:'PCA (Temel Bileşen Analizi)', gorev:['boyut'], seviye:'orta',
  bir:'Veriyi, varyansın en çok olduğu yeni eksenlere döndürerek boyutu düşürür.',
  nasil:'Kovaryans matrisinin özvektörlerini bulur. Birinci bileşen verinin en çok yayıldığı yön, ikincisi ona dik olan en yayılan yön, vb. İlk birkaç bileşen genelde varyansın çoğunu taşır.',
  neZaman:['Özellik sayısı çok, gürültü fazlaysa','Görselleştirme için 2–3 boyuta indirirken','Modelden önce hız kazanmak istediğinde'],
  neZamanDegil:['Özellik yorumu gerekiyorsa, bileşenler karışımdır, anlamı yoktur','İlişki doğrusal değilse (UMAP/t-SNE veya kernel PCA)','Ölçeklemediysen, büyük ölçekli özellik tüm bileşenleri ele geçirir'],
  kod:`from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
Xs = StandardScaler().fit_transform(X)
p = PCA(n_components=0.95).fit(Xs)      # varyansın %95'ini koru
print(p.n_components_, p.explained_variance_ratio_[:5])`,
  hiper:[['n_components','sayı verirsen o kadar bileşen, 0.95 verirsen o kadar varyans']],
  tuzak:'PCA\'yı tüm veriye uygulayıp sonra train/test bölmek. Bu veri sızıntısıdır, PCA yalnızca eğitim setine fit edilir.',
  ders:null,
},
{
  id:'tsne', ad:'t-SNE / UMAP', gorev:['boyut'], seviye:'orta',
  bir:'Yüksek boyutlu veriyi 2 boyuta, komşuluk ilişkilerini koruyarak indirir. Sadece görselleştirme içindir.',
  nasil:'Yüksek boyutta birbirine yakın noktaların, düşük boyutta da yakın kalmasını sağlayan bir yerleşim arar. PCA gibi doğrusal bir dönüşüm değildir; sonuç her çalıştırmada değişebilir.',
  neZaman:['Embedding uzayını gözle görmek istediğinde','Kümelerin gerçekten ayrışıp ayrışmadığını kontrol ederken'],
  neZamanDegil:['Model girdisi olarak, kümeler arası UZAKLIKLAR anlamlı değildir','Sonuçtan nicel çıkarım yaparken','Büyük veride t-SNE ile (yavaştır → UMAP kullan)'],
  kod:`import umap                      # pip install umap-learn
emb = umap.UMAP(n_neighbors=15, min_dist=0.1).fit_transform(X)
import matplotlib.pyplot as plt
plt.scatter(emb[:,0], emb[:,1], c=y, s=5)`,
  hiper:[['n_neighbors / perplexity','yerel mi küresel yapı mı öne çıksın'],['min_dist','noktaların ne kadar sıkışacağı']],
  tuzak:'t-SNE grafiğindeki küme büyüklüklerini ve aralarındaki mesafeyi yorumlamak. İkisi de anlamsızdır, sadece "ayrışıyor mu" sorusuna cevap verir.',
  ders:null,
},
{
  id:'iforest', ad:'Isolation Forest', gorev:['anom'], seviye:'orta',
  bir:'Aykırı değerleri, rastgele bölmelerle "kolayca izole edilebilmelerinden" yakalar.',
  nasil:'Rastgele bir özellik ve rastgele bir eşikle veriyi böler, tekrarlar. Normal noktalar izole olmak için çok bölme gerektirir; aykırı noktalar birkaç bölmede tek başına kalır. Ortalama derinlik anomali skorudur.',
  neZaman:['Etiketsiz anomali tespiti, dolandırıcılık, arıza, log analizi','Yüksek boyutlu veride','Hızlı olması gerektiğinde (doğrusal ölçeklenir)'],
  neZamanDegil:['Anomali oranı çok yüksekse (>%20)','Anomali "normalin ortasında" gizliyse'],
  kod:`from sklearn.ensemble import IsolationForest
det = IsolationForest(contamination=0.02, random_state=42).fit(X)
skor = -det.score_samples(X)     # yüksek = daha anormal
aykiri = det.predict(X) == -1`,
  hiper:[['contamination','beklenen anomali oranı, tahmin edemiyorsan skorları kendin eşikle'],['n_estimators','ağaç sayısı']],
  tuzak:'contamination\'ı rastgele vermek. Bu doğrudan kaç örneğin anomali sayılacağını belirler; alan bilgisiyle seçilmeli.',
  ders:null,
},
/* ─────────────── DERİN ÖĞRENME ─────────────── */
{
  id:'mlp', ad:'MLP (Çok Katmanlı Algılayıcı)', gorev:['sin','reg'], seviye:'orta',
  bir:'Nöron katmanlarını üst üste dizer; aktivasyon fonksiyonları sayesinde eğri sınırlar öğrenebilir.',
  nasil:'Her katman: ağırlıklı toplam + bias + aktivasyon. Katmanlar arası doğrusal olmayanlık olmasaydı, kaç katman olursa olsun tek bir doğruya çökerdi. Geri yayılım ile eğitilir.',
  neZaman:['İlişki karmaşık ve doğrusal değilse','Bol veri varsa','Derin öğrenmeye giriş olarak, CNN/Transformer bunun üstüne kurulu'],
  neZamanDegil:['Tablo verisinde tek başına, GBM neredeyse her zaman önde','Az veride (kolayca ezberler)','Yorumlanabilirlik gerektiğinde'],
  kod:`import torch.nn as nn
model = nn.Sequential(
    nn.Linear(n_ozellik, 64), nn.ReLU(), nn.Dropout(0.2),
    nn.Linear(64, 32), nn.ReLU(),
    nn.Linear(32, 1))                     # sınıflandırmada BCEWithLogitsLoss kullan

opt = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)`,
  hiper:[['katman sayısı / genişlik','kapasite'],['lr','en kritik ayar, yanlışsa ya sürünür ya patlar'],['dropout / weight_decay','düzenlileştirme'],['batch_size','gürültü ↔ hız dengesi']],
  tuzak:'Girdiyi normalize etmemek ve öğrenme hızını körlemesine seçmek. Önce lr taraması (lr finder) yap.',
  ders:'noron',
},
{
  id:'cnn', ad:'CNN (Evrişimli Ağ)', gorev:['sin'], seviye:'ileri',
  bir:'Küçük filtreleri görüntünün her yerinde gezdirir; aynı örüntüyü konumdan bağımsız yakalar.',
  nasil:'3×3 gibi bir çekirdek görüntüde kayar, her konumda çarp-topla yapar ve bir özellik haritası üretir. Aynı 9 parametre her yerde kullanılır (parametre paylaşımı). Katmanlar derinleştikçe kenar → doku → parça → nesne öğrenilir.',
  neZaman:['Görüntü, video, spektrogram (ses)','Uzamsal komşuluğun anlamı olduğu her veride','Transfer öğrenme ile az veride bile'],
  neZamanDegil:['Sıralı/metin veride (Transformer daha iyi)','Tablo verisinde (komşuluk anlamsız)','Sıfırdan eğitmek için az veri varsa, hazır model kullan'],
  kod:`import timm, torch
model = timm.create_model('resnet18', pretrained=True, num_classes=3)
# sıfırdan eğitme: hazır ağırlıkları kullan, son katmanı değiştir
for p in model.parameters(): p.requires_grad = False
for p in model.fc.parameters(): p.requires_grad = True`,
  hiper:[['çekirdek boyutu','3×3 modern standart'],['stride / padding','çıktı boyutunu belirler'],['kanal sayısı','katman kapasitesi'],['augmentation','flip/crop/renk, az veride en etkili düzenlileştirme']],
  tuzak:'Sıfırdan eğitmeye çalışmak. Neredeyse her durumda önceden eğitilmiş model + fine-tune daha iyi ve 100× ucuzdur.',
  ders:'cnn',
},
{
  id:'rnn', ad:'RNN / LSTM / GRU', gorev:['sin','reg'], seviye:'ileri',
  bir:'Sıralı veriyi adım adım okur ve bir "hafıza" durumu taşır.',
  nasil:'Her zaman adımında girdiyi ve önceki gizli durumu birleştirip yeni gizli durum üretir. LSTM ve GRU, kapılar ekleyerek uzun bağımlılıkların kaybolmasını (vanishing gradient) engeller.',
  neZaman:['Zaman serisi tahmini','Kısa diziler + az veri (Transformer\'dan ucuz)','Akan veride online tahmin'],
  neZamanDegil:['Uzun metinde, Transformer neredeyse her görevde yendi','Paralel eğitim gerektiğinde (RNN sıralıdır, GPU\'yu doyuramaz)'],
  kod:`import torch.nn as nn
class Tahminci(nn.Module):
    def __init__(s, g=1, h=64):
        super().__init__()
        s.lstm = nn.LSTM(g, h, num_layers=2, batch_first=True, dropout=0.2)
        s.fc = nn.Linear(h, 1)
    def forward(s, x):
        o, _ = s.lstm(x)
        return s.fc(o[:, -1])        # son zaman adımı`,
  hiper:[['hidden_size','hafıza kapasitesi'],['num_layers','derinlik'],['gradient clipping','patlayan gradyana karşı, LSTM\'de neredeyse zorunlu']],
  tuzak:'Zaman serisinde rastgele train/test bölmek. Bu geleceğe bakmaktır, zorunlu olarak zamana göre bölünmelidir.',
  ders:null,
},
{
  id:'ae', ad:'Autoencoder', gorev:['boyut','anom','uret'], seviye:'ileri',
  bir:'Girdiyi dar bir darboğazdan geçirip yeniden inşa etmeye çalışır; darboğaz sıkıştırılmış temsili öğrenir.',
  nasil:'Encoder girdiyi küçük bir vektöre indirir, decoder ondan orijinali geri kurmaya çalışır. Kayıp = yeniden inşa hatası. Etiket gerekmez, kendi kendini denetler.',
  neZaman:['Etiketsiz temsil öğrenme','Anomali tespiti, anormal örnek kötü yeniden inşa edilir','Gürültü temizleme (denoising AE)'],
  neZamanDegil:['Sadece boyut indirme istiyorsan (PCA daha basit ve hızlı)','Yeni örnek üretmek istiyorsan, VAE veya diffusion gerekir'],
  kod:`kayip = ((model(x) - x) ** 2).mean(dim=1)      # örnek başına yeniden inşa hatası
esik = kayip_egitim.quantile(0.99)
anomali = kayip > esik`,
  hiper:[['darboğaz boyutu','çok büyük = kopyalamayı öğrenir, çok küçük = bilgi kaybı'],['mimari','encoder ve decoder simetrik olmak zorunda değil']],
  tuzak:'Darboğazı geniş bırakmak, ağ girdiyi olduğu gibi kopyalamayı öğrenir ve hiçbir şey öğrenmemiş olur.',
  ders:null,
},
{
  id:'transformer', ad:'Transformer', gorev:['dil','sin','uret'], seviye:'ileri',
  bir:'Her öğenin diğer tüm öğelere aynı anda "bakmasını" sağlar. Modern yapay zekânın omurgası.',
  nasil:'Self-attention: her token bir sorgu (Q) üretir, tüm tokenların anahtarlarıyla (K) çarpılır, softmax\'tan geçen ağırlıklarla değerlerin (V) ağırlıklı toplamı alınır. Sıralı okuma yok, tek matris çarpımı, tam paralel.',
  neZaman:['Metin, kod, protein, çok modlu, sıralı her veri','Uzun bağımlılıklar önemliyse','Ölçek varsa (veri + hesap)'],
  neZamanDegil:['Çok az veride sıfırdan eğitmek','Çok uzun dizilerde saf attention ile, maliyet O(n²)'],
  kod:`from transformers import AutoModelForSequenceClassification, AutoTokenizer
ad = 'dbmdz/bert-base-turkish-cased'
tok = AutoTokenizer.from_pretrained(ad)
model = AutoModelForSequenceClassification.from_pretrained(ad, num_labels=3)
# sıfırdan eğitme, HER ZAMAN önceden eğitilmişten başla`,
  hiper:[['d_model','temsil boyutu'],['n_heads','paralel dikkat başı sayısı'],['n_layers','blok sayısı'],['context length','kaç token birden görebilir']],
  tuzak:'Attention\'ı "modelin neye baktığının açıklaması" sanmak. Dikkat ağırlıkları açıklama değildir, bu konuda geniş bir literatür tartışması vardır.',
  ders:'attention',
},
{
  id:'diffusion', ad:'Diffusion Model', gorev:['uret'], seviye:'ileri',
  bir:'Saf gürültüden başlayıp adım adım gürültüyü temizleyerek görüntü üretir.',
  nasil:'Eğitimde görüntüye kademeli gürültü eklenir ve ağ "bu gürültüyü tahmin et" diye eğitilir. Üretimde süreç ters çevrilir: rastgele gürültüden başlanır, ağ her adımda biraz gürültü çıkarır, 20–50 adımda görüntü belirir.',
  neZaman:['Görüntü/ses/video üretimi','Koşullu üretim (metinden görsel)','Boyama, süper çözünürlük'],
  neZamanDegil:['Anlık üretim gerektiğinde, çok adımlı, yavaştır','Sınıflandırma gibi ayırt edici görevlerde'],
  kod:`from diffusers import StableDiffusionPipeline
import torch
pipe = StableDiffusionPipeline.from_pretrained(
    'runwayml/stable-diffusion-v1-5', torch_dtype=torch.float16).to('cuda')
gorsel = pipe('bir kedi, yağlı boya', num_inference_steps=30, guidance_scale=7.5).images[0]`,
  hiper:[['num_inference_steps','adım sayısı, kalite ↔ hız'],['guidance_scale','prompt\'a ne kadar sadık kalsın; çok yüksek = doygun ve yapay']],
  tuzak:'guidance_scale\'i yükselterek kaliteyi artırmaya çalışmak. 12 üstünde renkler patlar ve çeşitlilik ölür.',
  ders:null,
},
/* ─────────────── LLM UYGULAMA ─────────────── */
{
  id:'embed', ad:'Embedding Modelleri', gorev:['dil','boyut'], seviye:'orta',
  bir:'Metni, anlamı yakın olanların birbirine yakın düştüğü bir sayı vektörüne çevirir.',
  nasil:'Bir Transformer encoder, cümleyi sabit boyutlu bir vektöre (genelde 384–3072 boyut) indirir. Benzerlik kosinüs uzaklığıyla ölçülür. Arama, öneri ve RAG\'in temel taşıdır.',
  neZaman:['Anlamsal arama, kelime eşleşmesi değil, anlam eşleşmesi','RAG boru hattında belge getirme','Kümeleme, tekrar bulma, öneri'],
  neZamanDegil:['Tam eşleşme gerektiğinde (ürün kodu, SKU → klasik arama)','Model dilini desteklemiyorsa, Türkçe için çok dilli model seç'],
  kod:`from sentence_transformers import SentenceTransformer
m = SentenceTransformer('intfloat/multilingual-e5-large')   # Türkçe destekli
V = m.encode(belgeler, normalize_embeddings=True)
q = m.encode(['iade politikası nedir'], normalize_embeddings=True)
skor = V @ q.T                     # normalize ise iç çarpım = kosinüs`,
  hiper:[['model seçimi','boyut ↔ kalite ↔ hız dengesi'],['normalize_embeddings','kosinüs için True yap'],['chunk boyutu','belgeyi kaça böldüğün getirme kalitesini doğrudan belirler']],
  tuzak:'İngilizce modelle Türkçe belge gömmek. Skorlar makul görünür ama getirme kalitesi sessizce çöker.',
  ders:null,
},
{
  id:'rag', ad:'RAG (Retrieval-Augmented Generation)', gorev:['dil'], seviye:'ileri',
  bir:'LLM\'e cevap vermeden önce ilgili belgeleri bulup bağlamına koyar. Halüsinasyonu azaltmanın ana yolu.',
  nasil:'Belgeler parçalanır, gömülür, vektör veritabanına yazılır. Soru gelince gömülür, en yakın k parça getirilir, prompt\'a eklenir, LLM sadece o bağlamdan cevaplaması istenir.',
  neZaman:['Modelin bilmediği özel/güncel bilgiyle çalışırken','Kaynak göstermek zorunda olduğunda','Fine-tuning\'den ucuz ve güncellenebilir olması gerektiğinde'],
  neZamanDegil:['Bilgi zaten modelde varsa (gereksiz karmaşıklık)','Görev akıl yürütme ağırlıklıysa, RAG bilgi getirir, düşünmeyi öğretmez'],
  kod:`# 1 parçala → 2 göm → 3 getir → 4 sorgula
parcalar = bol(belge, boyut=500, ortusme=80)      # ORTÜŞME ÖNEMLİ
V = embed(parcalar)
ilgili = en_yakin(V, embed(soru), k=5)
prompt = f"""Yalnızca aşağıdaki bağlamı kullan. Bağlamda yoksa "bilmiyorum" de.
BAĞLAM:\\n{ilgili}\\n\\nSORU: {soru}"""`,
  hiper:[['chunk_size / overlap','en kritik ayar, küçük parça bağlamı kaybeder, büyük parça gürültü getirir'],['k','kaç parça getirilecek'],['reranker','ilk getirmeden sonra yeniden sıralama, kaliteyi en çok artıran tek ekleme']],
  tuzak:'Getirmeyi ölçmeden LLM\'i suçlamak. Kötü RAG\'in çoğu getirme hatasıdır; önce "doğru parça geldi mi" diye ölç.',
  ders:null,
},
{
  id:'finetune', ad:'Fine-tuning / LoRA', gorev:['dil'], seviye:'ileri',
  bir:'Hazır bir modeli kendi verinle biraz daha eğiterek üsluba veya göreve uyarlar.',
  nasil:'Tam fine-tuning tüm ağırlıkları günceller, pahalı. LoRA ise ağırlık matrislerine küçük düşük-ranklı ekler takar ve sadece onları eğitir: parametrelerin ~%0.1\'i, sonucun büyük kısmı.',
  neZaman:['Belirli bir format/üslup/ton gerektiğinde','Alan diline uyum (tıp, hukuk, kod)','Prompt uzunluğunu kısaltmak için'],
  neZamanDegil:['Modele YENİ BİLGİ öğretmek için, o RAG\'in işi','Az ve kalitesiz veriyle','Prompt mühendisliği yeterken (önce onu tüket)'],
  kod:`from peft import LoraConfig, get_peft_model
cfg = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05,
                 target_modules=['q_proj','v_proj'])
model = get_peft_model(temel_model, cfg)
model.print_trainable_parameters()   # ~%0.1`,
  hiper:[['r','LoRA rankı, kapasite. 8–64 tipik'],['lora_alpha','ölçekleme, genelde 2×r'],['target_modules','hangi katmanlara takılacak']],
  tuzak:'Fine-tuning\'i bilgi enjeksiyonu sanmak. Model üslubu öğrenir, gerçekleri güvenilir biçimde ezberlemez ve eskisini unutabilir (katastrofik unutma).',
  ders:null,
},
{
  id:'reranker', ad:'Cross-Encoder Reranker', gorev:['dil'], seviye:'ileri',
  bir:'Getirilen adayları soru ile birlikte okuyup yeniden sıralar. RAG kalitesini en çok artıran tek bileşen.',
  nasil:'Embedding modeli soruyu ve belgeyi ayrı ayrı kodlar (hızlı ama kaba). Cross-encoder ikisini birlikte okur ve tek bir uygunluk skoru üretir, çok daha doğru ama yavaş. Bu yüzden önce 50 aday getirilir, sonra reranker en iyi 5\'i seçer.',
  neZaman:['RAG kalitesi yetersizse, ilk denenecek iyileştirme','Aday havuzu büyükse'],
  neZamanDegil:['Gecikme çok kritikse','Aday sayısı zaten çok azsa'],
  kod:`from sentence_transformers import CrossEncoder
ce = CrossEncoder('BAAI/bge-reranker-v2-m3')
ciftler = [(soru, p) for p in adaylar]          # 50 aday
skor = ce.predict(ciftler)
en_iyi = [adaylar[i] for i in skor.argsort()[::-1][:5]]`,
  hiper:[['aday sayısı','50–100 getir, 3–8 tut'],['model','çok dilli olanı seç (Türkçe için m3)']],
  tuzak:'Reranker eklemeden k\'yı büyütmek. Daha çok parça = daha çok gürültü; çözüm miktar değil, sıralama kalitesi.',
  ders:null,
},
];
