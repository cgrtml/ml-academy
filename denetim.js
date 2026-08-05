const fs=require('fs');
const V=fs.readFileSync('./viz.js','utf8');
const C=fs.readFileSync('./content.js','utf8');
const E=fs.readFileSync('./content-en.js','utf8');
const T=`
let ok=0,ht=0;
function iddia(ad,bek,ger,tol){const g=typeof ger==='number'?+ger.toFixed(tol===undefined?1:tol):ger;
  const b=typeof bek==='number'?+bek.toFixed(tol===undefined?1:tol):bek;
  const e=String(g)===String(b);e?ok++:ht++;
  console.log((e?'  ✓ ':'  ✗ ')+ad.padEnd(34)+'ders: '+String(b).padEnd(10)+'gerçek: '+g);}

console.log('═══ BATCH NORM ═══');
[[0.5,[[0,0.998],[6,0.011],[12,0.000]]],[1.2,[[0,0.998],[6,0.433],[12,0.421]]]].forEach(([o,ler])=>{
  const r=bnDeney(o,false);
  ler.forEach(([k,v])=>iddia('ölçek '+o+' katman '+k+' std',v,r[k].sd,3));});
iddia('ölçek 3.0 k12 std',0.830,bnDeney(3,false)[12].sd,3);
iddia('ölçek 3.0 doygun %',26.3,bnDeney(3,false)[12].doygun*100);
iddia('ölçek 6.0 k12 std',0.926,bnDeney(6,false)[12].sd,3);
iddia('ölçek 6.0 doygun %',62.4,bnDeney(6,false)[12].doygun*100);
[0.5,1.2,3,6].forEach(o=>{const v=bnDeney(o,true)[12];
  iddia('BN VAR ölçek '+o+' std',0.652,v.sd,3);
  iddia('BN VAR ölçek '+o+' doygun %',0.1,v.doygun*100,1);});

console.log('');
console.log('═══ KELİME GÖMME ═══');
const o=w2vOzet();
iddia('kategori içi kosinüs',0.993,o.ici,3);
iddia('kategori dışı kosinüs',0.333,o.disi,3);
iddia('fark',0.660,o.ici-o.disi,3);
iddia('isabet %',100,o.isabet*100);
iddia('kelime sayısı',20,o.n);
[['kral','prenses'],['kedi','köpek'],['İstanbul','Bursa'],['elma','peynir']].forEach(([k,b])=>
  iddia(k+' en yakın',b,w2vBenzer(k,1)[0].w));

console.log('');
console.log('═══ TRANSFER ÖĞRENME ═══');
const T=transferDeney(); const son=T.egri.sifirdan.length-1;
iddia('kaynak görev doğruluğu',100,T.kaynakDog*100);
iddia('epoch 0 transfer %',77.2,T.egri.transfer[0].test*100);
iddia('epoch 0 sıfırdan %',50.8,T.egri.sifirdan[0].test*100);
iddia('epoch 10 transfer %',89.2,T.egri.transfer[2].test*100);
iddia('son sıfırdan %',80.6,T.egri.sifirdan[son].test*100);
iddia('son transfer %',89.2,T.egri.transfer[son].test*100);
iddia('son tam ayar %',84.4,T.egri.tamAyar[son].test*100);
iddia('transfer kazancı',8.6,(T.egri.transfer[son].test-T.egri.sifirdan[son].test)*100);
iddia('tam ayar geriliği',4.8,(T.egri.transfer[son].test-T.egri.tamAyar[son].test)*100);
iddia('hedef eğitim örneği',15,TR_VERI.Be.X.length);

console.log('');
console.log('═══ BPE ═══');
iddia('korpus kelime',38,Object.keys(BPE.KORPUS).length);
iddia('birleşme sayısı',40,BPE.birlesmeler.length);
iddia('sözlük boyu',64,BPE.sozlukBoyu);
[[1,'er',316],[2,'ar',264],[7,'lar',176],[10,'kitap',152],[11,'ler',148]].forEach(([n,y,f])=>{
  const b=BPE.birlesmeler[n-1];
  iddia(n+'. birleşme',y,b.yeni); iddia(n+'. sıklık',f,b.sayi);});
[['defterlerimiz',3],['evimizden',5],['okulumuzdan',6],['kitaplarımızdan',7],['kalemlerimizden',10]].forEach(([k,n])=>
  iddia(k+' token',n,bpeParcala(k).length));
iddia('defterlerimiz parça','defter|ler|imiz</w>',bpeParcala('defterlerimiz').join('|'));
[[0,16],[5,12],[10,10],[40,7]].forEach(([m,n])=>
  iddia('kitaplarımızdan @'+m+' birleşme',n,bpeParcala('kitaplarımızdan',m).length));

console.log('');
console.log('═══ ÖRNEKLEME ═══');
[[0.1,97.8,0.15],[0.5,56.5,1.78],[1.0,33.1,2.79],[2.5,16.8,3.42]].forEach(([T,pr,en])=>{
  const r=ornekleme(T,12,1);
  iddia('T='+T+' top-1 %',pr,r.tam[0]*100);
  iddia('T='+T+' entropi',en,r.tamEntropi,2);});
[[1,0.00],[3,1.47],[5,2.10],[12,2.79]].forEach(([k,e])=>
  iddia('top-k '+k+' entropi',e,ornekleme(1,k,1).entropi,2));
[[0.50,2,0.97],[0.80,5,2.10],[0.90,7,2.43],[0.95,8,2.54]].forEach(([p,n2,e])=>{
  const r=ornekleme(1,999,p);
  iddia('top-p '+p+' token',n2,r.izinSayi); iddia('top-p '+p+' entropi',e,r.entropi,2);});
iddia('T=1 yumurta %',33.11,softmax(SMP.logit,1)[0]*100,2);
iddia('T=1 peynir %',22.64,softmax(SMP.logit,1)[1]*100,2);

console.log('');
console.log('═══ TRANSFORMER ARİTMETİĞİ ═══');
const P2=tfmParam();
iddia('dikkat M param',67.1,P2.dikkat/1e6);
iddia('MLP M param',135.3,P2.mlp/1e6);
iddia('blok M param',202.4,P2.blok/1e6);
iddia('32 blok B',6.48,P2.blok*TFM.L/1e9,2);
iddia('gömme B',0.26,P2.gomme*2/1e9,2);
iddia('TOPLAM B (Llama-7B)',6.74,P2.toplam/1e9,2);
iddia('fp16 GB',13.5,P2.toplam*2/1e9,1);
iddia('MLP/dikkat oranı',2.0,P2.mlp/P2.dikkat,1);
iddia('MLP payı %',67,P2.mlp/P2.blok*100,0);

console.log('');
console.log('═══ KV CACHE ═══');
iddia('token başı KB (MHA)',512,kvCache(1,32).tokenBasi/1024);
iddia('token başı KB (GQA)',128,kvCache(1,8).tokenBasi/1024);
[[4096,2.15],[16384,8.59],[32768,17.18],[131072,68.72]].forEach(([n2,gb])=>
  iddia(n2+' token GB',gb,kvCache(n2,32).toplam/1e9,2));
iddia('GQA 131K GB',17.18,kvCache(131072,8).toplam/1e9,2);
iddia('GQA tasarruf',4,kvCache(1,32).tokenBasi/kvCache(1,8).tokenBasi);
[[128,65],[512,257],[2048,1025]].forEach(([N,o])=>
  iddia(N+' token hız oranı',o,uretimMaliyet(N).oran,0));

console.log('');
console.log('═══ ÇOK ANLAMLILIK ═══');
const ca=cokAnlamOzet();
iddia('yüz → fiil',0.984,ca.s.fiil,3);
iddia('yüz → sayi',0.431,ca.s.sayi,3);
iddia('yüz → organ',0.209,ca.s.organ,3);
iddia('gözlük → organ',0.999,kosinus(COKANLAM.E['gözlük'],ca.merkez.organ),3);
iddia('gözlük → sayi',0.274,kosinus(COKANLAM.E['gözlük'],ca.merkez.sayi),3);

console.log('');
console.log('═══ EVAL İSTATİSTİĞİ ═══');
[[10,49.0,94.3,45.3],[25,60.9,91.1,30.3],[50,67.0,88.8,21.8],[100,71.1,86.7,15.5],
 [400,75.8,83.6,7.8],[1000,77.4,82.4,5.0]].forEach(([n,a,u,g])=>{
  const w=wilson(Math.round(n*0.8),n);
  iddia('n='+n+' alt %',a,w.alt*100); iddia('n='+n+' üst %',u,w.ust*100);
  iddia('n='+n+' genişlik',g,w.genislik*100);});
[[10,-0.63,0.5312],[50,-1.40,0.1614],[100,-1.98,0.0477],[400,-3.96,0.0001]].forEach(([n,z,p])=>{
  const r=oranFarki(Math.round(n*0.8),n,Math.round(n*0.9),n);
  iddia('n='+n+' z',z,r.z,2); iddia('n='+n+' p',p,r.p,4);});

console.log('');
console.log('═══ HALÜSİNASYON ═══');
[[0.3,0.0],[0.7,1.7],[1.0,4.6],[1.5,9.5]].forEach(([T,d])=>
  iddia('T='+T+' dürüst %',d,halDagilim(T).durustOran*100));
const hd=halDagilim(1);
iddia('T=1 ilk uydurma %',35.9,hd.p[0]*100);
iddia('T=1 uydurma toplam %',95.4,hd.uydurmaOran*100);

console.log('');
console.log('═══ ELO ═══');
[[1600,1300,84.9,8],[1600,1500,64.0,49],[1500,1450,57.1,189]].forEach(([a,b,pw,n])=>{
  const p=1/(1+Math.pow(10,(b-a)/400));
  iddia((a-b)+' Elo fark → kazanma %',pw,p*100,1);
  iddia((a-b)+' Elo fark → gereken n',n,Math.ceil(0.25*Math.pow(1.96/(p-0.5),2)));});
[[50,false],[100,true],[400,true],[800,true]].forEach(([n,d])=>
  iddia('Elo n='+n+' sıralama',d?'DOĞRU':'yanlış',eloTurnuva(n,16).dogruSira?'DOĞRU':'yanlış'));

console.log('');
console.log('═══ MALİYET ═══');
const m1=maliyetHesap(1,10000,500,300,1);
iddia('orta model istek başı $',0.00140,m1.istekBasi,5);
iddia('orta model aylık $',420,m1.aylik,0);
const m2=maliyetHesap(1,10000,500,300,8);
iddia('RAG ile aylık $',1470,m2.aylik,0);
iddia('çıktı/girdi fiyat oranı',3,FIYAT[1].cikti/FIYAT[1].girdi,0);

console.log('');

console.log('═══ CEZALI REGRESYON (ridge / lasso) ═══');
{
  const D = DATA.ceza;
  let kor = 0; for (let k=0;k<D.n;k++) kor += D.X[k][0]*D.X[k][1];
  iddia('x0-x1 korelasyonu', 0.986, kor/D.n, 3);
  iddia('gerçek katsayı x0', 3, D.gercek[0], 0);
  iddia('gerçek katsayı x2', -2, D.gercek[2], 0);
  iddia('gürültü özellik sayısı', 4, D.gercek.filter(v=>v===0).length, 0);

  const w0 = ridgeFit(0);
  iddia('OLS x0 katsayısı', 3.87, w0[0], 2);
  iddia('OLS x1 katsayısı', 0.15, w0[1], 2);
  iddia('OLS eğitim RSS', 8.2, cezaRSS(w0), 1);
  iddia('OLS test MSE', 1.650, cezaTest(w0), 3);

  const w20 = ridgeFit(20);
  iddia('ridge λ=20 x0', 1.69, w20[0], 2);
  iddia('ridge λ=20 x1', 1.59, w20[1], 2);
  iddia('ridge λ=20 x2', -1.31, w20[2], 2);
  iddia('ridge λ=20 eğitim RSS', 50.3, cezaRSS(w20), 1);
  iddia('ridge λ=20 test MSE', 0.901, cezaTest(w20), 3);
  iddia('ridge |x0-x1| < 0.20', true, Math.abs(w20[0]-w20[1]) < 0.20);
  iddia('ridge λ=100 test MSE', 3.321, cezaTest(ridgeFit(100)), 3);
  iddia('ridge λ=200 test MSE', 6.042, cezaTest(ridgeFit(200)), 3);
  iddia('ridge iyileşme %', 45.4, 100*(1 - cezaTest(w20)/cezaTest(w0)), 1);
  iddia('ridge hiç sıfır üretmiyor', 0, cezaSifir(w20), 0);

  const l53 = lassoFit(53), l15 = lassoFit(15);
  iddia('lasso λ=53 test MSE', 1.003, cezaTest(l53), 3);
  iddia('lasso λ=53 sıfır sayısı', 4, cezaSifir(l53), 0);
  iddia('lasso λ=53 x0', 3.45, l53[0], 2);
  iddia('lasso λ=53 x2', -1.28, l53[2], 2);
  iddia('lasso iyileşme %', 39.2, 100*(1 - cezaTest(l53)/cezaTest(w0)), 1);
  iddia('lasso λ=15 sıfır sayısı', 4, cezaSifir(l15), 0);
  /* λ=15'te sıfırlananlar TAM OLARAK gürültü özellikleri mi? */
  const sifirIdx = l15.map((v,i)=>Math.abs(v)<1e-6?i:-1).filter(i=>i>=0).join(',');
  iddia('lasso λ=15 sıfırlananlar', '1,3,4,5', sifirIdx);
  /* ilk sıfır λ=1'de mi? */
  let ilk = -1; for (let l=0;l<=40;l++){ if (cezaSifir(lassoFit(l))>=1){ ilk = l; break; } }
  iddia('lasso ilk sıfır λ', 1, ilk, 0);

  /* yol önbelleği ile en iyi λ değerleri, derste yazan değerlerle aynı mı? */
  const yr = cezaYol('ridge',60,60).reduce((a,b)=>b.test<a.test?b:a);
  const yl = cezaYol('lasso',120,60).reduce((a,b)=>b.test<a.test?b:a);
  iddia('yol: en iyi ridge λ', 20, yr.lam, 0);
  iddia('yol: en iyi ridge test', 0.901, yr.test, 3);
  iddia('yol: en iyi lasso test', 1.004, yl.test, 3);
  /* ridge paylaştırma gerekçesi: aynı toplamı ikiye bölmek kareyi küçültür */
  iddia('3.9² = 15.21', 15.21, 3.9*3.9, 2);
  iddia('1.95²+1.95² = 7.605', 7.605, 2*1.95*1.95, 3);
  iddia('bölmek kareyi yarıya indirir', 7.605, 15.21/2, 3);
  /* geometri: elmas köşe verir, çember vermez */
  {
    let l = 0, r = 0;
    for (let t = 0; t <= 1; t += 0.02){
      if (cezaGeoCoz('lasso', t).kose) l++;
      if (cezaGeoCoz('ridge', t).kose) r++;
    }
    iddia('L1 bütçesi köşe çözümü veriyor', true, l > 0);
    iddia('L2 bütçesi hiç köşe vermiyor', 0, r, 0);
  }
}


console.log('═══ YANLILIK / VARYANS ═══');
{
  const H = yvHesap();
  iddia('derece 0 yanlılık²', 0.4878, H[0].b2, 4);
  iddia('derece 0 varyans', 0.0281, H[0].va, 4);
  iddia('derece 0 toplam', 0.6384, H[0].top, 4);
  iddia('derece 3 yanlılık²', 0.0070, H[3].b2, 4);
  iddia('derece 3 varyans', 0.0491, H[3].va, 4);
  iddia('derece 3 toplam', 0.1786, H[3].top, 4);
  iddia('derece 9 varyans', 5.8916, H[9].va, 4);
  iddia('derece 9 toplam', 6.1109, H[9].top, 4);
  iddia('gürültü tabanı σ²', 0.1225, 0.35*0.35, 4);
  const en = H.reduce((a,b)=>b.top<a.top?b:a);
  iddia('en iyi derece', 3, en.d, 0);
  iddia('gürültünün en iyi hatadaki payı %', 68.6, 100*0.1225/en.top, 1);
  iddia('varyans derece 3→9 kaç kat', 120.0, H[9].va/H[3].va, 1);
  /* dersin iddiasi: esneklik yanliligi dusurur, varyansi yukseltir */
  iddia('yanlılık derece 0 > derece 3', true, H[0].b2 > H[3].b2);
  iddia('varyans derece 9 > derece 3', true, H[9].va > H[3].va);
  iddia('toplam hata U çiziyor', true, H[0].top > en.top && H[9].top > en.top);
}


console.log('═══ BOYUT LANETİ ═══');
{
  const e1 = blDeney(1), e3 = blDeney(3), e10 = blDeney(10), e100 = blDeney(100);
  iddia('boyut 1 en yakın', 0.001, e1.yakin, 3);
  iddia('boyut 1 en uzak', 0.735, e1.uzak, 3);
  iddia('boyut 1 kaç kat', 781.2, e1.uzak/e1.yakin, 1);
  iddia('boyut 10 kaç kat', 3.34, e10.uzak/e10.yakin, 2);
  iddia('boyut 100 en yakın', 3.373, e100.yakin, 3);
  iddia('boyut 100 en uzak', 4.731, e100.uzak, 3);
  iddia('boyut 100 kaç kat', 1.40, e100.uzak/e100.yakin, 2);
  iddia('kontrast boyutla azalıyor', true, e3.oran > e10.oran && e10.oran > e100.oran);
  iddia('%10 kenar · boyut 1', 0.100, blKenar(1,0.1), 3);
  iddia('%10 kenar · boyut 10', 0.794, blKenar(10,0.1), 3);
  iddia('%10 kenar · boyut 100', 0.977, blKenar(100,0.1), 3);
  iddia('dış %1 kabuk · boyut 1', 2.0, 100*blKabuk(1,0.01), 1);
  iddia('dış %1 kabuk · boyut 10', 18.3, 100*blKabuk(10,0.01), 1);
  iddia('dış %1 kabuk · boyut 100', 86.7, 100*blKabuk(100,0.01), 1);
  iddia('dış %1 kabuk · boyut 200', 98.2, 100*blKabuk(200,0.01), 1);
}


console.log('═══ HİPERPARAMETRE ARAMASI ═══');
{
  iddia('ızgara 3×3 skor', 0.3271, haEnIyi(haIzgara(3)), 4);
  iddia('rastgele 9 ortalama', 0.8261, haOrtalama(9, 50), 4);
  iddia('rastgele/ızgara oranı (9 deneme)', 2.5, haOrtalama(9,50)/haEnIyi(haIzgara(3)), 1);
  iddia('ızgara 5×5 skor', 1.0372, haEnIyi(haIzgara(5)), 4);
  iddia('ızgara 6×6 skor', 0.8260, haEnIyi(haIzgara(6)), 4);
  iddia('ızgara: 36 deneme 25 denemeden KÖTÜ', true, haEnIyi(haIzgara(6)) < haEnIyi(haIzgara(5)));
  /* rastgele monoton yükseliyor mu? dersin iddiası bu */
  let mono = true;
  for (let k = 2; k < 8; k++) if (haOrtalama((k+1)*(k+1),50) <= haOrtalama(k*k,50)) mono = false;
  iddia('rastgele bütçeyle monoton yükseliyor', true, mono);
  iddia('rastgele 4 deneme', 0.6297, haOrtalama(4,50), 4);
  iddia('rastgele 64 deneme', 1.0277, haOrtalama(64,50), 4);
  iddia('ulaşılabilir tavan', 1.0600, haSkor(0.32, Math.PI/18), 4);
  /* önemli ayarda kaç farklı değer: ızgara k, rastgele k² */
  iddia('ızgara 6×6 farklı a değeri', 6, new Set(haIzgara(6).map(p=>p.a.toFixed(4))).size, 0);
  iddia('rastgele 36 farklı a değeri', 36, new Set(haRastgele(36,100).map(p=>p.a.toFixed(4))).size, 0);
  /* 5x5 izgarada 0.3 deneniyor, 6x6 izgarada 0.32 yakininda deger yok */
  iddia('5×5 ızgara 0.3 deniyor', true, haIzgara(5).some(p => Math.abs(p.a-0.3) < 1e-9));
  iddia('6×6 ızgara 0.32 yakınını hiç denemiyor', true,
        !haIzgara(6).some(p => Math.abs(p.a-0.32) < 0.05));
}


console.log('═══ SOFTMAX / ÇAPRAZ ENTROPİ ═══');
{
  const p = smSoftmax([2,1,0]);
  iddia('softmax([2,1,0]) kedi', 0.665, p[0], 3);
  iddia('softmax([2,1,0]) köpek', 0.245, p[1], 3);
  iddia('softmax([2,1,0]) kuş', 0.090, p[2], 3);
  iddia('softmax toplamı 1', 1.000, p[0]+p[1]+p[2], 3);
  iddia('1 birim logit farkı = e kat', 2.718, Math.exp(1), 3);
  iddia('oran p0/p1 = e', 2.718, p[0]/p[1], 3);
  /* CE degerleri */
  [[0.9,0.105],[0.5,0.693],[0.1,2.303],[0.01,4.605],[0.001,6.908]].forEach(([pp,bek]) =>
    iddia('CE kaybı p='+pp, bek, -Math.log(pp), 3));
  /* gradyan karsilastirmasi */
  const g = pp => { const z = smLogit(pp);
    return { ce: Math.abs(smGradCE(z,0)[0]), mse: Math.abs(smGradMSE(z,0)[0]) }; };
  iddia('CE gradyanı p=0.001', 0.9990, g(0.001).ce, 4);
  iddia('MSE gradyanı p=0.001', 0.000998, g(0.001).mse, 6);
  iddia('gradyan oranı p=0.001', 1001, g(0.001).ce/g(0.001).mse, 0);
  iddia('MSE gradyanı p=0.5', 0.125000, g(0.5).mse, 6);
  iddia('CE gradyanı p=0.5', 0.5000, g(0.5).ce, 4);
  iddia('CE gradyanı hep MSE üstünde', true,
        [0.001,0.01,0.1,0.3,0.5,0.7,0.9].every(pp => g(pp).ce > g(pp).mse));
  /* sicaklik */
  [[0.5,0.867],[1,0.665],[2,0.506],[5,0.402]].forEach(([T,bek]) =>
    iddia('T='+T+' kedi olasılığı', bek, smSoftmax([2,1,0],T)[0], 3));
  iddia('sıcaklık sıralamayı bozmuyor', true,
        [0.2,0.5,1,2,5].every(T => { const q = smSoftmax([2,1,0],T); return q[0] > q[1] && q[1] > q[2]; }));
  /* emin ve dogru tahminde MSE kaybi CE'den kucuk: derste bu da yaziyor */
  const q2 = smSoftmax([2.6,-2,-2]);
  iddia('emin+doğru CE kaybı', 0.0199, smCE(q2,0), 4);
  iddia('emin+doğru MSE kaybı', 0.0002, ((q2[0]-1)**2+q2[1]**2+q2[2]**2)/3, 4);
}


console.log('═══ DAĞILIM KAYMASI ═══');
{
  const E = dkEgitim();
  iddia('eğitim doğruluğu %', 96.0, 100*dkDogruluk(E.M, E.D), 1);
  [[0,96.0],[0.6,91.5],[0.9,88.0],[1.5,71.8],[2.1,52.3]].forEach(([k,bek]) =>
    iddia('kayma '+k+' doğruluk %', bek, 100*dkCanli(k).dogruluk, 1));
  iddia('kayma 0 girdi sapması σ', 0.03, Math.abs(dkCanli(0).z), 2);
  iddia('kayma 1.5 girdi sapması σ', 2.78, Math.abs(dkCanli(1.5).z), 2);
  iddia('kayma 2.1 girdi sapması σ', 3.88, Math.abs(dkCanli(2.1).z), 2);
  iddia('doğruluk kaymayla düşüyor', true,
        [0,0.6,0.9,1.5,2.1].every((k,i,a) => i===0 || dkCanli(k).dogruluk < dkCanli(a[i-1]).dogruluk));
  iddia('girdi sapması kaymayla büyüyor', true,
        [0,0.6,0.9,1.5,2.1].every((k,i,a) => i===0 || Math.abs(dkCanli(k).z) > Math.abs(dkCanli(a[i-1]).z)));
  /* model gercekten degismiyor: ayni agirliklar */
  const w0 = dkEgitim().M.w.slice(), c0 = dkEgitim().M.c;
  dkCanli(2.1);
  iddia('model ağırlıkları değişmedi', true,
        dkEgitim().M.w[0] === w0[0] && dkEgitim().M.w[1] === w0[1] && dkEgitim().M.c === c0);
  iddia('2.1 kaymada yazı turaya yakın', true, dkCanli(2.1).dogruluk < 0.55);
}


console.log('═══ ÖZELLİK ÖNEMİ ═══');
{
  const A = ooOnem('ols'), R = ooOnem('ridge');
  iddia('OLS taban test MSE', 1.650, A.taban, 3);
  iddia('ridge taban test MSE', 0.901, R.taban, 3);
  iddia('OLS x0 katsayı', 3.87, Math.abs(A.M.w[0]), 2);
  iddia('OLS x1 katsayı', 0.15, Math.abs(A.M.w[1]), 2);
  iddia('ridge x1 katsayı', 1.59, Math.abs(R.M.w[1]), 2);
  iddia('OLS x0 perm önem', 26.331, A.tek[0], 3);
  iddia('OLS x1 perm önem', -0.292, A.tek[1], 3);
  iddia('OLS x2 perm önem', 6.989, A.tek[2], 3);
  iddia('ridge x0 perm önem', 5.807, R.tek[0], 3);
  iddia('ridge x1 perm önem', 4.494, R.tek[1], 3);
  iddia('ridge x0+x1 birlikte', 16.588, R.cift, 3);
  iddia('ridge tek tek toplamı', 10.301, R.tek[0]+R.tek[1], 3);
  iddia('OLS x0+x1 birlikte', 27.329, A.cift, 3);
  /* dersin iddialari */
  iddia('aynı veri, iki model çelişiyor', true, A.tek[1] < 0 && R.tek[1] > 4);
  iddia('ridge: birlikte > ayrı ayrı toplamı', true, R.cift > R.tek[0] + R.tek[1] + 3);
  iddia('OLS: birlikte ≈ x0 tek başına', true, Math.abs(A.cift - A.tek[0]) < 1.5);
  iddia('x1 gerçek katsayısı sıfır', 0, DATA.ceza.gercek[1], 0);
  iddia('gürültü özellikleri önemsiz çıkıyor', true,
        [3,4,5].every(j => Math.abs(R.tek[j]) < 0.1 && Math.abs(A.tek[j]) < 0.1));
}


console.log('═══ FISHER LDA ═══');
{
  const f = FL.enIyi.fisher, p = FL.enIyi.pca, der = t => t*180/Math.PI;
  iddia('Fisher yönü derece', 44.5, der(f), 1);
  iddia('PCA yönü derece', 136.3, der(p), 1);
  iddia('aradaki açı', 91.8, Math.abs(der(f)-der(p)), 1);
  iddia('Fisher J', 0.0394, flJ(f), 4);
  iddia('PCA yönünde J', 0.0001, flJ(p), 4);
  iddia('J oranı', 573, flJ(f)/flJ(p), 0);
  iddia('Fisher doğruluğu %', 97.8, 100*flDogruluk(f), 1);
  iddia('PCA doğruluğu %', 54.5, 100*flDogruluk(p), 1);
  iddia('PCA yayılımı', 6.200, flVar(p), 3);
  iddia('Fisher yayılımı', 0.758, flVar(f), 3);
  iddia('PCA en yüksek yayılımı seçiyor', true,
        [0,30,60,90,120,150].every(g => flVar(g*Math.PI/180) <= flVar(p) + 1e-9));
  iddia('Fisher en yüksek J yi seçiyor', true,
        [0,30,60,90,120,150].every(g => flJ(g*Math.PI/180) <= flJ(f) + 1e-9));
  iddia('Fisher yayılımı PCA nin sekizde biri', 8.2, flVar(p)/flVar(f), 1);
}


console.log('═══ ÜRETİCİ ve AYIRICI ═══');
{
  const R = udEgri(), nk = n => R.find(x => x.n === n);
  iddia('n=16 naive Bayes %', 73.3, 100*nk(16).nb, 1);
  iddia('n=16 lojistik %', 71.1, 100*nk(16).lr, 1);
  iddia('n=40 naive Bayes %', 77.4, 100*nk(40).nb, 1);
  iddia('n=40 lojistik %', 77.4, 100*nk(40).lr, 1);
  iddia('n=100 naive Bayes %', 79.6, 100*nk(100).nb, 1);
  iddia('n=100 lojistik %', 81.6, 100*nk(100).lr, 1);
  iddia('n=1000 naive Bayes %', 79.8, 100*nk(1000).nb, 1);
  iddia('n=1000 lojistik %', 84.1, 100*nk(1000).lr, 1);
  iddia('n=1000 fark puan', 4.3, 100*(nk(1000).lr - nk(1000).nb), 1);
  /* dersin iki temel iddiasi */
  iddia('az veride üretici önde', true, nk(16).nb > nk(16).lr);
  iddia('çok veride ayırıcı önde', true, nk(1000).lr > nk(1000).nb + 0.03);
  iddia('naive Bayes 200 sonrası tıkanıyor', true,
        Math.abs(nk(1000).nb - nk(200).nb) < 0.005);
  iddia('lojistik 200 sonrası yükselmeye devam', true,
        nk(1000).lr > nk(200).lr + 0.008);
  iddia('kesişme 40 örnekte', 40, (R.find((x,i) => i>0 && x.lr >= x.nb) || {}).n, 0);
}


console.log('═══ NORMAL DENKLEM ═══');
{
  /* 10 ogrenci verisinde kapali cozum, mufredattaki gradyan sonucuyla ayni mi? */
  const S = DATA.study;
  let sx=0, sy=0, sxx=0, sxy=0;
  S.X.forEach((x,i) => { sx+=x; sy+=S.Y[i]; sxx+=x*x; sxy+=x*S.Y[i]; });
  const n = S.X.length;
  const wKapali = (n*sxy - sx*sy)/(n*sxx - sx*sx);
  const bKapali = (sy - wKapali*sx)/n;
  iddia('kapalı çözüm w', 7.727, wKapali, 3);
  iddia('kapalı çözüm b', 20.80, bKapali, 2);
  iddia('kapalı çözüm = gradyan sonucu (w)', S.wStar, wKapali, 3);
  iddia('kapalı çözüm = gradyan sonucu (b)', S.bStar, bKapali, 2);
  iddia('kapalı çözüm MSE', 5.20, S.X.reduce((s,x,i)=>s+(wKapali*x+bKapali-S.Y[i])**2,0)/n, 2);

  /* kosul sayisi ve kararsizlik */
  const D = r => ekVeri(r, 7), E = r => ekVeri(r, 8);
  iddia('r=0 determinant', 10560.1, ekCoz(D(0),0).det, 1);
  iddia('r=0 koşul sayısı', 1, ekKosul(D(0),0), 0);
  iddia('r=0.99 koşul sayısı', 233, ekKosul(D(0.99),0), 0);
  iddia('r=0.999 koşul sayısı', 2361, ekKosul(D(0.999),0), 0);
  iddia('r=0.9999 koşul sayısı', 23669, ekKosul(D(0.9999),0), 0);
  iddia('r=0.9999 determinant', 2.1, ekCoz(D(0.9999),0).det, 1);
  const fark = r => Math.abs(ekCoz(D(r),0).w[0] - ekCoz(E(r),0).w[0]);
  iddia('r=0 iki örneklem farkı', 0.03, fark(0), 2);
  iddia('r=0.9999 iki örneklem farkı', 0.90, fark(0.9999), 2);
  iddia('korelasyon arttıkça koşul büyüyor', true,
        [0,0.5,0.9,0.99,0.999,0.9999].every((r,i,a) => i===0 || ekKosul(D(r),0) > ekKosul(D(a[i-1]),0)));
  iddia('r=0.9999 örneklem B katsayısı gerçekten sapıyor', 2.94, ekCoz(E(0.9999),0).w[0], 2);

  /* lambda onariyor */
  iddia('r=0.999 λ=0 koşul', 2361, ekKosul(D(0.999), 0), 0);
  iddia('r=0.999 λ=1 koşul', 205, ekKosul(D(0.999), 1), 0);
  iddia('r=0.999 λ=10 koşul', 23, ekKosul(D(0.999), 10), 0);
  iddia('λ büyüdükçe koşul düşüyor', true,
        [0,0.1,1,10].every((l,i,a) => i===0 || ekKosul(D(0.999), l) < ekKosul(D(0.999), a[i-1])));
}


console.log('═══ SPLINE ═══');
{
  const P = p => spUydur(false, p), S = p => spUydur(true, p);
  iddia('polinom 6 param hata', 0.0173, P(6).mse, 4);
  iddia('polinom 14 param hata', 0.00371, P(14).mse, 5);
  iddia('polinom 19 param hata', 0.00306, P(19).mse, 5);
  iddia('polinom 30 param hata', 0.00240, P(30).mse, 5);
  iddia('polinom 14 en kötü sapma', 0.204, P(14).enUc, 3);
  iddia('polinom 30 en kötü sapma', 0.159, P(30).enUc, 3);
  iddia('spline 19 param hata', 0.000737, S(19).mse, 6);
  iddia('spline 30 param hata', 0.000759, S(30).mse, 6);
  iddia('spline 19 en kötü sapma', 0.050, S(19).enUc, 3);
  iddia('19 parametrede spline kaç kat iyi', 4.1, P(19).mse / S(19).mse, 1);
  iddia('19 parametrede en kötü sapma oranı', 3.7, P(19).enUc / S(19).enUc, 1);
  /* dersin iddialari */
  iddia('polinom en kötü sapması iyileşmiyor', true, P(30).enUc > 0.15);
  iddia('spline 19 sonrası doyuyor', true, Math.abs(S(30).mse - S(19).mse) < 5e-5);
  iddia('düğüm sayısı = parametre - 4', 15, spDugumler(19-4).length, 0);
  iddia('düğümler eşit aralıklı', true,
        (() => { const d = spDugumler(4); return Math.abs((d[1]-d[0]) - (d[2]-d[1])) < 1e-9; })());
}

console.log('═══ MÜFREDAT + YAPI ═══');
let hz=0,tp=0;
ROTALAR.forEach(r=>{const h=r.dersler.filter(d=>d.durum==='hazir').length;hz+=h;tp+=r.dersler.length;
  console.log('  R'+r.id+' '+r.ad.padEnd(30)+'█'.repeat(h)+'░'.repeat(r.dersler.length-h)+'  '+h+'/'+r.dersler.length);});
let xp=0,ad=0,q=0,unl=0,yh=0,kn=0;
Object.entries(DERSLER).forEach(([id,d])=>{
  xp+=d.adimlar.reduce((s,a)=>s+a.xp,0); ad+=d.adimlar.length; kn+=(d.kaynaklar||[]).length;
  if(!d.kaynaklar){console.log('  ✗ kaynaksız: '+id);yh++;}
  d.adimlar.forEach((a,i)=>{
    if(a.quiz)q++; if(a.unlock)unl++;
    if(!VIZ[a.viz]){console.log('  ✗ '+id+'['+(i+1)+'] viz: '+a.viz);yh++;}
    if(a.quiz){if(a.quiz.correct<0||a.quiz.correct>=a.quiz.opts.length){console.log('  ✗ '+id+' quiz');yh++;}
      a.quiz.opts.forEach((o2,k)=>{if(!o2.t||!o2.why){console.log('  ✗ '+id+'['+(i+1)+'] şık '+k);yh++;}});}
    /* KURAL: derive'ın yazdığı anahtar, control anahtarıyla çakışamaz */
    if(a.derive&&a.controls){
      const st={...(a.state||{})}; a.controls.forEach(c=>st[c.k]=c.val);
      let d={}; try{ d=a.derive(st)||{}; }catch(e){}
      a.controls.forEach(c=>{ if(c.k in d){
        console.log('  ✗ '+id+'['+(i+1)+'] ANAHTAR ÇAKIŞMASI: control ve derive ikisi de "'+c.k+'" yazıyor'); yh++; }});
    }
    /* Motor kilidi vizState() ile sinar: once derive calisir, sonra unlock.
       Tarama da ayni sirayi izlemeli, yoksa derive'a bagli kilitler
       'acilamiyor' gorunur. */
    if(a.unlock&&a.controls){let acik=false;
      const kb=(ix,st)=>{if(acik)return; if(ix>=a.controls.length){
        let s2=st; if(a.derive){ try{ s2={...st, ...(a.derive(st)||{})}; }catch(e){} }
        try{if(a.unlock(s2))acik=true;}catch(e){}return;}
        const c=a.controls[ix];
        for(let v2=c.min;v2<=c.max;v2+=Math.max(c.step,(c.max-c.min)/25)) kb(ix+1,{...st,[c.k]:v2});};
      kb(0,{...(a.state||{})});
      if(!acik){console.log('  ✗ '+id+'['+(i+1)+'] KİLİT AÇILAMIYOR');yh++;}}
  });
});

/* ═══ İNGİLİZCE İÇERİK · Türkçe aslıyla birebir aynı iskelet olmalı ═══ */
let nEn = 0;
Object.entries(DERSLER_EN).forEach(([id,e])=>{
  const t = DERSLER[id];
  if(!t){ console.log('  ✗ EN '+id+': Türkçe karşılığı yok'); yh++; return; }
  nEn++;
  if(!e.ad||!e.alt){ console.log('  ✗ EN '+id+': ad/alt eksik'); yh++; }
  if(e.adimlar.length!==t.adimlar.length){
    console.log('  ✗ EN '+id+': adım sayısı '+e.adimlar.length+', Türkçesi '+t.adimlar.length); yh++; return; }
  e.adimlar.forEach((a,i)=>{
    const b = t.adimlar[i], p = '  ✗ EN '+id+'['+(i+1)+'] ';
    if(a.kind!==b.kind){ console.log(p+'kind: '+a.kind+' ≠ '+b.kind); yh++; }
    if(a.viz!==b.viz){ console.log(p+'viz: '+a.viz+' ≠ '+b.viz); yh++; }
    if(a.xp!==b.xp){ console.log(p+'xp: '+a.xp+' ≠ '+b.xp); yh++; }
    if(!a.t||!a.goal||!a.todo||!a.learned){ console.log(p+'metin alanı eksik'); yh++; }
    const ak=(a.controls||[]).map(c=>c.k).join(','), bk=(b.controls||[]).map(c=>c.k).join(',');
    if(ak!==bk){ console.log(p+'control anahtarları: ['+ak+'] ≠ ['+bk+']'); yh++; }
    (a.controls||[]).forEach((c,j)=>{ const d2=b.controls[j];
      if(c.min!==d2.min||c.max!==d2.max||c.step!==d2.step||c.val!==d2.val){
        console.log(p+'kaydırıcı aralığı farklı: '+c.k); yh++; } });
    const af=a.kind==='phases'?a.phases.length:(a.kind==='play'?a.frames().length:0);
    const bf=b.kind==='phases'?b.phases.length:(b.kind==='play'?b.frames().length:0);
    if(af!==bf){ console.log(p+'faz/kare sayısı: '+af+' ≠ '+bf); yh++; }
    if(!!a.quiz!==!!b.quiz){ console.log(p+'quiz var/yok farkı'); yh++; }
    else if(a.quiz){
      if(a.quiz.correct!==b.quiz.correct){ console.log(p+'quiz doğru şık indeksi farklı'); yh++; }
      if(a.quiz.opts.length!==b.quiz.opts.length){ console.log(p+'quiz şık sayısı farklı'); yh++; }
      a.quiz.opts.forEach((o3,k)=>{ if(!o3.t||!o3.why){ console.log(p+'quiz şık '+k+' eksik'); yh++; } });
    }
  });
});

console.log('');
console.log('  '+hz+' hazır / '+tp+' ders · '+ad+' adım · '+xp+' XP · '+q+' soru · '+unl+' kilit · '+kn+' kaynak · '+Object.keys(VIZ).length+' görsel');
console.log('  İngilizce çevrilmiş ders: '+nEn+' / '+Object.keys(DERSLER).length);
console.log('');
console.log('═════════════════════════════════');
console.log('  SAYI: '+ok+' ✓  ·  '+ht+' ✗      YAPI: '+yh+' hata');
console.log('═════════════════════════════════');
`;
eval(V+C+E+T);
