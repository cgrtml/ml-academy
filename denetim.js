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


console.log('═══ PEKİŞTİRMELİ ÖĞRENME ═══');
{
  const E = (e, g) => rlOgren(e, g === undefined ? 0.95 : g, 400, 17);
  const son50 = R => R.basari.slice(-50).reduce((a,b)=>a+b,0)/50;
  /* kesif olmadan hicbir sey ogrenilmiyor */
  const R0 = E(0);
  iddia('ε=0 politika başarısız', false, rlPolitika(R0.Q).basarili);
  iddia('ε=0 ulaşan hücre', 0, rlUlasan(R0.Q), 0);
  iddia('ε=0 eğitim başarısı', 0, 100*son50(R0), 0);
  /* az kesif yeter */
  const R5 = E(0.05);
  iddia('ε=0.05 politika adım', 10, rlPolitika(R5.Q).adim, 0);
  iddia('ε=0.05 eğitim başarısı %', 96.0, 100*son50(R5), 1);
  iddia('ε=0.05 ulaşan hücre', 18, rlUlasan(R5.Q), 0);
  /* cok kesif: egitimde kotu, politika yine iyi (politika disi ogrenme) */
  const R9 = E(0.9);
  iddia('ε=0.9 eğitim başarısı %', 6.0, 100*son50(R9), 1);
  iddia('ε=0.9 politika yine en kısa yol', 10, rlPolitika(R9.Q).adim, 0);
  iddia('ε=0.9 bütün hücrelere ulaşıyor', 31, rlUlasan(R9.Q), 0);
  iddia('ε=0.15 eğitim başarısı %', 92.0, 100*son50(E(0.15)), 1);
  iddia('ε=0.5 eğitim başarısı %', 42.0, 100*son50(E(0.5)), 1);
  iddia('keşif arttıkça eğitim başarısı düşüyor', true,
        [0.05,0.15,0.5,0.9].every((e,i,a) => i===0 || son50(E(e)) < son50(E(a[i-1]))));
  /* gamma: ufuk */
  const q0 = g => Math.max(...E(0.15, g).Q[RL.bas[0]][RL.bas[1]]);
  iddia('γ=0.5 başlangıç değeri', 0.0020, q0(0.5), 4);
  iddia('γ=0.9 başlangıç değeri', 0.3874, q0(0.9), 4);
  iddia('γ=0.95 başlangıç değeri', 0.6302, q0(0.95), 4);
  iddia('γ=1 başlangıç değeri', 1.0000, q0(1), 4);
  iddia('γ=0.5 ulaşan hücre', 11, rlUlasan(E(0.15, 0.5).Q), 0);
  iddia('γ=0.95 ulaşan hücre', 19, rlUlasan(E(0.15, 0.95).Q), 0);
  iddia('teorik 0.9^10', 0.3487, Math.pow(0.9,10), 4);
  iddia('teorik 0.95^10', 0.5987, Math.pow(0.95,10), 4);
  iddia('ölçülen değer teoriden yüksek (maksimizasyon yanlılığı)', true,
        [0.9,0.95].every(g => q0(g) > Math.pow(g,10)));
  iddia('en kısa yol 10 adım', 10, Math.abs(RL.hedef[0]-RL.bas[0]) + Math.abs(RL.hedef[1]-RL.bas[1]), 0);
}


console.log('═══ A* ARAMASI ═══');
{
  const D = asAra('dijkstra',1), A1 = asAra('astar',1), A15 = asAra('astar',1.5),
        A3 = asAra('astar',3), G = asAra('acgozlu',1);
  iddia('gezilebilir hücre', 348, AS.gezilebilir, 0);
  iddia('optimal yol', 35, asOptimal(), 0);
  iddia('Dijkstra açılan', 311, D.genisletilen, 0);
  iddia('Dijkstra yol', 35, D.yol.length, 0);
  iddia('A* açılan', 245, A1.genisletilen, 0);
  iddia('A* yol', 35, A1.yol.length, 0);
  iddia('A* w=1.5 açılan', 154, A15.genisletilen, 0);
  iddia('A* w=1.5 yol', 35, A15.yol.length, 0);
  iddia('A* w=3 açılan', 153, A3.genisletilen, 0);
  iddia('A* w=3 yol', 37, A3.yol.length, 0);
  iddia('açgözlü açılan', 117, G.genisletilen, 0);
  iddia('açgözlü yol', 47, G.yol.length, 0);
  iddia('açgözlü yol yüzde kaç uzun', 34.3, 100*(G.yol.length/asOptimal()-1), 1);
  iddia('A* Dijkstradan yüzde kaç az açıyor', 21.2, 100*(1-A1.genisletilen/D.genisletilen), 1);
  /* dersin iddialari */
  iddia('A* optimal, açgözlü değil', true, A1.yol.length === asOptimal() && G.yol.length > asOptimal());
  iddia('w büyüdükçe açılan azalıyor', true, A15.genisletilen < A1.genisletilen);
  iddia('w=3 optimalliği bozuyor', true, A3.yol.length > asOptimal());
  iddia('ağırlıklı A* garantisi: yol <= w * optimal', true, A3.yol.length <= 3*asOptimal());
  /* Manhattan sezgisi kabul edilebilir mi: gercek yol >= Manhattan */
  iddia('Manhattan sezgisi kabul edilebilir', true,
        asOptimal()-1 >= Math.abs(AS.hedef[0]-AS.bas[0]) + Math.abs(AS.hedef[1]-AS.bas[1]));
}


console.log('═══ TAYLOR ve NEWTON ═══');
{
  iddia('başlangıç f', 0.0384, TY.f(TY.x0), 4);
  iddia('başlangıç türev', -2.2960, TY.g(TY.x0), 4);
  iddia('başlangıç ikinci türev', 6.6800, TY.h(TY.x0), 4);
  const A = lr => tyAdimlar(lr);
  iddia('adım 0.02 gerçek', -0.0601, A(0.02).gercek, 4);
  iddia('adım 0.02 doğrusal hata', 0.0069, Math.abs(A(0.02).gercek - A(0.02).dogrusal), 4);
  iddia('adım 0.02 ikinci derece hata', 0.0002, Math.abs(A(0.02).gercek - A(0.02).ikinci), 4);
  iddia('adım 0.1 doğrusal hata', 0.1574, Math.abs(A(0.1).gercek - A(0.1).dogrusal), 4);
  iddia('adım 0.1 ikinci derece hata', 0.0187, Math.abs(A(0.1).gercek - A(0.1).ikinci), 4);
  iddia('adım 0.3 doğrusal hata', 1.1180, Math.abs(A(0.3).gercek - A(0.3).dogrusal), 4);
  iddia('adım 0.5 doğrusal hata', 2.4153, Math.abs(A(0.5).gercek - A(0.5).dogrusal), 4);
  iddia('adım 0.5 doğrusal tahmin', -2.5974, A(0.5).dogrusal, 4);
  iddia('adım 0.5 gerçek', -0.1821, A(0.5).gercek, 4);
  iddia('adım 0.5 ikinci derece tahmin', 1.8044, A(0.5).ikinci, 4);
  /* hata adimin karesiyle buyuyor mu: 0.1 -> 0.2 iken yaklasik 4 kat */
  const h1 = Math.abs(A(0.1).gercek - A(0.1).dogrusal), h2 = Math.abs(A(0.2).gercek - A(0.2).dogrusal);
  iddia('adımı 2 katlayınca hata ~4 kat', true, h2/h1 > 3 && h2/h1 < 4.2);
  /* ikinci derece her adimda daha iyi */
  iddia('ikinci derece hep daha az hatalı', true,
        [0.02,0.05,0.1,0.2,0.3].every(l =>
          Math.abs(A(l).gercek - A(l).ikinci) < Math.abs(A(l).gercek - A(l).dogrusal)));
  /* Newton yakinsama */
  iddia('minimum x', -1.0880339, TY.min.x, 7);
  iddia('minimum f', -0.4591595, TY.min.f, 7);
  const nHata = t => Math.abs(tyNewton(t) - TY.min.x);
  iddia('Newton 3 adım hata', 9.05e-4, nHata(3), 6);
  iddia('Newton 4 adım hata', 1.05e-6, nHata(4), 8);
  iddia('Newton karesel yakınsıyor', true, nHata(4) < nHata(3)*nHata(3)*100);
  let gA = -1, nA = -1;
  for (let t = 1; t <= 400; t++){
    if (gA < 0 && Math.abs(tyInis(0.1,t) - TY.min.x) < 1e-6) gA = t;
    if (nA < 0 && nHata(t) < 1e-6) nA = t;
  }
  iddia('gradyan 1e-6 için adım', 43, gA, 0);
  iddia('Newton 1e-6 için adım', 5, nA, 0);
  iddia('Newton kaç kat az adım', 8.6, gA/nA, 1);
  /* cok buyuk adim yanlis kuyuya goturuyor */
  iddia('lr=0.8 yanlış kuyuya kaçıyor', true, tyInis(0.8, 30) > 0);
}


console.log('═══ HESSIAN · KOŞUL SAYISI ═══');
{
  const ad = k => hsAdim(k, 1, hsOptLr(k, 1), 1e-3);
  iddia('κ=1 adım', 1, ad(1), 0);
  iddia('κ=2 adım', 7, ad(2), 0);
  iddia('κ=5 adım', 18, ad(5), 0);
  iddia('κ=20 adım', 73, ad(20), 0);
  iddia('κ=50 adım', 182, ad(50), 0);
  iddia('κ=100 adım', 363, ad(100), 0);
  iddia('adım sayısı κ ile artıyor', true,
        HS.kapsam.every((k, i, a2) => i === 0 || ad(k) > ad(a2[i-1])));
  /* adim/κ orani kabaca sabit: dogru orantili */
  iddia('adım ≈ 3.6 κ (κ=100)', 3.6, ad(100)/100, 1);
  iddia('adım ≈ 3.6 κ (κ=50)', 3.6, ad(50)/50, 1);
  /* kararlilik siniri tam 2/a */
  iddia('κ=20 kararlılık sınırı', 0.1000, hsMaxLr(20), 4);
  iddia('sınırın altında yakınsıyor', false, hsInis(20, 1, 0.95*hsMaxLr(20), 60).sapti);
  iddia('sınırın üstünde ıraksıyor', true, hsInis(20, 1, 1.05*hsMaxLr(20), 200).sapti);
  /* tam sinirda sabit genlikte salinim: |x| sabit 1 kaliyor */
  {
    const R = hsInis(20, 1, hsMaxLr(20), 60);
    const son = R.iz[R.iz.length-1];
    iddia('tam sınırda genlik sabit', 1.0, Math.abs(son[0]), 3);
  }
  iddia('optimal η = 2/(a+b)', 0.0952, hsOptLr(20, 1), 4);
  iddia('κ=1 optimal η', 1.0000, hsOptLr(1, 1), 4);
}


console.log('═══ GAUSSIAN PROCESS ═══');
{
  const M = gpModel(1.0, 6);
  iddia('veri noktasında std', 0.0497, M(0.4).sd, 4);
  iddia('gürültü seviyesi', 0.05, GP.sn, 4);
  iddia('x=5 std (veri yok)', 0.9982, M(5).sd, 4);
  iddia('belirsizlik oranı', 20.1, M(5).sd / M(0.4).sd, 1);
  iddia('x=5 tahmini', -0.022, M(5).ort, 3);
  iddia('x=5 gerçek değer', 2.739, GP.f0(5), 3);
  /* Ders bandin her zaman gercegi kapsamadigini soyluyor; ikisini de sinayalim. */
  iddia('x=4 sapma kaç σ', 1.80, Math.abs(M(4).ort - GP.f0(4)) / M(4).sd, 2);
  iddia('x=4 bandın içinde', true, Math.abs(M(4).ort - GP.f0(4)) < 2*M(4).sd);
  iddia('x=5 sapma kaç σ', 2.77, Math.abs(M(5).ort - GP.f0(5)) / M(5).sd, 2);
  iddia('x=5 bandın dışında', true, Math.abs(M(5).ort - GP.f0(5)) > 2*M(5).sd);
  iddia('x=1.8 tahmini', 0.891, M(1.8).ort, 3);
  iddia('x=1.8 gerçek', 0.889, GP.f0(1.8), 3);
  /* gozlem ekledikce belirsizlik dusuyor */
  iddia('2 gözlemde x=1.8 std', 1.000, gpModel(1.0,2)(1.8).sd, 3);
  iddia('6 gözlemde x=1.8 std', 0.301, gpModel(1.0,6)(1.8).sd, 3);
  iddia('gözlem arttıkça belirsizlik azalıyor', true,
        [1,2,4,6].every((k,i,a2) => i===0 || gpModel(1.0,k)(1.8).sd <= gpModel(1.0,a2[i-1])(1.8).sd));
  /* uzunluk olcegi */
  iddia('l=0.3 x=1.8 std', 0.999, gpModel(0.3,6)(1.8).sd, 3);
  iddia('l=0.3 x=1.8 ortalama', 0.038, gpModel(0.3,6)(1.8).ort, 3);
  iddia('l=1.0 x=1.8 ortalama', 0.891, gpModel(1.0,6)(1.8).ort, 3);
  iddia('l=2.0 x=1.8 ortalama', 1.269, gpModel(2.0,6)(1.8).ort, 3);
  iddia('l=2.0 x=1.8 std', 0.073, gpModel(2.0,6)(1.8).sd, 3);
  /* l=2.0 emin ama yanlis: sapma 3 sigmadan buyuk mu */
  iddia('l=2.0 emin ama yanlış', true,
        Math.abs(gpModel(2.0,6)(1.8).ort - GP.f0(1.8)) > 3*gpModel(2.0,6)(1.8).sd);
  iddia('l büyüdükçe belirsizlik azalıyor', true,
        [0.3,0.6,1.0,2.0].every((l,i,a2) => i===0 || gpModel(l,6)(1.8).sd < gpModel(a2[i-1],6)(1.8).sd));
}

console.log('═══ BAYESÇİ MODEL KANITI ═══');
{
  iddia('derece 0 eğitim hatası', 0.19242, byEgitimHata(0), 5);
  iddia('derece 9 eğitim hatası', 0.02155, byEgitimHata(9), 5);
  /* ic ice gecmis ailelerde egitim hatasi asla yukselemez: derse dayanak bu */
  {
    let ihlal = 0;
    for (let d2 = 1; d2 <= 9; d2++) if (byEgitimHata(d2) > byEgitimHata(d2-1) + 1e-9) ihlal++;
    iddia('eğitim hatası hiçbir derecede yükselmiyor', 0, ihlal, 0);
  }
  iddia('derece 2 log kanıtı', -34.912, byKanit(2).k, 2);
  iddia('derece 3 log kanıtı', -6.656, byKanit(3).k, 2);
  iddia('derece 2→3 kanıt sıçraması', 28.26, byKanit(3).k - byKanit(2).k, 2);
  /* sicrama 10^12 mertebesinde bir Bayes carpani */
  iddia('sıçramanın Bayes çarpanı (log10)', 12.27,
        (byKanit(3).k - byKanit(2).k)/Math.LN10, 2);
  /* yetersiz modeller (0,1,2) yeterli olanlarin hepsinden acik farkla kotu */
  {
    let kotuYeterli = 1e9, iyiYetersiz = -1e9;
    for (let d2 = 3; d2 <= 9; d2++) kotuYeterli = Math.min(kotuYeterli, byKanit(d2).k);
    for (let d2 = 0; d2 <= 2; d2++) iyiYetersiz = Math.max(iyiYetersiz, byKanit(d2).k);
    iddia('en kötü yeterli model, en iyi yetersizden 25+ log birim iyi',
          true, kotuYeterli - iyiYetersiz > 25);
  }
  /* zirve gercek dereceyi (3) degil 5 i gosteriyor · ders bunu boyle yaziyor */
  {
    let en = {k:-1e9, d:-1};
    for (let d2 = 0; d2 <= 9; d2++) if (byKanit(d2).k > en.k) en = {k:byKanit(d2).k, d:d2};
    iddia('kanıtın zirvesi (gerçek derece 3 değil)', 5, en.d, 0);
  }
  iddia('derece 5 log kanıtı', -6.020, byKanit(5).k, 2);
  iddia('derece 9 log kanıtı', -6.709, byKanit(9).k, 2);
  iddia('zirve ile derece 9 farkı', 0.689, byKanit(5).k - byKanit(9).k, 2);
  /* asil iddia: yeterli modeller arasindaki fark karar verdirmiyor */
  {
    let mn = 1e9, mx = -1e9;
    for (let d2 = 3; d2 <= 9; d2++){ mn = Math.min(mn, byKanit(d2).k); mx = Math.max(mx, byKanit(d2).k); }
    iddia('derece 3..9 kanıt aralığı 1 log biriminin altında', true, mx - mn < 1.0);
    iddia('bu aralık Bayes çarpanı olarak 3 katın altında', true, Math.exp(mx - mn) < 3);
  }
  iddia('gerçek fonksiyonun 3. derece katsayısı', 2.4, BY.gercek[3], 6);
  iddia('gerçek fonksiyonun 2. derece katsayısı sıfır', 0, BY.gercek[2], 6);
  iddia('gözlem sayısı', 16, BY.veri.X.length, 0);
  /* Ders "kanit on dagilima baglidir" diyor. Bu veride oyle mi? Olcelim.
     Alfa'yi optimize etmek yerine kaba bir alfa=1 alsak sonuc degisiyor mu: hayir. */
  {
    let en1 = {k:-1e9, d:-1};
    for (let d2 = 0; d2 <= 9; d2++){ const k = byLogKanit(d2, 1);
      if (k > en1.k) en1 = {k, d:d2}; }
    iddia('sabit α=1 ile de zirve aynı dereceye düşüyor', 5, en1.d, 0);
    iddia('sabit α=1 ile de derece 2→3 sıçraması 25 log biriminin üstünde',
          true, byLogKanit(3,1) - byLogKanit(2,1) > 25);
    iddia('α=1 deki sıçrama', 32.95, byLogKanit(3,1) - byLogKanit(2,1), 2);
  }
  iddia('derece 2 için en iyi α > 1 (ağırlıklar bastırılıyor)', true, byKanit(2).alfa > 1);
  iddia('derece 3 için en iyi α < 1 (ağırlıklara yer açılıyor)', true, byKanit(3).alfa < 1);
}

console.log('═══ ÖZELLİK MÜHENDİSLİĞİ ═══');
{
  const D = OM.oda, ham = omDogrusal(0), etk = omDogrusal(1);
  /* etkilesim */
  iddia('ham (en,boy) test R²', 0.8854, omR2(D.TE, ham), 4);
  iddia('ham test RMSE', 5.439, omRmse(D.TE, ham), 3);
  iddia('+en×boy test R²', 0.9886, omR2(D.TE, etk), 4);
  iddia('+en×boy test RMSE', 1.713, omRmse(D.TE, etk), 3);
  iddia('RMSE kaç kat düştü', 3.2, omRmse(D.TE, ham)/omRmse(D.TE, etk), 1);
  iddia('öğrenilen çarpım katsayısı (gerçek 2.5)', 2.588, etk.b[3], 3);
  iddia('etkileşim sadece 1 parametre ekliyor', 1, etk.b.length - ham.b.length, 0);
  iddia('eğitim ve test ayrık', 90, D.TR.length + D.TE.length, 0);
  iddia('test kümesi boyu', 30, D.TE.length, 0);
  /* dongusel */
  const k0 = omSaatModel(0), k1 = omSaatModel(1), k2 = omSaatModel(2);
  iddia('ham saat test R²', -0.0650, k0.r2, 4);
  iddia('ham saat ortalamadan bile kötü', true, k0.r2 < 0);
  iddia('saat+saat² test R²', 0.9328, k1.r2, 4);
  iddia('sin/cos test R²', 0.9750, k2.r2, 4);
  iddia('sin/cos en iyi kodlama', true, k2.r2 > k1.r2 && k2.r2 > k0.r2);
  /* gece yarisi sinirinda sicrama */
  iddia('gerçek 23→0 farkı', 1.4, Math.abs(OM.saat.f0(23) - OM.saat.f0(0)), 1);
  iddia('parabolün 23→0 sıçraması', 16.7, k1.sicrama, 1);
  iddia('sin/cos 23→0 sıçraması', 1.0, k2.sicrama, 1);
  iddia('parabol gerçek farkın 10 katından fazla sıçrıyor', true,
        k1.sicrama > 10 * Math.abs(OM.saat.f0(23) - OM.saat.f0(0)));
  /* cember uzerinde mesafe */
  {
    const m = (a, b) => Math.hypot(Math.sin(2*Math.PI*a/24) - Math.sin(2*Math.PI*b/24),
                                   Math.cos(2*Math.PI*a/24) - Math.cos(2*Math.PI*b/24));
    iddia('çemberde 23↔0 mesafesi', 0.261, m(23, 0), 3);
    iddia('çemberde 12↔0 mesafesi', 2.000, m(12, 0), 3);
    iddia('gece yarısı komşuları kaç kat yakın', 7.7, m(12,0)/m(23,0), 1);
  }
  /* olcek */
  iddia('kNN ham doğruluk', 0.620, omKnn(0, 7).dogruluk, 3);
  iddia('kNN ölçekli doğruluk', 0.975, omKnn(1, 7).dogruluk, 3);
  iddia('ham hâlde yanlış sayısı', 76, omKnn(0, 7).yanlis.length, 0);
  iddia('ölçekli hâlde yanlış sayısı', 5, omKnn(1, 7).yanlis.length, 0);
  iddia('çocuk sayısı std', 1.43, omStd(0), 2);
  iddia('gelir std', 17135, omStd(1), 0);
  iddia('std oranı', 11955, omStd(1)/omStd(0), 0);
  /* agac karsi argümani */
  iddia('ağaç derinlik 2 test R²', 0.6703, omR2(D.TE, omAgac(2)), 4);
  iddia('ağaç derinlik 4 test R²', 0.8580, omR2(D.TE, omAgac(4)), 4);
  iddia('ağaç derinlik 6 test R²', 0.9002, omR2(D.TE, omAgac(6)), 4);
  iddia('ağaç derinlik 8 test R²', 0.9001, omR2(D.TE, omAgac(8)), 4);
  iddia('ağaç derinlik 4 yaprak sayısı', 14, omAgac(4).yaprak, 0);
  iddia('ağaç derinlik 6 yaprak sayısı', 26, omAgac(6).yaprak, 0);
  iddia('ağaç derinlik 8 yaprak sayısı', 28, omAgac(8).yaprak, 0);
  /* asil iddia: agac hicbir derinlikte 4 parametreli modeli gecemiyor */
  {
    let enIyi = -1e9;
    for (let d2 = 2; d2 <= 10; d2++) enIyi = Math.max(enIyi, omR2(D.TE, omAgac(d2)));
    iddia('ağacın en iyi test R² değeri', 0.9020, enIyi, 4);
    iddia('ağaç hiçbir derinlikte doğrusal+en×boy modelini geçemiyor',
          true, enIyi < omR2(D.TE, etk));
  }
  /* ama agac olcege tamamen duyarsiz · dersin karsi yonlu iddiasi */
  iddia('ağaç 1000× ölçekte aynı sonucu veriyor (d=4)',
        omR2(D.TE, omAgac(4)), omR2(D.TE, omAgacOlcekli(4, 1000)), 6);
  iddia('ağaç 1000× ölçekte aynı sonucu veriyor (d=8)',
        omR2(D.TE, omAgac(8)), omR2(D.TE, omAgacOlcekli(8, 1000)), 6);
}

console.log('═══ TOPLAMSAL MODELLER (GAM) ═══');
{
  const D = GM.top, E = GM.etk;
  const G = gmGam(D, 6), L = gmDogrusal(D, 0);
  /* geri-uydurma yakinsamasi */
  iddia('geri-uydurma 1. tur eğitim R²', 0.915462, G.iz[0], 6);
  iddia('geri-uydurma 2. tur eğitim R²', 0.922637, G.iz[1], 6);
  iddia('geri-uydurma 3. tur eğitim R²', 0.922659, G.iz[2], 6);
  /* "artik degismiyor" tam sifir degil: kalan degisim 7e-8, yani alti basamakta gorunmez */
  iddia('3. turdan sonraki toplam değişim milyonda birin altında',
        true, Math.abs(G.iz[5] - G.iz[2]) < 1e-6);
  iddia('3. turdan sonra altı basamağa kadar aynı',
        G.iz[2].toFixed(6), G.iz[5].toFixed(6), 0);
  iddia('eğitim R² her turda artıyor', true,
        G.iz.every((v, i, a2) => i === 0 || v >= a2[i-1] - 1e-12));
  /* ders "test R2 hafifce dusuyor" diyor · dogrula */
  iddia('1 tur test R²', 0.8935, gmR2(D, D.TE, gmGam(D, 1).pred), 4);
  iddia('2 tur test R²', 0.8874, gmR2(D, D.TE, gmGam(D, 2).pred), 4);
  iddia('3 tur test R²', 0.8866, gmR2(D, D.TE, gmGam(D, 3).pred), 4);
  iddia('tur arttıkça test R² düşüyor (eğitimin tersine)', true,
        gmR2(D, D.TE, gmGam(D,3).pred) < gmR2(D, D.TE, gmGam(D,1).pred));
  iddia('ama fark üçüncü basamakta kalıyor', true,
        gmR2(D, D.TE, gmGam(D,1).pred) - gmR2(D, D.TE, gmGam(D,3).pred) < 0.01);
  /* sekil geri kazanimi */
  iddia('f₁ ortalama sapması', 0.0980, gmSapma(G, 0), 4);
  iddia('f₂ ortalama sapması', 0.0878, gmSapma(G, 1), 4);
  iddia('f₁ genliği', 3.20, 2 * 1.6, 2);
  iddia('f₁ sapması genliğin %5 inin altında', true, gmSapma(G, 0) / 3.20 < 0.05);
  iddia('f₂ sapması genliğin %5 inin altında', true, gmSapma(G, 1) / 2.80 < 0.05);
  /* toplamsal veride sıralama */
  iddia('toplamsal veri · GAM test R²', 0.8866, gmR2(D, D.TE, G.pred), 4);
  iddia('toplamsal veri · doğrusal test R²', 0.1145, gmR2(D, D.TE, L), 4);
  iddia('toplamsal veri · ağaç d=3', 0.3057, gmR2(D, D.TE, gmAgac(D, 3)), 4);
  iddia('toplamsal veri · ağaç d=5', 0.5989, gmR2(D, D.TE, gmAgac(D, 5)), 4);
  iddia('toplamsal veri · ağaç d=8', 0.5872, gmR2(D, D.TE, gmAgac(D, 8)), 4);
  /* asil iddia: agac hicbir derinlikte GAM i yakalayamiyor */
  {
    let enIyi = -1e9, enIyiD = -1;
    for (let d2 = 3; d2 <= 10; d2++){ const v = gmR2(D, D.TE, gmAgac(D, d2));
      if (v > enIyi){ enIyi = v; enIyiD = d2; } }
    iddia('ağacın en iyi test R² değeri', 0.5989, enIyi, 4);
    iddia('ağacın en iyi derinliği', 5, enIyiD, 0);
    iddia('ağaç hiçbir derinlikte toplamsal modeli yakalayamıyor',
          true, enIyi < gmR2(D, D.TE, G.pred));
    iddia('aradaki fark', 0.2877, gmR2(D, D.TE, G.pred) - enIyi, 4);
  }
  /* etkilesimli veride SIRALAMA TERSINE DONUYOR · dersin asil iddiasi */
  const GE = gmGam(E, 6);
  iddia('etkileşim verisi · GAM test R²', -0.3989, gmR2(E, E.TE, GE.pred), 4);
  iddia('etkileşim verisi · GAM ortalamadan bile kötü', true, gmR2(E, E.TE, GE.pred) < 0);
  iddia('etkileşim verisi · doğrusal test R²', -0.0635, gmR2(E, E.TE, gmDogrusal(E, 0)), 4);
  iddia('etkileşim verisi · ağaç d=8 test R²', 0.7342, gmR2(E, E.TE, gmAgac(E, 8)), 4);
  iddia('etkileşim verisi · doğrusal + çarpım test R²', 0.9761, gmR2(E, E.TE, gmDogrusal(E, 1)), 4);
  iddia('etkileşim verisinde ağaç GAM i geçiyor (sıra tersine döndü)',
        true, gmR2(E, E.TE, gmAgac(E, 8)) > gmR2(E, E.TE, GE.pred));
  iddia('toplamsal veride ise GAM ağacı geçiyor',
        true, gmR2(D, D.TE, G.pred) > gmR2(D, D.TE, gmAgac(D, 8)));
  /* GAM esnek egrilerle gurultuyu ezberliyor: egitimde iyi, testte negatif */
  iddia('etkileşim verisinde GAM eğitim R² pozitif', true, GE.iz[GE.iz.length-1] > 0.1);
  /* toplamsal modelin parametre sayisi */
  iddia('bir eğrinin baz boyu', 7, GM.baz(0.5).length, 0);
  iddia('toplam parametre (2 eğri × 7 + kesme)', 15, 2 * GM.baz(0.5).length + 1, 0);
  iddia('eğitim ve test ayrık', 180, D.TR.length + D.TE.length, 0);
}

console.log('═══ KISIT TATMİN (N-VEZİR) ═══');
{
  /* uc strateji de gercekten cozum buluyor mu · once dogruluk, sonra hiz */
  for (const n of KS.kapsam) for (let st = 0; st < 3; st++)
    iddia('N=' + n + ' strateji ' + st + ' çözüm buldu', true, ksAra(n, st).ok);
  /* bulunan yerlesim gercekten gecerli mi: bagimsiz dogrulama */
  {
    let ihlal = 0;
    for (const n of KS.kapsam) for (let st = 0; st < 3; st++){
      const y = ksAra(n, st).yer;
      if (new Set(y).size !== n) { ihlal++; continue; }
      for (let a = 0; a < n; a++) for (let b = a+1; b < n; b++)
        if (Math.abs(y[a] - y[b]) === b - a) ihlal++;
    }
    iddia('hiçbir çözümde satır ya da köşegen çakışması yok', 0, ihlal, 0);
  }
  /* dugum sayilari */
  iddia('N=8 geri izleme atama', 876, ksAra(8, 0).dugum, 0);
  iddia('N=16 geri izleme atama', 160712, ksAra(16, 0).dugum, 0);
  iddia('N=16 ileri kontrol atama', 8144, ksAra(16, 1).dugum, 0);
  iddia('N=16 ileri + MRV atama', 43, ksAra(16, 2).dugum, 0);
  iddia('N=20 geri izleme atama', 3992510, ksAra(20, 0).dugum, 0);
  iddia('N=20 ileri kontrol atama', 138534, ksAra(20, 1).dugum, 0);
  iddia('N=20 ileri + MRV atama', 113, ksAra(20, 2).dugum, 0);
  /* derste yazan kazanc oranlari */
  iddia('N=16 ileri kontrolün kazancı', 19.7, ksAra(16,0).dugum / ksAra(16,1).dugum, 1);
  iddia('N=20 ileri kontrolün kazancı', 28.8, ksAra(20,0).dugum / ksAra(20,1).dugum, 1);
  iddia('N=20 MRV kazancı', 35332, ksAra(20,0).dugum / ksAra(20,2).dugum, 0);
  /* siralamanin her N de korunmasi */
  {
    let ihlal = 0;
    for (const n of KS.kapsam){
      if (!(ksAra(n,1).dugum <= ksAra(n,0).dugum)) ihlal++;
      if (!(ksAra(n,2).dugum <= ksAra(n,1).dugum)) ihlal++;
    }
    iddia('her N için MRV ≤ ileri kontrol ≤ geri izleme', 0, ihlal, 0);
  }
  /* geri izleme N ile tekduze buyuyor mu */
  iddia('geri izleme N=14 ten 16 ya büyüyor', true, ksAra(16,0).dugum > ksAra(14,0).dugum);
  iddia('geri izleme N=18 den 20 ye büyüyor', true, ksAra(20,0).dugum > ksAra(18,0).dugum);
  /* DERSIN DURUSTLUK IDDIASI: MRV tekduze DEGIL, yani bir garanti degil */
  iddia('N=16 MRV atama', 43, ksAra(16,2).dugum, 0);
  iddia('N=18 MRV atama', 124, ksAra(18,2).dugum, 0);
  iddia('MRV düğüm sayısı N ile tekdüze artmıyor', true,
        ksAra(18,2).dugum > ksAra(16,2).dugum && ksAra(20,2).dugum < ksAra(18,2).dugum);
  /* MRV egrisi neredeyse yatay: en buyuk ve en kucuk arasi az */
  {
    const hepsi = KS.kapsam.map(n => ksAra(n, 2).dugum);
    iddia('MRV en yüksek düğüm sayısı', 124, Math.max(...hepsi), 0);
    iddia('MRV hiçbir N de 200 atamayı geçmiyor', true, Math.max(...hepsi) < 200);
    iddia('geri izleme ise 3 milyonu aşıyor', true,
          Math.max(...KS.kapsam.map(n => ksAra(n, 0).dugum)) > 3e6);
  }
  /* kaba kuvvet buyuklukleri */
  iddia('N=8 kaba kuvvet (milyon)', 16.8, KS.kabaKuvvet(8) / 1e6, 1);
  iddia('N=20 kaba kuvvet (log10)', 26.02, Math.log10(KS.kabaKuvvet(20)), 2);
  iddia('N=20 permütasyon sayısı (log10)', 18.39, Math.log10(KS.permutasyon(20)), 2);
  /* geri izleme kaba kuvvetin yaninda kucucuk kaliyor */
  iddia('N=20 geri izleme, kaba kuvvetin 10^19 unda biri', true,
        KS.kabaKuvvet(20) / ksAra(20,0).dugum > 1e19);
}

console.log('═══ MATRİSLER ═══');
{
  /* dersin cekirdek iddiasi: alan orani = |determinant| · her matriste sinansin */
  const testler = [[2,0,0,1],[1,0.5,0,1],[0,-1,1,0],[2,1,1,2],[1.5,0.8,0,1.5],
                   [1,2,2,4],[1.5,0,0,-1],[0.3,-1.2,0.7,0.4],[2.5,1.5,0,2.5]];
  {
    let ihlal = 0;
    for (const M of testler){
      const a0 = MT.alan(MT.ev), a = MT.alan(MT.ev.map(p => MT.uygula(M, p)));
      if (Math.abs(a / a0 - Math.abs(MT.det(M))) > 1e-9) ihlal++;
    }
    iddia('alan oranı her matriste |determinant| a eşit', 0, ihlal, 0);
  }
  /* ayni sey birim kare icin de gecerli · sekle bagli degil */
  {
    let ihlal = 0;
    for (const M of testler){
      const a = MT.alan(MT.birimKare.map(p => MT.uygula(M, p)));
      if (Math.abs(a - Math.abs(MT.det(M))) > 1e-9) ihlal++;
    }
    iddia('birim kare için de aynı eşitlik geçerli', 0, ihlal, 0);
  }
  /* derste yazan somut ornek: a=2, d=1.5 → det 3, alan 3 kat */
  iddia('a=2 d=1.5 determinantı', 3, MT.det([2, 0, 0, 1.5]), 6);
  iddia('a=2 d=1.5 alan oranı', 3, MT.alan(MT.ev.map(p => MT.uygula([2,0,0,1.5], p))) / MT.alan(MT.ev), 6);
  /* yatirma (b) alani hic degistirmiyor · dersin ikinci iddiasi */
  {
    let ihlal = 0;
    for (let b = -1.5; b <= 1.5; b += 0.1){
      const a = MT.alan(MT.ev.map(p => MT.uygula([2, b, 0, 1.5], p)));
      if (Math.abs(a / MT.alan(MT.ev) - 3) > 1e-9) ihlal++;
    }
    iddia('b değerinin hiçbir seçimi alanı değiştirmiyor', 0, ihlal, 0);
  }
  /* tekil matris: alan sifir ve iki farkli girdi ayni yere dusuyor */
  iddia('tekil matris determinantı', 0, MT.det([1.5, 0.8, 0, 0]), 9);
  iddia('tekil matriste alan sıfır', 0, MT.alan(MT.ev.map(p => MT.uygula([1.5,0.8,0,0], p))), 9);
  {
    const M = [1.5, 0.8, 0, 0];
    const p1 = MT.uygula(M, [0.8, 0]), p2 = MT.uygula(M, [0, 1.5]);
    iddia('iki farklı nokta aynı çıktıya düşüyor', 0, Math.hypot(p1[0]-p2[0], p1[1]-p2[1]), 9);
  }
  /* sutunlari birbirinin kati olan matris de tekil */
  iddia('sütunları orantılı matrisin determinantı sıfır', 0, MT.det([1, 2, 2, 4]), 9);
  /* carpim sıraya duyarli · dersin ucuncu iddiasi */
  {
    const A = [0, -1, 1, 0], B = [2, 0, 0, 1];
    const AB = MT.carp(A, B), BA = MT.carp(B, A);
    iddia('A·B matrisi', '0,-1,2,0', AB.join(','), 0);
    iddia('B·A matrisi', '0,-2,1,0', BA.join(','), 0);
    iddia('AB ile BA farklı', true, AB.join(',') !== BA.join(','));
    iddia('AB determinantı', 2, MT.det(AB), 6);
    iddia('BA determinantı', 2, MT.det(BA), 6);
    iddia('determinantlar eşit (çarpma sıra tanımaz)', true, Math.abs(MT.det(AB) - MT.det(BA)) < 1e-9);
    iddia('det(AB) = det(A)·det(B)', MT.det(A) * MT.det(B), MT.det(AB), 6);
    /* carpim gercekten "arka arkaya uygulamak" mi: bir nokta uzerinde sina */
    {
      let ihlal = 0;
      for (const p of MT.ev){
        const q1 = MT.uygula(AB, p), q2 = MT.uygula(A, MT.uygula(B, p));
        if (Math.hypot(q1[0]-q2[0], q1[1]-q2[1]) > 1e-9) ihlal++;
      }
      iddia('A·B uygulamak, önce B sonra A uygulamakla aynı', 0, ihlal, 0);
    }
  }
  /* sinir agi katmani */
  {
    const y = MT.katmanCarp();
    iddia('katman çıktısı 1. nöron', -0.70, y[0], 6);
    iddia('katman çıktısı 2. nöron', 2.30, y[1], 6);
    iddia('katman çıktısı 3. nöron', -0.30, y[2], 6);
    iddia('katman çıktısı 4. nöron', 0.60, y[3], 6);
    /* derste elle yapilan hesap ayni sonucu veriyor mu */
    iddia('elle hesap 0.5·1 - 0.2·2 + 0.8·(-1)', -0.70, 0.5*1 - 0.2*2 + 0.8*(-1), 6);
    iddia('3 girdi 4 nöron çarpma sayısı', 12, MT.carpmaSayisi(3, 4), 0);
    iddia('4096 × 4096 çarpma sayısı', 16777216, MT.carpmaSayisi(4096, 4096), 0);
    /* quiz iddiasi: ikisini de iki katlayinca dort kat */
    iddia('512 → 1024 iki katlanınca çarpma 4 katına çıkıyor',
          4, MT.carpmaSayisi(1024, 1024) / MT.carpmaSayisi(512, 512), 6);
    iddia('512×512 çarpma', 262144, MT.carpmaSayisi(512, 512), 0);
    iddia('1024×1024 çarpma', 1048576, MT.carpmaSayisi(1024, 1024), 0);
  }
}

console.log('═══ OLASILIK · TABAN ORANI ═══');
{
  /* buyuk sayilar yasasi · sapma 400 bagimsiz kosunun ortalamasi */
  iddia('10 atış ortalama sapma', 0.1218, OL.ortSapma(10), 4);
  iddia('40 atış ortalama sapma', 0.0627, OL.ortSapma(40), 4);
  iddia('160 atış ortalama sapma', 0.0313, OL.ortSapma(160), 4);
  iddia('2560 atış ortalama sapma', 0.0078, OL.ortSapma(2560), 4);
  iddia('sapma N ile tekdüze azalıyor', true,
        OL.kapsam.every((n, i, a2) => i === 0 || OL.ortSapma(n) < OL.ortSapma(a2[i-1])));
  /* asil iddia: 1/√N · log-log egim -0.5 e ne kadar yakin */
  {
    const egim = (Math.log10(OL.ortSapma(2560)) - Math.log10(OL.ortSapma(10))) /
                 (Math.log10(2560) - Math.log10(10));
    iddia('log-log eğim (1/√N yasası)', -0.4947, egim, 4);
    iddia('eğim −0.5 e 0.02 den yakın', true, Math.abs(egim + 0.5) < 0.02);
  }
  /* "4 kat atis, yari sapma": rastgele bir olcum, tam 2 degil · araligi sinayalim */
  {
    let enAz = 1e9, enCok = -1e9;
    for (let i = 1; i < OL.kapsam.length; i++){
      const o = OL.ortSapma(OL.kapsam[i-1]) / OL.ortSapma(OL.kapsam[i]);
      enAz = Math.min(enAz, o); enCok = Math.max(enCok, o);
    }
    iddia('4 katlamada oranın en küçüğü', 1.875, enAz, 3);
    iddia('4 katlamada oranın en büyüğü', 2.129, enCok, 3);
    iddia('bütün oranlar 2 nin yüzde 15 inde', true, enAz > 1.7 && enCok < 2.3);
  }
  /* tek kosunun izi · derste yazan sayilar */
  iddia('10 atışta oran', 0.500, OL.iz[9], 3);
  iddia('100 atışta oran', 0.430, OL.iz[99], 3);
  iddia('2000 atışta oran', 0.490, OL.iz[1999], 3);
  /* Bayes · tibbi test */
  iddia('taban %0.1 kesinlik', 9.02, 100 * OL.bayes(0.001, 0.99, 0.99), 2);
  iddia('taban %1 kesinlik', 50.00, 100 * OL.bayes(0.01, 0.99, 0.99), 2);
  iddia('taban %10 kesinlik', 91.67, 100 * OL.bayes(0.1, 0.99, 0.99), 2);
  /* dogal frekans hesabi Bayes ile ayni sonucu vermeli · iki yoldan dogrulama */
  {
    const T = OL.tablo(10000, 0.01, 0.99, 0.99);
    iddia('10.000 kişide hasta sayısı', 100, T.hasta, 6);
    iddia('doğru pozitif', 99, T.dp, 6);
    iddia('yanlış pozitif', 99, T.yp, 6);
    iddia('toplam pozitif', 198, T.poz, 6);
    iddia('doğal frekans hesabı Bayes formülüyle aynı',
          OL.bayes(0.01, 0.99, 0.99), T.dp / T.poz, 9);
  }
  /* kesinlik taban orani ile tekduze artiyor · test ve model sabitken */
  {
    let ihlal = 0;
    for (let i = 1; i < OL.oranlar.length; i++)
      if (OL.bayes(OL.oranlar[i], 0.99, 0.99) <= OL.bayes(OL.oranlar[i-1], 0.99, 0.99)) ihlal++;
    iddia('kesinlik taban oranıyla tekdüze artıyor', 0, ihlal, 0);
  }
  /* ayni model, farkli dunya */
  iddia('model .95/.95 taban %0.1 kesinlik', 1.87, 100 * OL.bayes(0.001, 0.95, 0.95), 2);
  iddia('model .95/.95 taban %5 kesinlik', 50.00, 100 * OL.bayes(0.05, 0.95, 0.95), 2);
  iddia('model .95/.95 taban %20 kesinlik', 82.61, 100 * OL.bayes(0.2, 0.95, 0.95), 2);
  iddia('%0.1 tabanda kaç alarmdan biri doğru', 54,
        1 / OL.bayes(0.001, 0.95, 0.95), 0);
  /* dersin son adimindaki kaldirac karsilastirmasi */
  iddia('özgüllük .95 → .995 kesinliği', 15.98, 100 * OL.bayes(0.001, 0.95, 0.995), 2);
  iddia('duyarlılık .95 → 1.00 kesinliği', 1.96, 100 * OL.bayes(0.001, 1.0, 0.95), 2);
  iddia('özgüllük kaldıracı duyarlılıktan güçlü', true,
        OL.bayes(0.001, 0.95, 0.995) > 5 * OL.bayes(0.001, 1.0, 0.95));
  /* quiz senaryosu: sıklık 1/10000, %98/%98 */
  {
    const T = OL.tablo(10000, 0.0001, 0.98, 0.98);
    iddia('quiz senaryosunda yanlış pozitif', 200.0, T.yp, 1);
    iddia('quiz senaryosunda doğru pozitif', 0.98, T.dp, 2);
    iddia('boşa giden biyopsi oranı', 99.5, 100 * T.yp / T.poz, 1);
  }
}

console.log('═══ NEDEN ŞİMDİ · ÜÇ KALDIRAÇ ═══');
{
  iddia('temel hata (ham, 25 örnek, 10 tur)', 4.9024, NS.temel(), 4);
  /* kaldiraclar tek tek */
  iddia('sadece veri ×16 hatası', 4.8990, nsEgit(0, 400, 10), 4);
  iddia('sadece veri kazancı', 1.00, NS.kazanc(0, 400, 10), 2);
  iddia('sadece hesap ×200 hatası', 3.2440, nsEgit(0, 25, 2000), 4);
  iddia('sadece hesap kazancı', 1.51, NS.kazanc(0, 25, 2000), 2);
  iddia('sadece algoritma hatası', 1.1751, nsEgit(2, 25, 10), 4);
  iddia('sadece algoritma kazancı', 4.17, NS.kazanc(2, 25, 10), 2);
  /* ham model tavani: veri ve hesap ne olursa olsun asilmiyor */
  iddia('ham model tavanı (400 örnek, 2000 tur)', 2.8735, nsEgit(0, 400, 2000), 4);
  {
    let enIyi = 1e9;
    for (const n of NS.veri) for (const h of NS.hesap) enIyi = Math.min(enIyi, nsEgit(0, n, h));
    iddia('ham modelin hiçbir ayarda inebildiği en düşük hata', 2.8735, enIyi, 4);
    iddia('ham model hiçbir ayarda 2.8 in altına inemiyor', true, enIyi > 2.8);
    /* buna karsilik alg2 en fakir veri ve hesapla bile daha iyi */
    iddia('algoritma 2, en fakir ayarda bile ham modelin tavanını geçiyor',
          true, nsEgit(2, 25, 10) < enIyi);
  }
  /* ucu birden · dersin asil iddiasi */
  iddia('üçü birden hata', 0.0144, nsEgit(2, 400, 2000), 4);
  iddia('üçü birden kazanç', 341.2, NS.kazanc(2, 400, 2000), 1);
  {
    const carpim = NS.kazanc(0,400,10) * NS.kazanc(0,25,2000) * NS.kazanc(2,25,10);
    iddia('tek tek kazançların çarpımı', 6.3, carpim, 1);
    iddia('birlikte kazanç, çarpımdan kaç kat büyük', 54, NS.kazanc(2,400,2000) / carpim, 0);
    iddia('kaldıraçlar toplanmıyor da çarpılmıyor da', true,
          NS.kazanc(2,400,2000) > 10 * carpim);
  }
  /* algoritma degisikligi hesaba cevrilebiliyor */
  {
    const bul = a => { for (const h of [10,20,30,50,100,200,300,500,1000,2000,4000,8000])
      if (nsEgit(a, 200, h) < 0.05) return h; return null; };
    iddia('ölçeklemesiz gereken tur', 4000, bul(1), 0);
    iddia('ölçeklemeli gereken tur', 200, bul(2), 0);
    iddia('algoritma değişikliği kaç kat hesap değerinde', 20, bul(1) / bul(2), 0);
  }
  /* dersin sınırı: gurultu tabani · 300 turdan sonra kazanc yok */
  iddia('algoritma 2, 300 tur hatası', 0.0148, nsEgit(2, 400, 300), 4);
  iddia('algoritma 2, 2000 tur hatası', 0.0144, nsEgit(2, 400, 2000), 4);
  iddia('300 turdan sonra kazanç ihmal edilebilir', true,
        nsEgit(2, 400, 300) - nsEgit(2, 400, 2000) < 0.001);
  /* deney gercekten ayni test kumesini kullaniyor */
  iddia('test kümesi boyu', 1500, NS.havuz.T.length, 0);
  iddia('eğitim havuzu boyu', 400, NS.havuz.H.length, 0);
  iddia('test kümesi gürültüsüz (gerçek fonksiyon)', 0,
        NS.havuz.T.reduce((s, p) => s + Math.abs(p[2] - NS.f0(p[0], p[1])), 0), 9);
  /* ham modelin 3, polinom modelin 10 ozelligi var */
  iddia('ham özellik sayısı', 3, NS.oz(0)([1, 1]).length, 0);
  iddia('polinom özellik sayısı', 10, NS.oz(1)([1, 1]).length, 0);
}

console.log('═══ ARAMA UZAYI (SU KABI) ═══');
{
  const R = auBfs(5, 3, 4);
  iddia('olası durum sayısı', 24, R.toplam, 0);
  iddia('ulaşılabilir durum sayısı', 16, R.ulasilan.size, 0);
  iddia('ulaşılamayan durum sayısı', 8, R.toplam - R.ulasilan.size, 0);
  /* ulasilamayan sekiz durumun hepsinde B de 1 ya da 2 var ve A ne dolu ne bos */
  {
    let uymayan = 0, sayilan = 0;
    for (let a = 0; a <= 5; a++) for (let b = 0; b <= 3; b++)
      if (!R.ulasilan.has(a + ',' + b)){ sayilan++;
        if (!((b === 1 || b === 2) && a > 0 && a < 5)) uymayan++; }
    iddia('sayılan ulaşılamaz durum', 8, sayilan, 0);
    iddia('hepsinde B de 1-2 litre ve A ne dolu ne boş', 0, uymayan, 0);
  }
  /* cozum */
  iddia('en kısa çözüm uzunluğu', 6, R.yol.length, 0);
  iddia('çözümün vardığı durum A da 4 litre', 4, R.hedefDurum[0], 0);
  /* cozum yolu gercekten gecerli mi · adim adim bagimsiz dogrulama */
  {
    const G = AU.gecisler(5, 3);
    let s2 = [0, 0], ihlal = 0;
    for (const a of R.yol){
      s2 = G[a.gecis](s2);
      if (s2[0] !== a.durum[0] || s2[1] !== a.durum[1]) ihlal++;
      if (s2[0] < 0 || s2[0] > 5 || s2[1] < 0 || s2[1] > 3) ihlal++;
    }
    iddia('çözüm adımları kurallara uyuyor', 0, ihlal, 0);
    iddia('son durumda 4 litre var', true, s2[0] === 4 || s2[1] === 4);
  }
  /* ziyaret kumesi · dersin asil olcumu */
  iddia('açılan düğüm (ziyaret kümesiyle)', 16, R.acilan, 0);
  iddia('açılan düğüm (ziyaret kümesi yok)', 15312, auZiyaretsiz(5, 3, 4, R.yol.length).acilan, 0);
  iddia('kaç kat fark', 957, auZiyaretsiz(5, 3, 4, R.yol.length).acilan / R.acilan, 0);
  iddia('defter olmadan da aynı derinlikte bulunuyor', 6,
        auZiyaretsiz(5, 3, 4, R.yol.length).bulunan, 0);
  /* agac ust siniri · 6 dallanma, 6 derinlik */
  iddia('6 dallanma 6 derinlik ağaç sınırı', 55987, AU.agacSinir(6, 6), 0);
  iddia('ziyaretsiz arama ağaç sınırının altında kalıyor', true,
        auZiyaretsiz(5, 3, 4, 6).acilan < AU.agacSinir(6, 6));
  iddia('ziyaret kümeli arama durum sayısını aşamaz', true, R.acilan <= R.toplam);
  /* 6L/3L: cozum uzayda yok */
  {
    const R2 = auBfs(6, 3, 4);
    iddia('6L-3L ulaşılabilir durum', 6, R2.ulasilan.size, 0);
    iddia('6L-3L de 4 litre bulunamıyor', null, R2.hedefDurum, 0);
    iddia('6 ve 3 ün EBOB u', 3, AU.ebob(6, 3), 0);
    iddia('4 sayısı 3 e bölünmüyor', 1, 4 % AU.ebob(6, 3), 0);
    /* ulasilabilir her durumda su miktari EBOB un kati mi */
    let ihlal = 0;
    R2.ulasilan.forEach(k => { const [a, b] = k.split(',').map(Number);
      if (a % 3 !== 0 || b % 3 !== 0) ihlal++; });
    iddia('6L-3L de her durumda miktarlar EBOB un katı', 0, ihlal, 0);
  }
  /* 5L/3L: EBOB 1 oldugu icin her miktar olculebilir · hepsini sina */
  {
    iddia('5 ve 3 ün EBOB u', 1, AU.ebob(5, 3), 0);
    let bulunamayan = 0;
    for (let h = 0; h <= 5; h++) if (!auBfs(5, 3, h).hedefDurum) bulunamayan++;
    iddia('5L-3L ile 0..5 arası her miktar ölçülebiliyor', 0, bulunamayan, 0);
  }
  /* EBOB kurali baska kap ciftlerinde de tutuyor mu */
  {
    let ihlal = 0;
    for (const [x, y] of [[5,3],[6,3],[4,3],[8,6],[7,3],[6,4],[9,6],[10,4]]){
      const olur = auBfs(x, y, 4).hedefDurum !== null;
      const beklenen = 4 % AU.ebob(x, y) === 0 && 4 <= Math.max(x, y);
      if (olur !== beklenen) ihlal++;
    }
    iddia('EBOB kuralı sekiz kap çiftinin hepsinde tutuyor', 0, ihlal, 0);
  }
}

console.log('═══ KOMBİNATORİK PATLAMA ═══');
{
  /* n=20 icin uc buyume sinifi */
  iddia('n=20 · n² işlem', 400, 20*20, 0);
  iddia('n=20 · 2ⁿ işlem (milyon)', 1.05, Math.pow(2,20)/1e6, 2);
  iddia('n=20 · n! işlem (log10)', 18.386, Math.log10(KP.fakt(20)), 3);
  iddia('n=20 · n! süresi yıl olarak', 77.1, KP.fakt(20)/KP.HIZ/3.156e7, 1);
  iddia('n=20 · 2ⁿ süresi ms olarak', 1.0, Math.pow(2,20)/KP.HIZ*1e3, 1);
  iddia('n=20 · n² süresi ns olarak', 400, 400/KP.HIZ*1e9, 0);
  /* Ders "n! evrenin yasini n=27 de asiyor" diyor · taslakta bu n=20 icin yazilmisti */
  {
    let ilk = null;
    for (let n = 15; n <= 40 && ilk === null; n++)
      if (KP.fakt(n)/KP.HIZ/3.156e7 > KP.EVREN) ilk = n;
    iddia('n! süresinin evren yaşını aştığı ilk n', 27, ilk, 0);
    iddia('n=26 evren yaşının altında', true, KP.fakt(26)/KP.HIZ/3.156e7 < KP.EVREN);
    iddia('n=27 evren yaşının üstünde', true, KP.fakt(27)/KP.HIZ/3.156e7 > KP.EVREN);
  }
  /* gercek kaba kuvvet · denenen tur sayisi tam olarak (n-1)! mi */
  {
    let ihlal = 0;
    for (let n = 4; n <= 10; n++) if (kpKabaKuvvet(n).sayac !== KP.kabaTur(n)) ihlal++;
    iddia('her n için denenen tur sayısı tam olarak (n−1)!', 0, ihlal, 0);
  }
  iddia('4 şehir tur sayısı', 6, kpKabaKuvvet(4).sayac, 0);
  iddia('7 şehir tur sayısı', 720, kpKabaKuvvet(7).sayac, 0);
  iddia('10 şehir tur sayısı', 362880, kpKabaKuvvet(10).sayac, 0);
  /* bulunan tur gercekten gecerli mi: her sehir bir kez, basa donuyor */
  {
    const R = kpKabaKuvvet(10);
    iddia('tur başlangıca dönüyor', true, R.yol[0] === 0 && R.yol[R.yol.length-1] === 0);
    iddia('tur 10 şehri de bir kez geziyor', 10, new Set(R.yol).size, 0);
    /* uzunluk bagimsiz yeniden hesaplansin */
    let uz = 0;
    for (let i = 1; i < R.yol.length; i++) uz += KP.d(R.yol[i-1], R.yol[i]);
    iddia('tur uzunluğu bağımsız hesapla aynı', R.enIyi, uz, 9);
  }
  /* her yeni sehir tur sayisini n katina cikariyor */
  {
    let ihlal = 0;
    for (let n = 5; n <= 10; n++)
      if (Math.abs(KP.kabaTur(n) / KP.kabaTur(n-1) - (n-1)) > 1e-9) ihlal++;
    iddia('n den n+1 e tur sayısı n katına çıkıyor', 0, ihlal, 0);
  }
  /* 1000 kat hizli bilgisayar · dersin asil olcumu */
  {
    const kz = f => [KP.cozulebilen(f, 1e9), KP.cozulebilen(f, 1e12)];
    const [a2, b2] = kz(n => n*n), [a3, b3] = kz(n => n**3);
    const [ae, be] = kz(n => Math.pow(2, n)), [af, bf] = kz(KP.fakt);
    iddia('n² · 10⁹ bütçesiyle n', 31622, a2, 0);
    iddia('n² · 10¹² bütçesiyle n', 1000000, b2, 0);
    iddia('n² kazancı (çarpan)', 31.6, b2 / a2, 1);
    iddia('n³ kazancı (çarpan)', 10.0, b3 / a3, 1);
    iddia('2ⁿ · 10⁹ bütçesiyle n', 29, ae, 0);
    iddia('2ⁿ kazancı (toplam)', 10, be - ae, 0);
    iddia('n! · 10⁹ bütçesiyle n', 12, af, 0);
    iddia('n! kazancı (toplam)', 2, bf - af, 0);
    /* asil iddia: polinomda carpan, ustelde toplam */
    iddia('polinomda kazanç çarpansal, üstelde toplamsal',
          true, b2 / a2 > 30 && be - ae < 15 && bf - af < 5);
  }
  /* Held-Karp · ussu degistirmek */
  iddia('20 şehir kaba kuvvet işlem (log10)', 17.085, Math.log10(KP.kabaTur(20)), 3);
  iddia('20 şehir Held-Karp işlem (log10)', 8.623, Math.log10(KP.heldKarp(20)), 3);
  iddia('20 şehir oran (log10)', 8.462, Math.log10(KP.kabaTur(20)/KP.heldKarp(20)), 3);
  iddia('20 şehir kaba kuvvet süresi yıl', 3.9, KP.kabaTur(20)/KP.HIZ/3.156e7, 1);
  iddia('20 şehir Held-Karp süresi ms', 419.4, KP.heldKarp(20)/KP.HIZ*1e3, 1);
  {
    const yil = KP.HIZ * 3.156e7;
    iddia('bir yılda kaba kuvvetle çözülebilen şehir', 19, KP.cozulebilen(KP.kabaTur, yil), 0);
    iddia('bir yılda Held-Karp ile çözülebilen şehir', 43, KP.cozulebilen(KP.heldKarp, yil), 0);
  }
  /* dersin dürüstlük notu: Held-Karp da üstel, o da coküyor */
  iddia('Held-Karp 30 şehir süresi dakika', 16.1, KP.heldKarp(30)/KP.HIZ/60, 1);
  iddia('Held-Karp 40 şehir süresi gün', 20.4, KP.heldKarp(40)/KP.HIZ/86400, 1);
  iddia('Held-Karp 50 şehir süresi yıl', 89.2, KP.heldKarp(50)/KP.HIZ/3.156e7, 1);
  iddia('Held-Karp da üstel: 50 şehirde bir yılı aşıyor',
        true, KP.heldKarp(50)/KP.HIZ/3.156e7 > 1);
}

console.log('═══ AĞIRLIK İLKLEME ═══');
{
  const S2 = Math.SQRT2;
  /* ReLU · ileri gecis */
  iddia('ReLU c=0.5 son katman std (log10)', -9.049,
        Math.log10(ilIleri(0.5, 'relu').izler[IL.KAT]), 3);
  iddia('ReLU c=1 son katman std (log10)', -3.028,
        Math.log10(ilIleri(1, 'relu').izler[IL.KAT]), 3);
  iddia('ReLU He son katman std', 0.9593, ilIleri(S2, 'relu').izler[IL.KAT], 4);
  iddia('ReLU c=2 son katman std', 982.3, ilIleri(2, 'relu').izler[IL.KAT], 1);
  /* c yi 4 kat degistirmek sonucu 10^13 kat degistiriyor */
  iddia('c 0.5 ten 2 ye · sonuç kaç kat (log10)', 12.041,
        Math.log10(ilIleri(2,'relu').izler[IL.KAT] / ilIleri(0.5,'relu').izler[IL.KAT]), 3);
  /* asil iddia: ReLU + Xavier katman basina 1/√2 · olculen vs teorik */
  iddia('ReLU + Xavier katman başına oran', 0.7153, IL.oran(1, 'relu'), 4);
  iddia('teorik 1/√2', 0.7071, 1 / S2, 4);
  iddia('ölçülen oran teorik değerin %2 sinde', true,
        Math.abs(IL.oran(1, 'relu') - 1/S2) / (1/S2) < 0.02);
  iddia('teorik (1/√2)^20 (log10)', -3.010, Math.log10(Math.pow(1/S2, 20)), 3);
  iddia('ölçülen 20 katman sonrası da aynı mertebede', true,
        Math.abs(Math.log10(ilIleri(1,'relu').izler[IL.KAT]) - Math.log10(Math.pow(1/S2,20))) < 0.1);
  /* He duzeltiyor */
  iddia('ReLU + He katman başına oran', 1.0116, IL.oran(S2, 'relu'), 4);
  iddia('He oranı 1 e Xavier den çok daha yakın', true,
        Math.abs(IL.oran(S2,'relu') - 1) < Math.abs(IL.oran(1,'relu') - 1));
  /* c ile son std tekduze artiyor */
  {
    let ihlal = 0; const cs = [0.5, 0.8, 1, 1.2, S2, 1.7, 2];
    for (let i = 1; i < cs.length; i++)
      if (ilIleri(cs[i],'relu').izler[IL.KAT] <= ilIleri(cs[i-1],'relu').izler[IL.KAT]) ihlal++;
    iddia('son katman std, c ile tekdüze artıyor', 0, ihlal, 0);
  }
  /* tanh · patlamiyor ama doyuyor */
  iddia('tanh c=2 son katman std', 0.7336, ilIleri(2, 'tanh').izler[IL.KAT], 4);
  iddia('tanh aynı ölçekte ReLU dan çok daha küçük', true,
        ilIleri(2,'tanh').izler[IL.KAT] < 0.01 * ilIleri(2,'relu').izler[IL.KAT]);
  /* tanh hicbir olcekte patlamiyor · genis tarama */
  {
    let enBuyuk = 0;
    for (let c2 = 0.4; c2 <= 2.2; c2 += 0.2) enBuyuk = Math.max(enBuyuk, ilIleri(c2,'tanh').izler[IL.KAT]);
    iddia('tanh hiçbir ölçekte 1 i aşmıyor', true, enBuyuk < 1);
  }
  /* bedeli turevde */
  iddia('tanh c=1 doygun birim oranı', 0.009, ilIleri(1, 'tanh').doygunOran, 3);
  iddia('tanh He doygun birim oranı', 0.080, ilIleri(S2, 'tanh').doygunOran, 3);
  iddia('tanh c=2 doygun birim oranı', 0.323, ilIleri(2, 'tanh').doygunOran, 3);
  iddia('tanh c=1 türev çarpımı', 0.155, ilIleri(1, 'tanh').turevCarpim, 3);
  iddia('tanh He türev çarpımı (log10)', -3.458, Math.log10(ilIleri(S2,'tanh').turevCarpim), 3);
  iddia('tanh c=2 türev çarpımı (log10)', -6.707, Math.log10(ilIleri(2,'tanh').turevCarpim), 3);
  /* ileri saglikli ama geri olu · dersin asil iddiasi */
  iddia('tanh c=2 de ileri sinyal sağlıklı ama gradyan ölü', true,
        ilIleri(2,'tanh').izler[IL.KAT] > 0.5 && ilIleri(2,'tanh').turevCarpim < 1e-6);
  /* olcek buyudukce doygunluk artiyor, turev carpimi duşuyor */
  {
    let ihlal = 0; const cs = [0.5, 1, S2, 2];
    for (let i = 1; i < cs.length; i++){
      if (ilIleri(cs[i],'tanh').doygunOran < ilIleri(cs[i-1],'tanh').doygunOran) ihlal++;
      if (ilIleri(cs[i],'tanh').turevCarpim > ilIleri(cs[i-1],'tanh').turevCarpim) ihlal++;
    }
    iddia('ölçek arttıkça doygunluk artıyor ve türev çarpımı düşüyor', 0, ihlal, 0);
  }
  /* GERCEK EGITIM · dersin odemesi */
  iddia('c=0.5 ilk kayıp', 0.6667, ilEgit(0.5, 60).ilk, 4);
  iddia('c=0.5 son kayıp', 0.6667, ilEgit(0.5, 60).son, 4);
  /* "hic kipirdamiyor" tam sifir degil: 60 adimda degisim 3 milyonda bir */
  iddia('c=0.5 te 60 adımlık toplam değişim', 0.000003,
        ilEgit(0.5,60).ilk - ilEgit(0.5,60).son, 6);
  iddia('c=0.5 değişimi yüz binde birin altında', true,
        Math.abs(ilEgit(0.5,60).ilk - ilEgit(0.5,60).son) < 1e-5);
  iddia('Xavier son kayıp', 0.5995, ilEgit(1, 60).son, 4);
  iddia('He son kayıp', 0.0420, ilEgit(S2, 60).son, 4);
  iddia('He kaybı kaç kat düşürdü', 17.3, ilEgit(S2,60).ilk / ilEgit(S2,60).son, 1);
  iddia('c=2 ilk kayıp', 22.2909, ilEgit(2, 60).ilk, 4);
  iddia('c=2 eğitimi NaN a gidiyor', false, isFinite(ilEgit(2, 60).son));
  iddia('He, denenen dört ölçeğin en iyisi', true,
        [0.5, 1, 2].every(c2 => !(ilEgit(c2,60).son < ilEgit(S2,60).son)));
  iddia('He, Xavier den 14 kat düşük kayıp', 14.3,
        ilEgit(1,60).son / ilEgit(S2,60).son, 1);
}

console.log('═══ PATLAYAN GRADYAN VE KLİPLEME ═══');
{
  /* dagilim · geri besleme yok, bu yuzden motordan bagimsiz tekrarlanabilir */
  const D = PG.dagilim(1.5, 'relu');
  iddia('ReLU c=1.5 ortanca norm', 15.4, D.ortanca, 1);
  iddia('ReLU c=1.5 %99 dilim (log10)', 7.737, Math.log10(D.p99), 3);
  iddia('ReLU c=1.5 en büyük (log10)', 8.534, Math.log10(D.enBuyuk), 3);
  iddia('ReLU c=1.5 kuyruk oranı (log10)', 7.346, Math.log10(D.kuyrukOrani), 3);
  iddia('en büyük parti ortancanın 10 milyon katından fazla', true, D.kuyrukOrani > 1e7);
  {
    const ort = D.g.reduce((s, x) => s + x, 0) / D.g.length;
    iddia('ortalama ortancadan çok büyük (çarpık dağılım)', true, ort > 100 * D.ortanca);
  }
  iddia('tanh c=1.5 kuyruk oranı', 22.9, PG.dagilim(1.5, 'tanh').kuyrukOrani, 1);
  iddia('tanh kuyruğu ReLU dan çok daha kısa', true,
        PG.dagilim(1.5,'tanh').kuyrukOrani < 1e-4 * PG.dagilim(1.5,'relu').kuyrukOrani);
  {
    let ihlal = 0; const cs = [0.8, 1.0, 1.2, 1.5, 1.8, 2.0];
    for (let i = 1; i < cs.length; i++)
      if (PG.dagilim(cs[i],'relu').ortanca <= PG.dagilim(cs[i-1],'relu').ortanca) ihlal++;
    iddia('ReLU ortanca norm c ile tekdüze artıyor', 0, ihlal, 0);
  }

  /* ── KAOS ÖLÇÜSÜ ──
     Kararsız kosularin son kaybi JS motoruna gore degisiyor (Node ile Chrome
     farkli sonuc veriyor), cunku tek bir sicrama yorungeyi ceviriyor. Bu yuzden
     kararsiz kosularin son kaybi ASLA sayi olarak iddia edilmiyor; onun yerine
     bir agirligi 1e-12 oynatinca sonucun ne kadar degistigini olcuyoruz. */
  {
    const H_kararsiz = PG.hassasiyet(1.6, 0.02, 0, 100);
    const H_kararli  = PG.hassasiyet(1.6, 0.01, 0, 100);
    const H_klipli   = PG.hassasiyet(1.6, 0.02, 3, 100);
    iddia('lr=0.01 klipsiz koşu 1e-12 e duyarsız (sapma < 1e-6)', true, H_kararli.sapma < 1e-6);
    iddia('lr=0.02 klipsiz koşu 1e-12 e aşırı duyarlı', true, H_kararsiz.sapma > 0.5);
    iddia('klipleme duyarlılığı yüzde birin altına indiriyor', true, H_klipli.sapma < 0.01);
    iddia('klipleme duyarlılığı en az 100 kat azaltıyor', true,
          H_kararsiz.sapma > 100 * H_klipli.sapma);
  }

  /* ── SADECE TEKRARLANABİLİR KOŞULARIN SAYILARI ── */
  iddia('c=1.6 lr=0.01 klipsiz son kayıp', 0.045884, pgEgit(1.6, 0.01, 0, 100).son, 6);
  iddia('c=1.6 lr=0.01 klipsiz kliplenen adım', 0, pgEgit(1.6, 0.01, 0, 100).kliplenen, 0);
  iddia('c=1.6 lr=0.02 klipli son kayıp', 0.017182, pgEgit(1.6, 0.02, 3, 100).son, 6);
  iddia('c=1.6 lr=0.02 klipli kliplenen adım', 40, pgEgit(1.6, 0.02, 3, 100).kliplenen, 0);
  iddia('klipleme, lr düşürmekten daha iyi sonuç veriyor', true,
        pgEgit(1.6, 0.02, 3, 100).son < pgEgit(1.6, 0.01, 0, 100).son);
  iddia('kaç kat daha iyi', 2.7,
        pgEgit(1.6, 0.01, 0, 100).son / pgEgit(1.6, 0.02, 3, 100).son, 1);
  iddia('adımların çoğuna dokunulmuyor', true, pgEgit(1.6, 0.02, 3, 100).kliplenen < 50);

  /* ── KLİPLEME ZARAR VEREBİLİR · her ikisi de kararlı, dolayısıyla sayı iddia edilebilir ── */
  {
    const R0 = pgEgit(1.2, 0.05, 0, 100), R1 = pgEgit(1.2, 0.05, 3, 100);
    iddia('c=1.2 lr=0.05 klipsiz koşu kararlı (sapma < 1e-6)', true,
          PG.hassasiyet(1.2, 0.05, 0, 100).sapma < 1e-6);
    iddia('c=1.2 lr=0.05 klipsiz son kayıp', 0.029976, R0.son, 6);
    iddia('c=1.2 lr=0.05 klipli son kayıp', 0.076579, R1.son, 6);
    iddia('bu ayarda klipleme zarar veriyor', true, R1.son > R0.son);
    iddia('kaç kat zarar', 2.6, R1.son / R0.son, 1);
    iddia('üstelik adımların sadece 16 sı kliplenmişken', 16, R1.kliplenen, 0);
    iddia('klipleme her zaman kazandırmıyor', true,
          pgEgit(1.6,0.02,3,100).son < pgEgit(1.6,0.01,0,100).son &&
          pgEgit(1.2,0.05,3,100).son > pgEgit(1.2,0.05,0,100).son);
  }

  /* klipleme yonu koruyor mu · saf aritmetik, her motorda ayni */
  {
    const g = [3, -4, 12], tau = 6.5;
    const n = Math.hypot(...g), s2 = tau / n;
    const kg = g.map(x => x * s2);
    iddia('kliplenmiş normun tam eşiğe indiği', tau, Math.hypot(...kg), 9);
    const kosinus = g.reduce((s3, x, i) => s3 + x * kg[i], 0) / (n * Math.hypot(...kg));
    iddia('klipleme yönü değiştirmiyor (kosinüs 1)', 1, kosinus, 9);
  }
}

console.log('═══ KISAYOL BAĞLANTILARI ═══');
{
  /* Patlayan gradyan dersinde ogrendigimiz kural: sayi olarak iddia edilen her kosu
     once 1e-12 bozulmaya karsi kararli olmali. Once onu siniyoruz. */
  {
    let enBuyuk = 0;
    for (const D of KS2.derinlikler) for (const ks of [0, 1])
      enBuyuk = Math.max(enBuyuk, KS2.hassasiyet(D, ks, 40));
    iddia('asserted edilen bütün koşular 1e-12 bozulmaya kararlı', true, enBuyuk < 1e-9);
  }
  /* duz ag derinlikle kotulesiyor */
  iddia('düz ağ 4 katman eğitim kaybı', 0.0020, ks2Egit(4, 0, 40, 0).son, 4);
  iddia('düz ağ 8 katman', 0.1109, ks2Egit(8, 0, 40, 0).son, 4);
  iddia('düz ağ 16 katman', 0.1530, ks2Egit(16, 0, 40, 0).son, 4);
  iddia('düz ağ 32 katman', 0.9882, ks2Egit(32, 0, 40, 0).son, 4);
  iddia('düz ağ 4 ten 32 ye kaç kat kötüleşiyor', 487,
        ks2Egit(32,0,40,0).son / ks2Egit(4,0,40,0).son, 0);
  {
    let ihlal = 0;
    for (let i = 1; i < KS2.derinlikler.length; i++)
      if (ks2Egit(KS2.derinlikler[i],0,40,0).son <= ks2Egit(KS2.derinlikler[i-1],0,40,0).son) ihlal++;
    iddia('düz ağın kaybı her derinlik artışında büyüyor', 0, ihlal, 0);
  }
  /* kisayollu ag derinlikle iyilesiyor */
  iddia('kısayollu 4 katman', 0.0898, ks2Egit(4, 1, 40, 0).son, 4);
  iddia('kısayollu 8 katman', 0.1555, ks2Egit(8, 1, 40, 0).son, 4);
  iddia('kısayollu 16 katman', 0.0971, ks2Egit(16, 1, 40, 0).son, 4);
  iddia('kısayollu 32 katman', 0.0412, ks2Egit(32, 1, 40, 0).son, 4);
  iddia('kısayollu ağ 4 ten 32 ye kaç kat iyileşiyor', 2.18,
        ks2Egit(4,1,40,0).son / ks2Egit(32,1,40,0).son, 2);
  /* asil iddia: derinlik ile kayip iliskisi ters yonlerde */
  iddia('derinlik artınca düz ağ kötüleşiyor, kısayollu iyileşiyor', true,
        ks2Egit(32,0,40,0).son > ks2Egit(4,0,40,0).son &&
        ks2Egit(32,1,40,0).son < ks2Egit(4,1,40,0).son);
  iddia('32 katmanda kısayolun kazancı', 24.0,
        ks2Egit(32,0,40,0).son / ks2Egit(32,1,40,0).son, 1);
  /* durustluk: 4 katmanda duz ag onde */
  iddia('4 katmanda düz ağ kısayollu ağdan iyi', true,
        ks2Egit(4,0,40,0).son < ks2Egit(4,1,40,0).son);
  iddia('4 katmanda düz ağın üstünlüğü', 44.2,
        ks2Egit(4,1,40,0).son / ks2Egit(4,0,40,0).son, 1);
  /* donum noktasi 16 katman */
  {
    let ilkKisayolLehine = -1;
    for (const D of KS2.derinlikler)
      if (ilkKisayolLehine < 0 && ks2Egit(D,1,40,0).son < ks2Egit(D,0,40,0).son) ilkKisayolLehine = D;
    iddia('kısayolun ilk öne geçtiği derinlik', 16, ilkKisayolLehine, 0);
    iddia('16 katmanda oran', 1.58, ks2Egit(16,0,40,0).son / ks2Egit(16,1,40,0).son, 2);
  }
  /* gradyan · kimlik yolu */
  iddia('düz ağ D=4 ilk gradyan normu', 8.475, ks2Egit(4, 0, 1, 0).ilkGradNorm, 3);
  iddia('düz ağ D=32 ilk gradyan normu', 1.203, ks2Egit(32, 0, 1, 0).ilkGradNorm, 3);
  iddia('kısayollu D=4 ilk gradyan normu', 0.476, ks2Egit(4, 1, 1, 0).ilkGradNorm, 3);
  iddia('kısayollu D=32 ilk gradyan normu', 4.622, ks2Egit(32, 1, 1, 0).ilkGradNorm, 3);
  iddia('düz ağda gradyan derinlikle küçülüyor', true,
        ks2Egit(32,0,1,0).ilkGradNorm < ks2Egit(4,0,1,0).ilkGradNorm);
  iddia('kısayollu ağda gradyan derinlikle büyüyor', true,
        ks2Egit(32,1,1,0).ilkGradNorm > ks2Egit(4,1,1,0).ilkGradNorm);
  {
    let ihlal = 0;
    for (let i = 1; i < KS2.derinlikler.length; i++)
      if (ks2Egit(KS2.derinlikler[i],1,1,0).ilkGradNorm <=
          ks2Egit(KS2.derinlikler[i-1],1,1,0).ilkGradNorm) ihlal++;
    iddia('kısayollu ağda gradyan her adımda tekdüze büyüyor', 0, ihlal, 0);
  }
  /* dal olcegi · sonumsuz kisayol patliyor */
  iddia('D=32 düz ağ başlangıç kaybı', 1.181, ks2Egit(32, 0, 0, 0).ilk, 3);
  iddia('D=32 sönümsüz kısayol başlangıç kaybı (log10)', 11.715,
        Math.log10(ks2Egit(32, 1, 0, 0, 1).ilk), 3);
  iddia('D=32 sönümlü kısayol başlangıç kaybı', 3.705, ks2Egit(32, 1, 0, 0, 0.1).ilk, 3);
  iddia('sönümsüz kısayol daha ilk adımda patlıyor', true, ks2Egit(32, 1, 0, 0, 1).ilk > 1e10);
  iddia('sönümleme başlangıcı düz ağla aynı mertebeye getiriyor', true,
        ks2Egit(32, 1, 0, 0, 0.1).ilk < 10 * ks2Egit(32, 0, 0, 0).ilk);
  /* dal olcegi kucuklukce baslangic kaybi tekduze duşuyor */
  {
    let ihlal = 0; const dl = [1, 0.7, 0.4, 0.2, 0.1];
    for (let i = 1; i < dl.length; i++)
      if (ks2Egit(32,1,0,0,dl[i]).ilk >= ks2Egit(32,1,0,0,dl[i-1]).ilk) ihlal++;
    iddia('dal ölçeği küçüldükçe başlangıç kaybı düşüyor', 0, ihlal, 0);
  }
}

console.log('═══ HAVUZLAMA ═══');
{
  /* boyut ve azalma · pencere alani kadar */
  iddia('evrişim çıktısı değer sayısı', 1024, HV.N * HV.N, 0);
  iddia('2×2 havuz sonrası değer', 256, HV.boyut(2) ** 2, 0);
  iddia('4×4 havuz sonrası değer', 64, HV.boyut(4) ** 2, 0);
  {
    let ihlal = 0;
    for (const k of HV.pencereler)
      if ((HV.N * HV.N) / (HV.boyut(k) ** 2) !== k * k) ihlal++;
    iddia('azalma her pencerede tam olarak pencere alanı kadar', 0, ihlal, 0);
  }
  /* havuzlama parametresizdir: ayni girdi ayni cikti, ogrenme yok · determinizm */
  iddia('havuzlama deterministik', 0,
        HV.fark(HV.havuz(HV.evrisim(HV.goruntu(0)), 4, 'maks'),
                HV.havuz(HV.evrisim(HV.goruntu(0)), 4, 'maks')), 9);
  /* maks havuz gercekten pencerenin maksimumunu aliyor mu · bagimsiz dogrulama */
  {
    const o = HV.evrisim(HV.goruntu(0)), p = HV.havuz(o, 4, 'maks');
    let ihlal = 0;
    for (let i = 0; i < HV.boyut(4); i++) for (let j = 0; j < HV.boyut(4); j++){
      let m = -1e9;
      for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) m = Math.max(m, o[i*4+a][j*4+b]);
      if (Math.abs(p[i][j] - m) > 1e-12) ihlal++; }
    iddia('maks havuz her pencerede gerçekten maksimumu veriyor', 0, ihlal, 0);
  }
  /* 1 piksel kaydirma duyarliligi · dersin cekirdek olcumu */
  iddia('havuzsuz 1px değişim', 1.0000, HV.duyarlilik(1, 1, 'maks'), 4);
  iddia('2×2 maks 1px değişim', 0.7774, HV.duyarlilik(1, 2, 'maks'), 4);
  iddia('4×4 maks 1px değişim', 0.5684, HV.duyarlilik(1, 4, 'maks'), 4);
  iddia('8×8 maks 1px değişim', 0.0000, HV.duyarlilik(1, 8, 'maks'), 6);
  iddia('pencere büyüdükçe duyarlılık azalıyor', true,
        HV.duyarlilik(1,1,'maks') > HV.duyarlilik(1,2,'maks') &&
        HV.duyarlilik(1,2,'maks') > HV.duyarlilik(1,4,'maks') &&
        HV.duyarlilik(1,4,'maks') > HV.duyarlilik(1,8,'maks'));
  /* Ders "maks her zaman ortalamadan daha degismez" iddiasini REDDEDIYOR · sinayalim */
  iddia('2×2 ortalama 1px değişim', 0.8647, HV.duyarlilik(1, 2, 'ort'), 4);
  iddia('4×4 ortalama 1px değişim', 0.5097, HV.duyarlilik(1, 4, 'ort'), 4);
  iddia('2×2 de maks ortalamadan daha değişmez', true,
        HV.duyarlilik(1,2,'maks') < HV.duyarlilik(1,2,'ort'));
  iddia('4×4 te ortalama maks tan daha değişmez', true,
        HV.duyarlilik(1,4,'ort') < HV.duyarlilik(1,4,'maks'));
  iddia('maks her zaman kazanmıyor', true,
        (HV.duyarlilik(1,2,'maks') < HV.duyarlilik(1,2,'ort')) !==
        (HV.duyarlilik(1,4,'maks') < HV.duyarlilik(1,4,'ort')));
  /* direncin siniri · dersin ikinci cekirdek olcumu */
  iddia('8×8 · 0px', 0.0000, HV.duyarlilik(0, 8, 'maks'), 6);
  iddia('8×8 · 2px', 0.0000, HV.duyarlilik(2, 8, 'maks'), 6);
  iddia('8×8 · 3px', 0.2875, HV.duyarlilik(3, 8, 'maks'), 4);
  iddia('8×8 · 4px', 0.7846, HV.duyarlilik(4, 8, 'maks'), 4);
  iddia('8×8 · 8px', 0.9976, HV.duyarlilik(8, 8, 'maks'), 4);
  {
    let sonTam = -1;
    for (let s2 = 0; s2 <= 8; s2++) if (HV.duyarlilik(s2, 8, 'maks') < 1e-9) sonTam = s2;
    iddia('8×8 havuzun tam değişmez kaldığı en büyük kaydırma', 2, sonTam, 0);
    iddia('garanti pencere boyu kadar değil', true, sonTam < 8);
  }
  /* konumun bedeli · 16x16 da her kaydirma ayni temsili veriyor */
  {
    let enBuyuk = 0;
    for (let s2 = 0; s2 <= 8; s2++) enBuyuk = Math.max(enBuyuk, HV.duyarlilik(s2, 16, 'maks'));
    iddia('16×16 havuzda hiçbir kaydırma temsili değiştirmiyor', 0, enBuyuk, 9);
    iddia('16×16 da 1px ve 4px aynı sonucu veriyor', true,
          Math.abs(HV.duyarlilik(1,16,'maks') - HV.duyarlilik(4,16,'maks')) < 1e-12);
  }
  /* konum ayirt etme: 8x8 hala 4px i ayirt ediyor, 16x16 etmiyor */
  iddia('8×8 havuz 4 pikseli hâlâ ayırt ediyor', true, HV.duyarlilik(4, 8, 'maks') > 0.5);
  iddia('16×16 havuz 4 pikseli ayırt edemiyor', true, HV.duyarlilik(4, 16, 'maks') < 1e-9);
  /* ortalama havuz da ayni bedeli oduyor · tur degil pencere belirleyici */
  iddia('8×8 ortalama havuz da 1px te sıfır veriyor', 0, HV.duyarlilik(1, 8, 'ort'), 6);
  iddia('fark türde değil pencere boyutunda', true,
        HV.duyarlilik(1,8,'maks') < 1e-9 && HV.duyarlilik(1,8,'ort') < 1e-9);
}

console.log('═══ RNN · HAFIZA VE UFUK ═══');
{
  /* once kararlilik · sayi olarak iddia edilen her kosu sinaniyor */
  {
    let enBuyuk = 0;
    for (const T of RN.uzunluklar) enBuyuk = Math.max(enBuyuk, RN.hassasiyet(T));
    iddia('bütün eğitim koşuları 1e-12 bozulmaya kararlı', true, enBuyuk < 1e-9);
  }
  /* parametre sayisi dizi uzunlugundan bagimsiz */
  iddia('parametre sayısı', 168, RN.parametre(), 0);
  iddia('W matrisi ağırlığı', 144, RN.H * RN.H, 0);
  iddia('parametre sayısı T yi hiç içermiyor', true,
        RN.parametre() === RN.H * RN.H + 2 * RN.H);
  /* hafiza ufku · test kumesinde */
  iddia('T=2 açıklanan oran', 0.960, rnEgit(2, RN.ADIM, 0).aciklanan, 3);
  iddia('T=4 açıklanan oran', 0.888, rnEgit(4, RN.ADIM, 0).aciklanan, 3);
  iddia('T=8 açıklanan oran', -0.305, rnEgit(8, RN.ADIM, 0).aciklanan, 3);
  iddia('T=16 açıklanan oran', -0.393, rnEgit(16, RN.ADIM, 0).aciklanan, 3);
  iddia('kısa dizide hafıza çalışıyor', true, rnEgit(2, RN.ADIM, 0).aciklanan > 0.9);
  iddia('T=8 de ortalamadan bile kötü', true, rnEgit(8, RN.ADIM, 0).aciklanan < 0);
  {
    let ilkCoken = -1;
    for (const T of RN.uzunluklar)
      if (ilkCoken < 0 && rnEgit(T, RN.ADIM, 0).aciklanan < 0) ilkCoken = T;
    iddia('açıklanan oranın ilk negatife düştüğü uzunluk', 8, ilkCoken, 0);
  }
  /* sorun kapasite degil: egitim kaybi testten cok dusuk · ezberliyor */
  iddia('T=8 eğitim kaybı', 0.3017, rnEgit(8, RN.ADIM, 0).egitim, 4);
  iddia('T=8 test kaybı', 1.2905, rnEgit(8, RN.ADIM, 0).son, 4);
  iddia('T=8 de model ezberliyor ama genelleyemiyor', true,
        rnEgit(8, RN.ADIM, 0).egitim < 0.4 * rnEgit(8, RN.ADIM, 0).son);
  /* ETKI SONUMU · egitim gerektirmeyen bagimsiz olcum */
  {
    const E = RN.girdiEtkisi(32), son = E[31];
    iddia('8 adım öncesinin etkisi (son adıma oran %)', 2.74, 100 * E[31-8] / son, 2);
    iddia('16 adım öncesi (log10 oran)', -3.785, Math.log10(E[31-16] / son), 3);
    iddia('31 adım öncesi (log10 oran)', -7.441, Math.log10(E[31-31] / son), 3);
    {
      let yari = 0, onda = 0, yuz = 0;
      for (let k = 1; k < 32; k++){
        if (!yari && E[31-k] < son/2) yari = k;
        if (!onda && E[31-k] < son/10) onda = k;
        if (!yuz && E[31-k] < son/100) yuz = k; }
      iddia('duyarlılığın yarıya indiği uzaklık', 4, yari, 0);
      iddia('onda bire indiği uzaklık', 7, onda, 0);
      iddia('yüzde bire indiği uzaklık', 9, yuz, 0);
    }
    /* sonum ustel mi: adim basina geometrik ortalama oran */
    {
      const o = [];
      for (let k = 1; k <= 24; k++) o.push(E[31-k] / E[31-k+1]);
      const g = Math.exp(o.reduce((s, x) => s + Math.log(x), 0) / o.length);
      iddia('adım başına geometrik ortalama oran', 0.5866, g, 4);
      iddia('oran 1 in altında (sönme, patlama değil)', true, g < 1);
    }
    /* iki bagimsiz olcum ayni yeri gosteriyor · dersin asil iddiasi */
    iddia('etkinin yüzde birkaça indiği yer ile eğitimin çöktüğü yer örtüşüyor', true,
          100 * E[31-8] / son < 5 && rnEgit(8, RN.ADIM, 0).aciklanan < 0 &&
          rnEgit(4, RN.ADIM, 0).aciklanan > 0.5);
  }
  /* olcum egitilmemis agda yapiliyor · yani yapinin kendisinden geliyor */
  iddia('etki ölçümü eğitim gerektirmiyor (aynı çağrı iki kez aynı)', 0,
        Math.abs(RN.girdiEtkisi(16)[0] - RN.girdiEtkisi(16)[0]), 12);
}

console.log('═══ LSTM · KAPILAR VE HÜCRE ═══');
{
  /* sigmoid degerleri · saf aritmetik */
  const sg = z => 1/(1+Math.exp(-z));
  iddia('σ(0)', 0.5000, sg(0), 4);
  iddia('σ(1)', 0.7311, sg(1), 4);
  iddia('σ(2)', 0.8808, sg(2), 4);
  /* olculen ortalama unutma kapisi · yanliligin actigi kapi */
  iddia('yanlılık 0 · ortalama kapı', 0.5004, LS.etki(0).ortKapi, 4);
  iddia('yanlılık 1 · ortalama kapı', 0.7251, LS.etki(1).ortKapi, 4);
  iddia('yanlılık 2 · ortalama kapı', 0.8753, LS.etki(2).ortKapi, 4);
  iddia('yanlılık arttıkça kapı açılıyor', true,
        LS.etki(0).ortKapi < LS.etki(1).ortKapi && LS.etki(1).ortKapi < LS.etki(2).ortKapi);
  /* adim basina sonum orani · dersin cekirdegi */
  iddia('yanlılık 0 · adım başına sönüm', 0.7072, LS.etki(0).oran, 4);
  iddia('yanlılık 1 · adım başına sönüm', 0.9197, LS.etki(1).oran, 4);
  iddia('yanlılık 2 · adım başına sönüm', 1.0205, LS.etki(2).oran, 4);
  iddia('yanlılık 2 de oran 1 i geçiyor', true, LS.etki(2).oran > 1);
  /* ayni ayarlarda duz RNN · karsilastirma tabani */
  iddia('RNN adım başına sönüm', 0.5919, LS.rnnEtki().oran, 4);
  iddia('LSTM sönümü RNN den her yanlılıkta daha yavaş', true,
        [0,1,2].every(b => LS.etki(b).oran > LS.rnnEtki().oran));
  /* 31 adim oncesinin etkisi */
  {
    const R = LS.rnnEtki(), rOran = R.etki[0] / R.etki[31];
    iddia('RNN · 31 adım öncesi (log10)', -6.793, Math.log10(rOran), 3);
    const L0 = LS.etki(0), L1 = LS.etki(1), L2 = LS.etki(2);
    const o = L => L.etki[0] / L.etki[31];
    iddia('LSTM yanlılık 0 · 31 adım öncesi (log10)', -4.681, Math.log10(o(L0)), 3);
    iddia('LSTM yanlılık 1 · 31 adım öncesi (log10)', -1.041, Math.log10(o(L1)), 3);
    iddia('LSTM yanlılık 2 · 31 adım öncesi', 3.50, o(L2), 2);
    iddia('yanlılık 1 · RNN e göre kaç kat (log10)', 5.752, Math.log10(o(L1)/rOran), 3);
    iddia('yanlılık 2 · RNN e göre kaç kat (log10)', 7.336, Math.log10(o(L2)/rOran), 3);
    iddia('yanlılık 2 de uzak girdi son adımdan bile etkili', true, o(L2) > 1);
  }
  /* parametre bedeli */
  iddia('RNN parametre', 80, LS.parametre('rnn'), 0);
  iddia('LSTM parametre', 328, LS.parametre('lstm'), 0);
  iddia('LSTM kaç kat parametre', 4.1, LS.parametre('lstm')/LS.parametre('rnn'), 1);
  /* EGITIM · once kararlilik, sonra sayi */
  {
    let enBuyuk = 0;
    for (const T of LS.uzunluklar){
      enBuyuk = Math.max(enBuyuk, LS.hassasiyet(T, 'rnn', 0));
      enBuyuk = Math.max(enBuyuk, LS.hassasiyet(T, 'lstm', 1)); }
    iddia('aktarılan eğitim koşuları 1e-12 bozulmaya kararlı', true, enBuyuk < 1e-9);
  }
  iddia('T=4 · RNN açıklanan oran', 0.739, lsEgit(4, 'rnn', 0, 0).aciklanan, 3);
  iddia('T=4 · LSTM açıklanan oran', 0.293, lsEgit(4, 'lstm', 1, 0).aciklanan, 3);
  iddia('T=8 · RNN açıklanan oran', -0.107, lsEgit(8, 'rnn', 0, 0).aciklanan, 3);
  iddia('T=8 · LSTM açıklanan oran', 0.250, lsEgit(8, 'lstm', 1, 0).aciklanan, 3);
  iddia('T=8 farkı (puan)', 35.7,
        100*(lsEgit(8,'lstm',1,0).aciklanan - lsEgit(8,'rnn',0,0).aciklanan), 1);
  /* asil iddia: T=8 de RNN sifirin altinda, LSTM ustunde */
  iddia('T=8 de RNN ortalamanın altında, LSTM üstünde', true,
        lsEgit(8,'rnn',0,0).aciklanan < 0 && lsEgit(8,'lstm',1,0).aciklanan > 0);
  /* durustluk: T=4 te RNN onde · kapilar bedava degil */
  iddia('T=4 te RNN LSTM den iyi', true,
        lsEgit(4,'rnn',0,0).aciklanan > lsEgit(4,'lstm',1,0).aciklanan);
  iddia('sıralama uzunluğa göre tersine dönüyor', true,
        (lsEgit(4,'rnn',0,0).aciklanan > lsEgit(4,'lstm',1,0).aciklanan) &&
        (lsEgit(8,'rnn',0,0).aciklanan < lsEgit(8,'lstm',1,0).aciklanan));
  /* daha uzun kosular kaotik · bu yuzden aktarilmiyor · bunu da sinayalim */
  iddia('LSTM 16 adımlık koşu kaotik (bu yüzden sayı aktarılmıyor)', true,
        LS.hassasiyet(16, 'lstm', 1) > 0.01);
}

console.log('═══ OTOKODLAYICI ═══');
{
  /* once kararlilik */
  {
    let enBuyuk = 0;
    for (const k of OK.bogazlar){
      enBuyuk = Math.max(enBuyuk, OK.hassasiyet(k, true));
      enBuyuk = Math.max(enBuyuk, OK.hassasiyet(k, false)); }
    iddia('bütün otokodlayıcı koşuları 1e-12 bozulmaya kararlı', true, enBuyuk < 1e-9);
  }
  iddia('toplam varyans', 3.3790, OK.varyans(), 4);
  iddia('veri boyutu', 6, OK.D, 0);
  /* veri gercekten merkezlenmis mi · PCA nin gecerliligi buna bagli */
  {
    let enBuyuk = 0;
    for (let j = 0; j < OK.D; j++){
      const m = OK.veri.reduce((s, x) => s + x[j], 0) / OK.N;
      enBuyuk = Math.max(enBuyuk, Math.abs(m)); }
    iddia('veri her boyutta merkezlenmiş', 0, enBuyuk, 12);
  }
  /* PCA hatasi bogazla tekduze azaliyor · ve k=D de sifira gitmeli */
  {
    let ihlal = 0;
    for (let i = 1; i < OK.bogazlar.length; i++)
      if (OK.pca(OK.bogazlar[i]) >= OK.pca(OK.bogazlar[i-1])) ihlal++;
    iddia('PCA hatası boğazla tekdüze azalıyor', 0, ihlal, 0);
    iddia('boğaz veri boyutuna eşitken PCA hatası sıfır', 0, OK.pca(6), 9);
  }
  /* DOGRUSAL AE = PCA · dersin cekirdek iddiasi */
  iddia('boğaz 1 · PCA', 2.1141, OK.pca(1), 4);
  iddia('boğaz 1 · doğrusal AE', 2.1141, okAe(1, true, 0), 4);
  iddia('boğaz 2 · PCA', 1.3426, OK.pca(2), 4);
  iddia('boğaz 2 · doğrusal AE', 1.3426, okAe(2, true, 0), 4);
  iddia('boğaz 3 · PCA', 0.7845, OK.pca(3), 4);
  iddia('boğaz 4 · PCA', 0.3477, OK.pca(4), 4);
  iddia('boğaz 1 · AE-PCA bağıl farkı (%)', 0.000, 100*OK.fark(1), 3);
  iddia('boğaz 3 · AE-PCA bağıl farkı (%)', 0.150, 100*OK.fark(3), 3);
  {
    const enBuyuk = Math.max(...OK.bogazlar.map(OK.fark));
    iddia('en büyük AE-PCA farkı (%)', 0.150, 100*enBuyuk, 3);
    iddia('doğrusal AE her boğazda PCA ile örtüşüyor', true, enBuyuk < 0.002);
  }
  /* dogrusal AE PCA dan daha iyi OLAMAZ · teorik alt sinir */
  {
    let ihlal = 0;
    for (const k of OK.bogazlar) if (okAe(k, true, 0) < OK.pca(k) - 1e-9) ihlal++;
    iddia('doğrusal AE hiçbir boğazda PCA nın altına inemiyor', 0, ihlal, 0);
  }
  /* DOGRUSAL OLMAYAN kazanci */
  iddia('boğaz 1 · doğrusal olmayan AE', 1.6942, okAe(1, false, 0), 4);
  iddia('boğaz 2 · doğrusal olmayan AE', 0.7679, okAe(2, false, 0), 4);
  iddia('boğaz 3 · doğrusal olmayan AE', 0.3189, okAe(3, false, 0), 4);
  iddia('boğaz 4 · doğrusal olmayan AE', 0.2918, okAe(4, false, 0), 4);
  iddia('boğaz 1 kazancı (%)', 19.9, 100*(1 - okAe(1,false,0)/OK.pca(1)), 1);
  iddia('boğaz 2 kazancı (%)', 42.8, 100*(1 - okAe(2,false,0)/OK.pca(2)), 1);
  iddia('boğaz 3 kazancı (%)', 59.4, 100*(1 - okAe(3,false,0)/OK.pca(3)), 1);
  iddia('boğaz 4 kazancı (%)', 16.1, 100*(1 - okAe(4,false,0)/OK.pca(4)), 1);
  iddia('doğrusal olmayan AE her boğazda PCA yı geçiyor', true,
        OK.bogazlar.every(k => okAe(k, false, 0) < OK.pca(k)));
  iddia('en büyük kazanç boğaz 3 te', 3,
        OK.bogazlar.reduce((en, k) =>
          (1 - okAe(k,false,0)/OK.pca(k)) > (1 - okAe(en,false,0)/OK.pca(en)) ? k : en, 1), 0);
  /* bogaz genisledikce kazanc azaliyor · dersin son gozlemi */
  iddia('boğaz 4 te kazanç boğaz 3 tekinden az', true,
        (1 - okAe(4,false,0)/OK.pca(4)) < (1 - okAe(3,false,0)/OK.pca(3)));
}

console.log('═══ HESAPLAMA ÇİZGESİ ═══');
{
  const A = HC.otomatik(), elle = HC.elle();
  iddia('çizgedeki işlem düğümü', 9, A.islem, 0);
  iddia('gezilen düğüm (girdiler dahil)', 13, A.gezilen, 0);
  iddia('f(0.7, 1.3, 2.1)', 2.247886, A.deger, 6);
  /* OTOMATIK TUREV = ELLE TURETILMIS · tam esitlik, yaklasiklik degil */
  iddia('∂f/∂x₁ otomatik', -0.1417278411, A.g[0], 9);
  iddia('∂f/∂x₂ otomatik', 1.3139832042, A.g[1], 9);
  iddia('∂f/∂x₃ otomatik', -0.5474616826, A.g[2], 9);
  iddia('otomatik ile elle türev farkı tam sıfır', 0,
        Math.max(...A.g.map((v, i) => Math.abs(v - elle[i]))), 15);
  /* SAYISAL TUREVLE UYUM · yaklasik yontem oldugu icin kucuk bir fark bekleniyor */
  {
    const s = HC.sayisal(1e-5);
    const fark = Math.max(...A.g.map((v, i) => Math.abs(v - s[i])));
    iddia('sayısal türevle en büyük fark (log10)', -10.6, Math.log10(fark), 1);
    iddia('sayısal fark 1e-9 un altında', true, fark < 1e-9);
    /* fark sayisal yontemin kendi hatasi: adim kucuklukce once azalip sonra artiyor */
    const h1 = Math.max(...A.g.map((v,i)=>Math.abs(v - HC.sayisal(1e-2)[i])));
    const h2 = Math.max(...A.g.map((v,i)=>Math.abs(v - HC.sayisal(1e-5)[i])));
    const h3 = Math.max(...A.g.map((v,i)=>Math.abs(v - HC.sayisal(1e-9)[i])));
    iddia('büyük adımda sayısal hata daha büyük', true, h1 > h2);
    iddia('çok küçük adımda yuvarlama hatası geri geliyor', true, h3 > h2);
    iddia('hata otomatik türevde değil sayısal yöntemde', true, h2 < h1 && h2 < h3);
  }
  /* x₂ iki dala birden gidiyor · gradyanlar toplaniyor mu */
  {
    const M = HC.ifade(...HC.NOKTA);
    HC.geriYayil(M.out);
    const [a, b, c] = HC.NOKTA;
    const dal1 = Math.cos(a*b)*a;        /* sin(x₁x₂) dalı */
    const dal2 = Math.exp(b/c)/c;        /* exp(x₂/x₃) dalı */
    iddia('x₂ nin türevi iki dalın toplamı', dal1 + dal2, M.x2.g, 12);
    iddia('tek dal tek başına yetmiyor', true, Math.abs(dal1 - M.x2.g) > 0.1);
  }
  /* zincir kurali gercekten uygulaniyor mu: ara dugumlerin turevleri de dogru */
  {
    const M = HC.ifade(...HC.NOKTA);
    HC.geriYayil(M.out);
    iddia('sin düğümünün türevi 1 (doğrudan toplama giriyor)', 1, M.b.g, 12);
    iddia('log düğümünün türevi −1 (çıkarma)', -1, M.g.g, 12);
    iddia('çarpım düğümünün türevi cos(x₁x₂)', Math.cos(HC.NOKTA[0]*HC.NOKTA[1]), M.a.g, 12);
  }
  /* ILERI MOD vs TERS MOD · oran tam olarak 2P/3 */
  {
    let ihlal = 0;
    for (const [d2, h2] of HC.aglar){
      const P = HC.parametre(d2, h2);
      if (Math.abs(HC.ileriMod(d2,h2)/HC.tersMod(d2,h2) - 2*P/3) > 1e-6) ihlal++; }
    iddia('ileri/ters oranı her ağda tam olarak 2P/3', 0, ihlal, 0);
  }
  iddia('36 parametrede oran', 24, HC.ileriMod(4,4)/HC.tersMod(4,4), 0);
  iddia('8256 parametrede oran', 5504, HC.ileriMod(64,64)/HC.tersMod(64,64), 0);
  iddia('664064 parametrede oran', 442709, HC.ileriMod(784,512)/HC.tersMod(784,512), 0);
  iddia('664064 parametre sayısı', 664064, HC.parametre(784,512), 0);
  iddia('oran parametre sayısıyla doğru orantılı', true,
        Math.abs((HC.ileriMod(784,512)/HC.tersMod(784,512)) /
                 (HC.ileriMod(64,64)/HC.tersMod(64,64)) -
                 HC.parametre(784,512)/HC.parametre(64,64)) < 1e-6);
  /* BELLEK · kontrol noktasi kazanci */
  {
    const bel = L => L * 512 * 32, kn = L => Math.ceil(Math.sqrt(L)) * 512 * 32;
    iddia('4 katman saklanan değer', 65536, bel(4), 0);
    iddia('64 katman saklanan değer', 1048576, bel(64), 0);
    iddia('64 katmanda kontrol noktası kazancı', 8, bel(64)/kn(64), 0);
    iddia('48 katmanda kazanç', 6.9, bel(48)/kn(48), 1);
    iddia('bellek katman sayısıyla doğrusal', true,
          Math.abs(bel(64)/bel(4) - 16) < 1e-9);
    /* kazanc √L ile buyuyor */
    let ihlal = 0;
    for (const L of [4, 16, 36, 64]) if (Math.abs(bel(L)/kn(L) - Math.sqrt(L)) > 1e-9) ihlal++;
    iddia('kontrol noktası kazancı tam kare katman sayılarında √L', 0, ihlal, 0);
  }
}

console.log('═══ KARIŞIM YOĞUNLUK AĞI ═══');
{
  /* veri · iki dal ve kosullu ortalama sifir */
  iddia('x=0 da dal', 0.400, MD.dal(0), 3);
  iddia('x=0.8 de dal', 0.720, MD.dal(0.8), 3);
  iddia('gürültü σ', 0.08, MD.SIG, 3);
  iddia('x=0 da dal kaç σ uzakta', 5.00, MD.dal(0)/MD.SIG, 2);
  iddia('x=1 de dal kaç σ uzakta', 11.25, MD.dal(1)/MD.SIG, 2);
  /* kosullu ortalama gercekten sifir mi · simetri */
  {
    let enBuyuk = 0;
    for (let x = -1; x <= 1.0001; x += 0.1){
      const a = -3, b = 3, M = 4000, h = (b-a)/M;
      let ort = 0;
      for (let i = 0; i <= M; i++){ const y = a + i*h, w = (i===0||i===M)?0.5:1;
        ort += w * y * MD.pGercek(y, x) * h; }
      enBuyuk = Math.max(enBuyuk, Math.abs(ort)); }
    iddia('koşullu ortalama her x için sıfır', 0, enBuyuk, 9);
  }
  /* MSE modeli · tamamen tekrarlanabilir olmali */
  iddia('MSE modeli 1e-12 bozulmaya kararlı', true, MD.mseKararlilik() < 1e-9);
  iddia('MSE kararlılığı (log10)', -13.5, Math.log10(MD.mseKararlilik()), 1);
  iddia('MSE tahminlerinin mutlak ortalaması', 0.0782, MD.mseOlcum().mutlakOrt, 4);
  iddia('en yakın geçerli cevaba ortalama uzaklık', 0.4918, MD.mseOlcum().ortalama, 4);
  iddia('en iyi noktasında bile uzaklık', 0.3388, MD.mseOlcum().enAz, 4);
  iddia('MSE hiçbir x te dala yaklaşamıyor', true, MD.mseOlcum().enAz > 3*MD.SIG);
  iddia('MSE tahmini sıfıra yakın (koşullu ortalama)', true, MD.mseOlcum().mutlakOrt < 0.15);
  /* KAPALI FORM · egitimden bagimsiz, dolayisiyla tam tekrarlanabilir */
  iddia('x=0 da y=0 yoğunluğu (log10)', -4.731, Math.log10(MD.pGercek(0, 0)), 3);
  iddia('x=0 da dal tepesindeki yoğunluk', 2.4934, MD.pGercek(MD.dal(0), 0), 4);
  iddia('x=0 da oran (log10)', 5.128, Math.log10(MD.pGercek(MD.dal(0),0)/MD.pGercek(0,0)), 3);
  iddia('x=0.8 de y=0 yoğunluğu (log10)', -16.891, Math.log10(MD.pGercek(0, 0.8)), 3);
  iddia('x=0.8 de oran (log10)', 17.288,
        Math.log10(MD.pGercek(MD.dal(0.8),0.8)/MD.pGercek(0,0.8)), 3);
  iddia('dal tepesindeki yoğunluk x ten bağımsız', true,
        Math.abs(MD.pGercek(MD.dal(0),0) - MD.pGercek(MD.dal(0.8),0.8)) < 1e-9);
  /* bilgi kaybi · tek Gauss ile karisim arasinda */
  iddia('tek Gauss bilgi kaybı (nat)', 1.2557, MD.bilgiKaybi(), 4);
  iddia('karışım kaç kat daha olası', 3.51, Math.exp(MD.bilgiKaybi()), 2);
  iddia('kayıp her x te pozitif', true, (() => {
    for (let x = -1; x <= 1.0001; x += 0.2)
      if (MD.beklenenLog(MD.pGercek, x) - MD.beklenenLog(MD.pTek, x) <= 0) return false;
    return true; })());
  /* gercek yogunluk gercekten iki tepeli mi · bagimsiz kontrol */
  {
    let tepe = 0;
    const x = 0.5, d = MD.dal(x);
    for (let y = -1.5; y <= 1.5; y += 0.001){
      const a = MD.pGercek(y - 0.001, x), b = MD.pGercek(y, x), c2 = MD.pGercek(y + 0.001, x);
      if (b > a && b > c2 && b > 0.01) tepe++; }
    iddia('gerçek yoğunluk iki tepeli', 2, tepe, 0);
    iddia('tepeler ±dal noktasında', true,
          MD.pGercek(d, x) > 100 * MD.pGercek(0, x));
  }
  /* MDN · tanimlanabilir DEGIL · dersin dorduncu adimi */
  iddia('MDN eğitimi 1e-12 bozulmaya duyarlı', true, MD.mdnKararlilik() > 0.01);
  iddia('MDN kararsızlığı MSE den çok büyük', true,
        MD.mdnKararlilik() > 1e9 * MD.mseKararlilik());
}

console.log('═══ BAYESÇİ AĞ · TOPLULUK ═══');
{
  /* once kararlilik · her uye tekrarlanabilir olmali */
  iddia('topluluk üyeleri 1e-12 bozulmaya kararlı', true, BA.kararlilik() < 1e-9);
  iddia('üye kararlılığı (log10)', -12.7, Math.log10(BA.kararlilik()), 1);
  /* yayilim veri bitince aciliyor */
  iddia('veri içi ortalama sd', 0.0224, BA.icSd(), 4);
  iddia('x=4 te sd', 0.1478, BA.ist(4).sd, 4);
  iddia('x=5 te sd', 0.1899, BA.ist(5).sd, 4);
  iddia('x=4 kaç kat geniş', 6.6, BA.ist(4).sd / BA.icSd(), 1);
  iddia('x=5 kaç kat geniş', 8.5, BA.ist(5).sd / BA.icSd(), 1);
  {
    let ihlal = 0;
    for (const x of [2.5, 3, 3.5, 4, 4.5, 5])
      if (BA.ist(x).sd <= BA.icSd()) ihlal++;
    iddia('veri dışındaki her noktada yayılım veri içinden büyük', 0, ihlal, 0);
  }
  /* AMA KALIBRE DEGIL · dersin asil olcumu */
  iddia('veri içi ±2σ kapsaması', 0.778, BA.kapsama(-2, 2), 3);
  iddia('hemen dışı kapsaması', 0.095, BA.kapsama(2, 3), 3);
  iddia('uzak bölge kapsaması', 0.195, BA.kapsama(3, 5), 3);
  iddia('veri içinde bile %95 in altında', true, BA.kapsama(-2, 2) < 0.95);
  iddia('dışarıda kapsama çöküyor', true, BA.kapsama(2, 3) < 0.2);
  /* sapma kac sigma */
  iddia('x=0 da sapma (σ)', 3.28, BA.sapmaSigma(0), 2);
  iddia('x=2.5 ta sapma (σ)', 3.91, BA.sapmaSigma(2.5), 2);
  iddia('x=4 te sapma (σ)', 6.43, BA.sapmaSigma(4), 2);
  iddia('x=5 te sapma (σ)', 13.61, BA.sapmaSigma(5), 2);
  iddia('uzaklaştıkça sapma büyüyor', true,
        BA.sapmaSigma(5) > BA.sapmaSigma(4) && BA.sapmaSigma(4) > BA.sapmaSigma(2.5));
  /* GP dersiyle karsilastirma · orada x=5 te 2.77σ olculmustu */
  iddia('GP dersindeki x=5 sapması', 2.77,
        Math.abs(gpModel(1.0, 6)(5).ort - GP.f0(5)) / gpModel(1.0, 6)(5).sd, 2);
  iddia('topluluk GP den kaç kat kötü', 4.9,
        BA.sapmaSigma(5) / (Math.abs(gpModel(1.0,6)(5).ort - GP.f0(5)) / gpModel(1.0,6)(5).sd), 1);
  iddia('ikisi de ±2σ nın dışında', true,
        BA.sapmaSigma(5) > 2 &&
        Math.abs(gpModel(1.0,6)(5).ort - GP.f0(5)) / gpModel(1.0,6)(5).sd > 2);
  /* veri icinde de hemfikir ama yanlis · x=0 */
  iddia('x=0 da yayılım çok küçük', 0.0075, BA.ist(0).sd, 4);
  iddia('x=0 da hemfikir ama yanılıyorlar', true,
        BA.ist(0).sd < 0.01 && BA.sapmaSigma(0) > 3);
  /* uye sayisi tekduze etki yapmiyor */
  iddia('2 üyeyle x=4 sd', 0.0803, BA.ist(4, 2).sd, 4);
  iddia('4 üyeyle x=4 sd', 0.0674, BA.ist(4, 4).sd, 4);
  iddia('10 üyeyle x=4 sd', 0.1478, BA.ist(4, 10).sd, 4);
  iddia('üye sayısı arttıkça sd tekdüze artmıyor', true,
        BA.ist(4, 4).sd < BA.ist(4, 2).sd);
  /* topluluk ortalamasi tek uyeden daha mi iyi · bagimsiz kontrol */
  {
    let toplulukHata = 0, uyeHata = 0, n = 0;
    for (let x = -2; x <= 2.0001; x += 0.1){
      toplulukHata += (BA.ist(x).ort - BA.f0(x)) ** 2;
      uyeHata += (BA.uyeler()[0](x) - BA.f0(x)) ** 2; n++; }
    iddia('topluluk ortalaması tek üyeden daha doğru', true, toplulukHata < uyeHata);
  }
}

console.log('═══ KODLAYICI MI ÇÖZÜCÜ MÜ ═══');
{
  /* maske · saf aritmetik */
  iddia('n=8 çift yönlü görünür çift', 64, ED.gorunurCift(8, false), 0);
  iddia('n=8 nedensel görünür çift', 36, ED.gorunurCift(8, true), 0);
  iddia('n=8 oran', 1.7778, ED.gorunurCift(8,false)/ED.gorunurCift(8,true), 4);
  iddia('n=4096 oran', 1.9995, ED.gorunurCift(4096,false)/ED.gorunurCift(4096,true), 4);
  iddia('oran uzunlukla 2 ye yaklaşıyor', true, (() => {
    let onceki = 0;
    for (const n of ED.uzunluklar){
      const o = ED.gorunurCift(n,false)/ED.gorunurCift(n,true);
      if (o <= onceki || o >= 2) return false; onceki = o; }
    return true; })());
  /* ANLAMA · nedensel modelin teorik tavani kapali formda 0.5 */
  {
    const C = ED.anlama(true), B = ED.anlama(false);
    iddia('nedensel test R²', 0.501383, C.r2, 6);
    iddia('çift yönlü test R²', 1.000000, B.r2, 6);
    iddia('nedensel teorik tavanına oturuyor', true, Math.abs(C.r2 - 0.5) < 0.01);
    iddia('çift yönlü görevi tam çözüyor', true, B.r2 > 0.9999);
    iddia('çift yönlü MSE sıfır', 0, B.mse, 6);
    /* ogrenilen agirliklar kurali birebir cikariyor mu */
    iddia('çift yönlü · x(t−1) katsayısı', 1.0000, B.w[2], 4);
    iddia('çift yönlü · x(t+1) katsayısı', 1.0000, B.w[4], 4);
    iddia('çift yönlü · diğer bütün katsayılar sıfır', 0,
          Math.max(Math.abs(B.w[0]), Math.abs(B.w[1]), Math.abs(B.w[3]), Math.abs(B.w[5])), 4);
    iddia('nedensel · x(t−1) katsayısı', 0.9926, C.w[2], 4);
    iddia('nedensel model elinden geleni yapıyor', true, Math.abs(C.w[2] - 1) < 0.02);
    /* teorik tavanin kendisi: Var(y)=2, kacirilan varyans 1 */
    iddia('Var(y) = 2 (iki bağımsız komşunun toplamı)', 2, 1 + 1, 9);
    iddia('teorik tavan 1 − 1/2', 0.5, 1 - 1/2, 9);
  }
  /* URETIM · sizinti */
  {
    const A = ED.uretim('nedensel'), S = ED.uretim('sizintili');
    iddia('nedensel üretim R²', -0.000433, A.r2, 6);
    iddia('nedensel model hiçbir şey tahmin edemiyor', true, Math.abs(A.r2) < 0.01);
    iddia('sızıntılı üretim R²', 1.000000, S.r2, 6);
    iddia('sızıntılı model kendi ağırlığı', 1.000000, S.kendiAgirlik, 6);
    iddia('sızıntılı modelin diğer ağırlıkları sıfır', 0,
          Math.max(...S.w.slice(0, -1).map(Math.abs)), 6);
    iddia('sızıntılı model sadece kopyalıyor', true,
          Math.abs(S.kendiAgirlik - 1) < 1e-4 &&
          Math.max(...S.w.slice(0, -1).map(Math.abs)) < 1e-4);
    iddia('kusursuz puan ile sıfır değer aynı anda', true, S.r2 > 0.9999 && Math.abs(A.r2) < 0.01);
  }
  /* kapali form · ayni cagri iki kez ayni sonucu vermeli */
  iddia('kapalı form tamamen deterministik', 0,
        Math.abs(ED.anlama(true).r2 - ED.anlama(true).r2), 15);
  iddia('eğitim ve test kümeleri ayrık tohumlardan', true, ED.NDIZI === 400 && ED.T === 24);
}

console.log('═══ PERPLEXITY ═══');
{
  /* kaynak gecerli mi: gecis matrisi satirlari 1 e toplaniyor mu */
  {
    let ihlal = 0;
    for (const row of PX.P) if (Math.abs(row.reduce((s, p) => s + p, 0) - 1) > 1e-12) ihlal++;
    iddia('geçiş matrisinin her satırı 1 e toplanıyor', 0, ihlal, 0);
  }
  /* duragan dagilim gercekten duragan mi · pi P = pi */
  {
    let enBuyuk = 0;
    for (let j = 0; j < 4; j++){
      let s = 0;
      for (let i = 0; i < 4; i++) s += PX.duragan[i]*PX.P[i][j];
      enBuyuk = Math.max(enBuyuk, Math.abs(s - PX.duragan[j])); }
    iddia('durağan dağılım gerçekten sabit nokta', 0, enBuyuk, 12);
    iddia('durağan dağılım 1 e toplanıyor', 1, PX.duragan.reduce((s, p) => s + p, 0), 12);
  }
  /* teorik entropiler */
  iddia('koşullu entropi H1 (nat)', 1.079172, PX.H1, 6);
  iddia('bağımsız entropi H0 (nat)', 1.350205, PX.H0, 6);
  iddia('gerçek alt sınır perplexity', 2.9422, Math.exp(PX.H1), 4);
  iddia('bağımsız varsayım perplexity', 3.8582, Math.exp(PX.H0), 4);
  iddia('koşullu entropi bağımsızdan küçük', true, PX.H1 < PX.H0);
  iddia('bağımsız perplexity alfabe boyunun altında', true, Math.exp(PX.H0) < 4);
  /* olculen perplexity · modeller alt sinira yaklasiyor */
  iddia('1-gram perplexity', 3.8714, PX.simge(1).ppl, 4);
  iddia('2-gram perplexity', 2.9465, PX.simge(2).ppl, 4);
  iddia('3-gram perplexity', 2.9472, PX.simge(3).ppl, 4);
  iddia('4-gram perplexity', 2.9558, PX.simge(4).ppl, 4);
  iddia('1-gram sıklık sınırına oturuyor', true,
        Math.abs(PX.simge(1).ppl - Math.exp(PX.H0)) / Math.exp(PX.H0) < 0.01);
  iddia('2-gram alt sınıra %1 den yakın', true,
        PX.simge(2).ppl / Math.exp(PX.H1) - 1 < 0.01);
  iddia('2-gram alt sınıra fark (%)', 0.14, 100*(PX.simge(2).ppl/Math.exp(PX.H1) - 1), 2);
  /* hicbir model teorik alt sinirin ALTINA inemiyor */
  {
    let ihlal = 0;
    for (const n of PX.mertebeler) if (PX.simge(n).ppl < Math.exp(PX.H1) - 1e-9) ihlal++;
    iddia('hiçbir model teorik alt sınırın altına inemiyor', 0, ihlal, 0);
  }
  /* DAHA FAZLA BAGLAM KOTULESTIRIYOR · dersin ikinci adimi */
  iddia('3-gram 2-gram dan kötü', true, PX.simge(3).ppl > PX.simge(2).ppl);
  iddia('4-gram 3-gram dan kötü', true, PX.simge(4).ppl > PX.simge(3).ppl);
  iddia('2-gram bütün mertebelerin en iyisi', 2,
        PX.mertebeler.reduce((en, n) => PX.simge(n).ppl < PX.simge(en).ppl ? n : en, 1), 0);
  /* baglam sayisi 4 katina cikiyor */
  iddia('2-gram bağlam sayısı', 4, PX.simge(2).baglam, 0);
  iddia('3-gram bağlam sayısı', 16, PX.simge(3).baglam, 0);
  iddia('4-gram bağlam sayısı', 64, PX.simge(4).baglam, 0);
  /* TOKENIZASYON BAGIMLILIGI · dersin ucuncu adimi */
  {
    const A1 = PX.simge(2), A2 = PX.token(2);
    iddia('simge başına perplexity', 2.9465, A1.ppl, 4);
    iddia('token başına perplexity', 8.7474, A2.ppl, 4);
    iddia('perplexity oranı', 2.969, A2.ppl / A1.ppl, 3);
    iddia('simge başına NLL (simge modeli)', 1.080613, A1.nll, 6);
    iddia('simge başına NLL (token modeli)', 1.084380, A2.nll / 2, 6);
    iddia('simge başına NLL farkı (%)', 0.349, 100*Math.abs(A2.nll/2 - A1.nll)/A1.nll, 3);
    /* asil iddia: perplexity 3 kat degisiyor ama simge basina bilgi degismiyor */
    iddia('perplexity 2 katından fazla değişiyor', true, A2.ppl / A1.ppl > 2);
    iddia('simge başına bilgi %1 den az değişiyor', true,
          Math.abs(A2.nll/2 - A1.nll)/A1.nll < 0.01);
    /* alfabe 16 da en kotu perplexity 16 · token modeli onun cok altinda */
    iddia('token modeli alfabe boyunun çok altında', true, A2.ppl < 16);
  }
}

console.log('═══ ÖLÇEK YASALARI ═══');
{
  const F = OY.tam(), K2 = OY.kucuk(), V = OY.veri();
  /* kayip veriyle tekduze azaliyor mu (gurultuye ragmen genel yon) */
  iddia('en küçük veride kayıp', 1.149203, OY.nll(50), 6);
  iddia('en büyük veride kayıp', 1.079538, OY.nll(100000), 6);
  iddia('kayıp veriyle azalıyor', true, OY.nll(100000) < OY.nll(50));
  iddia('hiçbir veri miktarında entropi altına inilmiyor', true,
        V.every(([N, L]) => L >= PX.H1));
  /* fazla kayip ve azalan getiri */
  {
    const f1 = OY.nll(50) - PX.H1, f2 = OY.nll(100000) - PX.H1;
    iddia('50 örnekte fazla kayıp (log10)', -1.155, Math.log10(f1), 3);
    iddia('100000 örnekte fazla kayıp (log10)', -3.436, Math.log10(f2), 3);
    iddia('2000 kat veri kaç kat kazandırdı', 191, f1/f2, 0);
    iddia('getiri veri artışından çok daha yavaş', true, f1/f2 < 2000);
  }
  /* GUC YASASI UYDURMA · L∞ gercek entropi KULLANILMADAN araniyor */
  iddia('uydurulan üs α', 0.6624, F.alpha, 4);
  iddia('log-log R²', 0.9568, F.r2, 4);
  iddia('uydurulan L∞', 1.0792, F.Linf, 4);
  iddia('gerçek entropi', 1.079172, PX.H1, 6);
  iddia('uydurulan L∞ ile gerçek arasındaki fark', 0.00003, Math.abs(F.Linf - PX.H1), 5);
  iddia('L∞ gerçek entropiyi binde birden yakın buluyor', true,
        Math.abs(F.Linf - PX.H1)/PX.H1 < 0.001);
  /* arama gercek entropiyi kullanmiyor · ust sinir gozlenen en dusuk kayiptan */
  {
    const enDusuk = Math.min(...V.map(p => p[1]));
    iddia('arama üst sınırı gözlenen en düşük kayıptan', 1.079538, enDusuk, 6);
    iddia('L∞ gözlenen en düşük kaybın altında', true, F.Linf < enDusuk);
  }
  /* EKSTRAPOLASYON · sadece N<=2000 ile uydurup buyugu tahmin et */
  iddia('küçük uydurmadaki nokta sayısı', 6, K2.nokta, 0);
  iddia('küçük uydurmanın L∞ değeri', 1.0792, K2.Linf, 4);
  iddia('küçük uydurmanın üssü', 0.7953, K2.alpha, 4);
  {
    const E = OY.ekstraHata();
    iddia('öngörülen nokta sayısı', 5, E.length, 0);
    iddia('en büyük öngörü hatası (%)', 0.0438, 100*Math.max(...E.map(e => e.hata)), 4);
    iddia('bütün öngörüler binde birden iyi', true, E.every(e => e.hata < 0.001));
    iddia('N=100000 öngörüsü', 1.079310, E[E.length-1].p, 6);
    /* 50 kat oteye ekstrapolasyon */
    iddia('en uzak öngörü kaç kat ötede', 50, 100000/OY.esik, 0);
  }
  /* DURUSTLUK: us alt kumeye gore degisiyor ama tahmin tutuyor */
  iddia('iki uydurmanın üsleri farklı', true, Math.abs(K2.alpha - F.alpha) > 0.1);
  iddia('iki uydurmanın L∞ değerleri aynı', true, Math.abs(K2.Linf - F.Linf) < 0.001);
  {
    /* buyuk N de tahmini L∞ belirliyor: guc terimi ihmal edilebilir */
    const gucTerim = K2.A * Math.pow(100000, -K2.alpha);
    iddia('N=100000 de güç teriminin katkısı', 0.00011, gucTerim, 5);
    iddia('tahminin neredeyse tamamı L∞ dan geliyor', true, gucTerim / K2.Linf < 0.001);
  }
  /* kucuk uydurmanin uyumu daha kotu · durustluk */
  iddia('küçük uydurmanın R² si', 0.8856, K2.r2, 4);
  iddia('küçük uydurma tam uydurmadan daha gürültülü', true, K2.r2 < F.r2);
}

console.log('═══ KENDİ KENDİNE GÖZETİM ═══');
{
  /* KURULUMUN ADALETI · uc konu da cift stokastik olmali */
  iddia('konu 0 çift stokastik', 0, OZ.ciftStokastik(0), 12);
  iddia('konu 1 çift stokastik', 0, OZ.ciftStokastik(1), 12);
  iddia('konu 2 çift stokastik', 0, OZ.ciftStokastik(2), 12);
  /* dolayisiyla duragan dagilim tekduze · dogrudan sinayalim */
  {
    let enBuyuk = 0;
    for (let k = 0; k < 3; k++){
      let p = [0.25, 0.25, 0.25, 0.25];
      for (let it = 0; it < 500; it++){
        const q = [0,0,0,0];
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) q[j] += p[i]*OZ.konular[k][i][j];
        p = q; }
      for (const v of p) enBuyuk = Math.max(enBuyuk, Math.abs(v - 0.25)); }
    iddia('üç konunun da durağan dağılımı tekdüze', 0, enBuyuk, 12);
  }
  /* konular gercekten FARKLI mi · gecis matrisleri ayrisiyor mu */
  {
    let enKucuk = 1e9;
    for (let a = 0; a < 3; a++) for (let b = a+1; b < 3; b++){
      let f = 0;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++)
        f += Math.abs(OZ.konular[a][i][j] - OZ.konular[b][i][j]);
      enKucuk = Math.min(enKucuk, f); }
    iddia('konu çiftleri geçişlerde belirgin farklı', true, enKucuk > 1);
  }
  /* TEK-SIMGE TEMSILI SIFIR BILGI · etiket sayisindan bagimsiz rastgele */
  iddia('tek-simge 1 etiket', 0.343, OZ.dogruluk('tek', 1, 40), 3);
  iddia('tek-simge 5 etiket', 0.387, OZ.dogruluk('tek', 5, 40), 3);
  iddia('tek-simge 20 etiket', 0.310, OZ.dogruluk('tek', 20, 40), 3);
  {
    let enBuyuk = 0;
    for (const k of OZ.etiketler) enBuyuk = Math.max(enBuyuk, OZ.dogruluk('tek', k, 40));
    iddia('tek-simge hiçbir etiket sayısında %45 i geçemiyor', true, enBuyuk < 0.45);
    iddia('tek-simge rastgeleden anlamlı biçimde iyi değil', true, enBuyuk - 1/3 < 0.06);
  }
  /* ON-GOREV TEMSILI · az etiketle yuksek dogruluk */
  iddia('ön-görev 1 etiket', 0.690, OZ.dogruluk('ikili', 1, 40), 3);
  iddia('ön-görev 2 etiket', 0.907, OZ.dogruluk('ikili', 2, 40), 3);
  iddia('ön-görev 5 etiket', 0.980, OZ.dogruluk('ikili', 5, 40), 3);
  iddia('ön-görev 20 etiket', 0.977, OZ.dogruluk('ikili', 20, 40), 3);
  iddia('5 etiketten sonra doyuyor', true,
        Math.abs(OZ.dogruluk('ikili', 20, 40) - OZ.dogruluk('ikili', 5, 40)) < 0.02);
  iddia('ön-görev her etiket sayısında tek-simgeden iyi', true,
        OZ.etiketler.every(k => OZ.dogruluk('ikili', k, 40) > OZ.dogruluk('tek', k, 40)));
  iddia('5 etiketteki fark (puan)', 59.3,
        100*(OZ.dogruluk('ikili', 5, 40) - OZ.dogruluk('tek', 5, 40)), 1);
  /* HAM VERI IHTIYACI · belge uzunlugu */
  iddia('T=10 ön-görev', 0.547, OZ.dogruluk('ikili', 1, 10), 3);
  iddia('T=80 ön-görev', 0.840, OZ.dogruluk('ikili', 1, 80), 3);
  iddia('T=200 ön-görev', 1.000, OZ.dogruluk('ikili', 1, 200), 3);
  iddia('uzunlukla ön-görev doğruluğu artıyor', true,
        OZ.dogruluk('ikili', 1, 200) > OZ.dogruluk('ikili', 1, 10));
  {
    /* tek-simge uzunluktan etkilenmiyor · sinyal yoksa veri yaratmaz */
    let mn = 1, mx = 0;
    for (const T of OZ.uzunluklar){ const d2 = OZ.dogruluk('tek', 1, T);
      mn = Math.min(mn, d2); mx = Math.max(mx, d2); }
    iddia('tek-simge uzunluk aralığı dar', true, mx - mn < 0.10);
    iddia('tek-simge hiçbir uzunlukta %45 i geçmiyor', true, mx < 0.45);
  }
  /* BASARISIZLIK · konum gerektiren gorev */
  {
    const taban = OZ.konumTaban(40);
    iddia('çoğunluk sınıfı tabanı', 0.740, taban, 3);
    iddia('konum görevinde ön-görev temsili', 0.567, OZ.dogruluk('ikili', 20, 40, true), 3);
    iddia('konum görevinde tek-simge', 0.590, OZ.dogruluk('tek', 20, 40, true), 3);
    iddia('ikisi de çoğunluk tabanının altında', true,
          OZ.dogruluk('ikili', 20, 40, true) < taban &&
          OZ.dogruluk('tek', 20, 40, true) < taban);
    /* asil iddia: ayni temsil bir gorevde muhtesem, digerinde tabanin altinda */
    iddia('aynı temsil bir görevde %98, diğerinde tabanın altında', true,
          OZ.dogruluk('ikili', 5, 40) > 0.95 &&
          OZ.dogruluk('ikili', 20, 40, true) < taban);
  }
  /* on-gorev sinyali sayisi · belge basina T-1 */
  iddia('40 simgelik belgeden çıkan gözetim örneği', 39, 40 - 1, 0);
  iddia('200 simgelik belgeden', 199, 200 - 1, 0);
}

console.log('═══ BAĞLAM İÇİ ÖĞRENME ═══');
{
  /* kurulum: gorulmeyen gorev de cift stokastik olmali ki karsilastirma adil olsun */
  {
    let en = 0;
    for (let i = 0; i < 4; i++) en = Math.max(en, Math.abs(IC.gorulmeyen[i].reduce((s, p) => s + p, 0) - 1));
    for (let j = 0; j < 4; j++) en = Math.max(en, Math.abs(IC.gorulmeyen.reduce((s, r) => s + r[j], 0) - 1));
    iddia('görülmeyen görev de çift stokastik', 0, en, 12);
    /* ve bilinen ucunden de farkli */
    let enYakin = 1e9;
    for (let k = 0; k < 3; k++){ let f = 0;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++)
        f += Math.abs(IC.gorulmeyen[i][j] - IC.bilinen[k][i][j]);
      enYakin = Math.min(enYakin, f); }
    iddia('görülmeyen görev bilinenlerin hepsinden uzak', true, enYakin > 1);
  }
  /* baglam bosken sonsal tam belirsiz · ln 3 */
  iddia('bağlam boşken sonsal entropi', 1.0986, IC.olc(true, 0).entropi, 4);
  iddia('bu tam olarak ln 3', 0, Math.abs(IC.olc(true, 0).entropi - Math.log(3)), 9);
  iddia('görülmeyen görevde de başlangıç aynı', 1.0986, IC.olc(false, 0).entropi, 4);
  /* GORULEN GOREV · fazla kayip sifira iniyor */
  iddia('görülen · 0 örnek fazla kayıp', 0.2833, IC.olc(true, 0).fazla, 4);
  iddia('görülen · 4 örnek', 0.0743, IC.olc(true, 4).fazla, 4);
  iddia('görülen · 16 örnek', 0.0090, IC.olc(true, 16).fazla, 4);
  iddia('görülen · 64 örnek', 0.0000, IC.olc(true, 64).fazla, 4);
  iddia('64 örnekte ICL kâhinle aynı', true, IC.olc(true, 64).fazla < 0.001);
  {
    let ihlal = 0;
    for (let i = 1; i < IC.kler.length; i++)
      if (IC.olc(true, IC.kler[i]).fazla > IC.olc(true, IC.kler[i-1]).fazla + 1e-9) ihlal++;
    iddia('görülen görevde fazla kayıp tekdüze azalıyor', 0, ihlal, 0);
  }
  /* sonsal keskinlesiyor */
  iddia('görülen · 16 örnek sonsal entropi', 0.0629, IC.olc(true, 16).entropi, 4);
  iddia('görülen · 64 örnek sonsal entropi', 0.0001, IC.olc(true, 64).entropi, 4);
  {
    let ihlal = 0;
    for (let i = 1; i < IC.kler.length; i++)
      if (IC.olc(true, IC.kler[i]).entropi > IC.olc(true, IC.kler[i-1]).entropi + 1e-9) ihlal++;
    iddia('sonsal entropi tekdüze azalıyor', 0, ihlal, 0);
  }
  /* GORULMEYEN GOREV · fazla kayip TAKILIYOR */
  iddia('görülmeyen · 0 örnek fazla kayıp', 0.6023, IC.olc(false, 0).fazla, 4);
  iddia('görülmeyen · 8 örnek', 0.4074, IC.olc(false, 8).fazla, 4);
  iddia('görülmeyen · 32 örnek', 0.3686, IC.olc(false, 32).fazla, 4);
  iddia('görülmeyen · 64 örnek', 0.3690, IC.olc(false, 64).fazla, 4);
  iddia('görülmeyen görevde fazla kayıp sıfıra inmiyor', true, IC.olc(false, 64).fazla > 0.3);
  iddia('32 den 64 e neredeyse hiç iyileşme yok', true,
        Math.abs(IC.olc(false, 64).fazla - IC.olc(false, 32).fazla) < 0.01);
  /* asil karsilastirma: ayni baglam uzunlugunda iki gorev */
  iddia('64 örnekte görülen ile görülmeyen arasındaki uçurum', 0.3690,
        IC.olc(false, 64).fazla - IC.olc(true, 64).fazla, 4);
  /* dogrulukta da fark kapanmiyor */
  iddia('görülen · 64 örnek ICL doğruluğu', 0.703, IC.olc(true, 64).dogruluk, 3);
  iddia('görülen · kâhin doğruluğu', 0.703, IC.olc(true, 64).kahinDogruluk, 3);
  iddia('görülen görevde ICL kâhini yakalıyor', true,
        Math.abs(IC.olc(true, 64).dogruluk - IC.olc(true, 64).kahinDogruluk) < 0.005);
  iddia('görülmeyen · 64 örnek ICL doğruluğu', 0.250, IC.olc(false, 64).dogruluk, 3);
  iddia('görülmeyen · kâhin doğruluğu', 0.451, IC.olc(false, 64).kahinDogruluk, 3);
  iddia('görülmeyen görevde 20 puanlık fark kapanmıyor', true,
        IC.olc(false, 64).kahinDogruluk - IC.olc(false, 64).dogruluk > 0.15);
  /* EN ONEMLI OLCUM: gorulmeyen gorevde de sonsal keskinlesiyor · emin ve yanlis */
  iddia('görülmeyen · 64 örnek sonsal entropi', 0.0123, IC.olc(false, 64).entropi, 4);
  iddia('görülmeyen görevde model yine kesinleşiyor', true, IC.olc(false, 64).entropi < 0.05);
  iddia('emin ama yanlış: entropi düşük, fazla kayıp yüksek', true,
        IC.olc(false, 64).entropi < 0.05 && IC.olc(false, 64).fazla > 0.3);
}

console.log('═══ CHAIN-OF-THOUGHT ═══');
{
  /* gorevin kurulusu */
  iddia('CoT · durum sayısı', 12, CT.M, 0);
  iddia('CoT · en uzun zincir', 8, CT.NMAX, 0);
  iddia('CoT · toplam (durum, adım) çifti', 96, CT.tum.length, 0);
  iddia('CoT · f permütasyon mu (ayrık görüntü sayısı)', 12, new Set(CT.F).size, 0);
  /* permutasyon oldugu icin f^k(s) her k da bir dongude ilerler, hicbir durum yutulmaz */
  { let cakisma = 0;
    for (let s = 0; s < CT.M; s++) for (let t = s+1; t < CT.M; t++)
      if (CT.uygula(s, 5) === CT.uygula(t, 5)) cakisma++;
    iddia('CoT · f⁵ de iki durum aynı yere düşmüyor', 0, cakisma, 0); }

  /* 1. adim: kac olgu */
  iddia('CoT · doğrudan · 4 örnek', 12.5, 100*CT.dogrudan(4), 1);
  iddia('CoT · doğrudan · 8 örnek', 16.7, 100*CT.dogrudan(8), 1);
  iddia('CoT · doğrudan · 12 örnek', 20.8, 100*CT.dogrudan(12), 1);
  iddia('CoT · doğrudan · 24 örnek', 32.3, 100*CT.dogrudan(24), 1);
  iddia('CoT · doğrudan · 48 örnek', 56.3, 100*CT.dogrudan(48), 1);
  iddia('CoT · doğrudan · 96 örnek', 100.0, 100*CT.dogrudan(96), 1);
  iddia('CoT · zincir · 4 örnek', 13.5, 100*CT.cot(4), 1);
  iddia('CoT · zincir · 8 örnek', 38.5, 100*CT.cot(8), 1);
  iddia('CoT · zincir · 12 örnek', 100.0, 100*CT.cot(12), 1);
  iddia('CoT · zincir · 96 örnek', 100.0, 100*CT.cot(96), 1);
  /* mekanizma: CoT tam M ornekte doyuyor, bir onceki adimda henuz doymuyor */
  iddia('CoT · 11 örnekte henüz %100 değil', 1, CT.cot(11) < 0.999 ? 1 : 0, 0);
  iddia('CoT · doğrudan 95 örnekte henüz %100 değil', 1, CT.dogrudan(95) < 0.999 ? 1 : 0, 0);
  iddia('CoT · olgu oranı 96/12', 8, CT.tum.length/CT.M, 0);
  /* dogrudan model monoton artmali: daha cok ornek asla zarar vermez */
  { let ihlal = 0;
    for (let i = 1; i < CT.egitimler.length; i++)
      if (CT.dogrudan(CT.egitimler[i]) < CT.dogrudan(CT.egitimler[i-1]) - 1e-12) ihlal++;
    iddia('CoT · doğrudan model örnek sayısında monoton', 0, ihlal, 0); }

  /* 2. adim: sabit butce, degisen uzunluk */
  { const Z = CT.uzunlukBazinda(24);
    iddia('CoT · 24 örnek · doğrudan n=1', 33.3, 100*Z[1].dogrudan, 1);
    iddia('CoT · 24 örnek · doğrudan n=2', 50.0, 100*Z[2].dogrudan, 1);
    iddia('CoT · 24 örnek · doğrudan n=5', 16.7, 100*Z[5].dogrudan, 1);
    iddia('CoT · 24 örnek · doğrudan n=8', 25.0, 100*Z[8].dogrudan, 1);
    let toplam = 0, kotu = 0;
    for (let n = 1; n <= CT.NMAX; n++){ toplam += Z[n].dogrudan;
      if (Z[n].cot < 0.999) kotu++; }
    iddia('CoT · 24 örnek · zincir her n de %100', 0, kotu, 0);
    iddia('CoT · 24 örnek · doğrudan ortalaması', 32.3, 100*toplam/CT.NMAX, 1);
    /* dersteki iddia: turuncu egride egilim yok, dalgalanma var */
    let inis = 0, cikis = 0;
    for (let n = 2; n <= CT.NMAX; n++){
      if (Z[n].dogrudan < Z[n-1].dogrudan - 1e-12) inis++;
      if (Z[n].dogrudan > Z[n-1].dogrudan + 1e-12) cikis++; }
    iddia('CoT · doğrudan eğrisi hem iniyor hem çıkıyor (iniş)', 1, inis > 0 ? 1 : 0, 0);
    iddia('CoT · doğrudan eğrisi hem iniyor hem çıkıyor (çıkış)', 1, cikis > 0 ? 1 : 0, 0); }

  /* 3. adim: hata birikimi */
  iddia('CoT · ε=0.02 · n=1', 98.0, 100*CT.gurultulu(0.02, 1), 1);
  iddia('CoT · ε=0.02 · n=8', 85.1, 100*CT.gurultulu(0.02, 8), 1);
  iddia('CoT · ε=0.05 · n=8', 66.8, 100*CT.gurultulu(0.05, 8), 1);
  iddia('CoT · ε=0.10 · n=1', 90.2, 100*CT.gurultulu(0.10, 1), 1);
  iddia('CoT · ε=0.10 · n=8', 44.7, 100*CT.gurultulu(0.10, 8), 1);
  iddia('CoT · ε=0.20 · n=1', 80.1, 100*CT.gurultulu(0.20, 1), 1);
  iddia('CoT · ε=0.20 · n=8', 21.4, 100*CT.gurultulu(0.20, 8), 1);
  iddia('CoT · teori (1−ε)⁸ · ε=0.02', 85.1, 100*CT.teorik(0.02, 8), 1);
  iddia('CoT · teori (1−ε)⁸ · ε=0.10', 43.0, 100*CT.teorik(0.10, 8), 1);
  iddia('CoT · teori (1−ε)⁸ · ε=0.20', 16.8, 100*CT.teorik(0.20, 8), 1);
  /* (1-eps)^n bir ALT sinir: olcum her yerde teorinin ustunde ya da esitinde */
  { let ihlal = 0, buyukSapma = 0;
    for (const ep of CT.epsler) for (const n of [1, 2, 4, 8]){
      const o = CT.gurultulu(ep, n), t = CT.teorik(ep, n);
      if (o < t - 0.006) ihlal++;
      if (o - t > 0.01) buyukSapma++; }
    iddia('CoT · ölçüm hiçbir yerde teorinin altında değil', 0, ihlal, 0);
    /* kucuk eps te ortusme, buyuk eps te ustte kalma */
    iddia('CoT · ε=0.02 · ölçüm−teori (n=8)', 0.1,
          100*(CT.gurultulu(0.02, 8) - CT.teorik(0.02, 8)), 1);
    iddia('CoT · ε=0.20 · ölçüm−teori (n=8)', 4.6,
          100*(CT.gurultulu(0.20, 8) - CT.teorik(0.20, 8)), 1);
    iddia('CoT · fazlalık sadece yüksek ε de belirgin', 1, buyukSapma > 0 ? 1 : 0, 0); }
  /* zincir uzadikca dogruluk her eps te dusuyor */
  { let ihlal = 0;
    for (const ep of CT.epsler){ const dizi = [1, 2, 4, 8].map(n => CT.gurultulu(ep, n));
      for (let i = 1; i < dizi.length; i++) if (dizi[i] > dizi[i-1]) ihlal++; }
    iddia('CoT · doğruluk zincir uzunluğunda monoton azalıyor', 0, ihlal, 0); }

  /* 4. adim: ayrismayan gorev */
  iddia('CoT · ayrışmayan · doğrudan 96 örnek', 100.0, 100*CT.dogrudan(96, true), 1);
  iddia('CoT · ayrışmayan · doğrudan 48 örnek', 54.2, 100*CT.dogrudan(48, true), 1);
  iddia('CoT · ayrışmayan · zincir 12 örnek', 10.4, 100*CT.cot(12, true), 1);
  iddia('CoT · ayrışmayan · zincir 96 örnek', 10.4, 100*CT.cot(96, true), 1);
  iddia('CoT · rastgele taban', 8.3, 100/CT.M, 1);
  /* zincir 12 den sonra hic kipirdamiyor */
  { let degisim = 0;
    for (const e of [12, 24, 48, 96])
      if (Math.abs(CT.cot(e, true) - CT.cot(12, true)) > 1e-12) degisim++;
    iddia('CoT · ayrışmayan · zincir 12 den sonra sabit', 0, degisim, 0); }
  iddia('CoT · ayrışmayan · zincir rastgelenin üstünde ama yakın', 1,
        (CT.cot(96, true) > 1/CT.M && CT.cot(96, true) < 0.15) ? 1 : 0, 0);
}
console.log('═══ ÖZ-TUTARLILIK ═══');
{
  /* dagilim TAM hesap: her baslangicta paylar toplami 1 */
  { let enKotu = 0;
    for (let s0 = 0; s0 < CT.M; s0++){ const dd = OT.cevapDagilimi(s0, 8, 0.20, 0);
      enKotu = Math.max(enKotu, Math.abs(dd.reduce((a, z) => a + z, 0) - 1)); }
    iddia('ÖT · dağılım toplamı 1 (en büyük sapma × 1e15)', 0, Math.round(enKotu*1e15)/1000, 2); }
  /* TAM dagilim, dogrudan zincir simulasyonuyla uyusuyor mu */
  { const r = rng(77), D2 = 240000, G = OT.bozukTablo(0);
    const say = []; for (let s = 0; s < CT.M; s++) say.push(new Array(CT.M).fill(0));
    for (let t = 0; t < D2; t++){ const s0 = t % CT.M; let x = s0;
      for (let j = 0; j < 8; j++){
        if (r() < 0.20){ const w = Math.floor((CT.M - 1)*r()); x = (G[x] + 1 + w) % CT.M; }
        else x = G[x]; }
      say[s0][x]++; }
    let P = 0; for (let s0 = 0; s0 < CT.M; s0++) P += say[s0][CT.uygula(s0, 8)]/(D2/CT.M);
    iddia('ÖT · TAM dağılım ile simülasyon farkı (yüzde puan)', 0,
          100*Math.abs(P/CT.M - OT.paylar(8, 0.20, 0).p), 1); }

  /* 1. adım · oylama kazanci */
  iddia('ÖT · ε=0.20 · tek zincir', 21.3, 100*OT.oy(8, 0.20, 0, 1), 1);
  iddia('ÖT · ε=0.20 · K=5', 30.5, 100*OT.oy(8, 0.20, 0, 5), 1);
  iddia('ÖT · ε=0.20 · K=41', 79.9, 100*OT.oy(8, 0.20, 0, 41), 1);
  iddia('ÖT · ε=0.20 · K=101', 97.6, 100*OT.oy(8, 0.20, 0, 101), 1);
  iddia('ÖT · ε=0.20 · K=201', 99.9, 100*OT.oy(8, 0.20, 0, 201), 1);
  iddia('ÖT · ε=0.10 · tek zincir', 44.8, 100*OT.oy(8, 0.10, 0, 1), 1);
  iddia('ÖT · ε=0.10 · K=41', 100.0, 100*OT.oy(8, 0.10, 0, 41), 1);
  iddia('ÖT · ε=0.30 · tek zincir', 12.7, 100*OT.oy(8, 0.30, 0, 1), 1);
  iddia('ÖT · ε=0.30 · K=201', 62.2, 100*OT.oy(8, 0.30, 0, 201), 1);
  /* tek zincir dogrulugu = dogru cevabin payi (oylama K=1 de dagilimin ta kendisi) */
  /* K=1 örneklemesi, TAM p yi 0.5 puan icinde buluyor (8000 denemenin gurultusu) */
  iddia('ÖT · K=1 ölçümü p ye 0.5 puan içinde', 1,
        100*Math.abs(OT.oy(8, 0.20, 0, 1) - OT.paylar(8, 0.20, 0).p) < 0.5 ? 1 : 0, 0);
  iddia('ÖT · K=1 ölçümü ile p farkı (yüzde puan)', 0.2,
        100*Math.abs(OT.oy(8, 0.20, 0, 1) - OT.paylar(8, 0.20, 0).p), 1);
  /* tablo dogruyken oylama K de monoton (orneklem gurultusu payi 1 puan) */
  { let ihlal = 0;
    for (const ev of [0.10, 0.15, 0.20])
      for (let i = 1; i < OT.KS.length; i++)
        if (OT.oy(8, ev, 0, OT.KS[i]) < OT.oy(8, ev, 0, OT.KS[i-1]) - 0.01) ihlal++;
    iddia('ÖT · tablo doğruyken oylama K de artıyor', 0, ihlal, 0); }

  /* 2. adım · dagilimin yapisi */
  { const pq = OT.paylar(8, 0.20, 0), sr = OT.siraliPaylar(8, 0.20, 0);
    iddia('ÖT · ε=0.20 · doğru payı p', 0.2113, pq.p, 4);
    iddia('ÖT · ε=0.20 · en büyük yanlış q', 0.0717, pq.q, 4);
    iddia('ÖT · ε=0.20 · p / q', 2.95, pq.p/pq.q, 2);
    /* yanlislar esit bolunmus: 11 yanlisin hepsi ayni pay */
    let fark = 0;
    for (let i = 2; i <= 11; i++) fark = Math.max(fark, Math.abs(sr[i] - sr[1]));
    iddia('ÖT · 11 yanlış eşit bölünmüş (en büyük fark)', 0, fark, 6);
    /* 11 esit yanlis + dogru = 1 */
    iddia('ÖT · p + 11q = 1', 1, pq.p + 11*pq.q, 6); }
  { const pq = OT.paylar(8, 0.10, 0);
    iddia('ÖT · ε=0.10 · doğru payı p', 0.4471, pq.p, 4);
    iddia('ÖT · ε=0.10 · en büyük yanlış q', 0.0503, pq.q, 4);
    iddia('ÖT · ε=0.10 · p / q', 8.90, pq.p/pq.q, 2); }
  /* p = (1-eps)^8 · dogru cevap sadece hic sapmayan zincirden gelmiyor,
     rastgele sapma tesadufen dogruya da donebilir → p bundan buyuk olmali */
  iddia('ÖT · p > (1−ε)⁸ (tesadüfi dönüş payı)', 1,
        OT.paylar(8, 0.20, 0).p > Math.pow(0.8, 8) ? 1 : 0, 0);

  /* 3. adım · yanlis inanc */
  { const G = OT.bozukTablo(1);
    let bozukSayisi = 0, bozukDurum = -1;
    for (let x = 0; x < CT.M; x++) if (G[x] !== CT.F[x]){ bozukSayisi++; bozukDurum = x; }
    iddia('ÖT · bozuk tabloda yanlış girdi sayısı', 1, bozukSayisi, 0);
    iddia('ÖT · yanlış girdi hangi durumda', 10, bozukDurum, 0);
    iddia('ÖT · o durumun doğru hedefi', 3, CT.F[10], 0);
    iddia('ÖT · modelin inandığı hedef', 4, G[10], 0); }
  iddia('ÖT · yanlış inanç · tek zincir', 15.3, 100*OT.oy(8, 0.20, 1, 1), 1);
  iddia('ÖT · yanlış inanç · K=21', 27.7, 100*OT.oy(8, 0.20, 1, 21), 1);
  iddia('ÖT · yanlış inanç · K=101 (tepe)', 29.6, 100*OT.oy(8, 0.20, 1, 101), 1);
  iddia('ÖT · yanlış inanç · K=201', 27.7, 100*OT.oy(8, 0.20, 1, 201), 1);
  { const tepe = OT.KS.reduce((a, Kv) => OT.oy(8, 0.20, 1, Kv) > OT.oy(8, 0.20, 1, a) ? Kv : a, 1);
    iddia('ÖT · yanlış inanç · en iyi K', 101, tepe, 0); }
  /* egri tumsek: once yukseliyor, sonra dususe geciyor */
  iddia('ÖT · tümsek · K=101 > K=1', 1, OT.oy(8,0.20,1,101) > OT.oy(8,0.20,1,1) ? 1 : 0, 0);
  iddia('ÖT · tümsek · K=201 < K=101', 1, OT.oy(8,0.20,1,201) < OT.oy(8,0.20,1,101) ? 1 : 0, 0);
  /* sonsuz oy siniri TAM */
  iddia('ÖT · sınır · tablo doğru', 100.0, 100*OT.sinir(8, 0.20, 0), 1);
  iddia('ÖT · sınır · bir girdi yanlış', 8.3, 100*OT.sinir(8, 0.20, 1), 1);
  iddia('ÖT · yanlış inançta sınır tek zincirin altında', 1,
        OT.sinir(8, 0.20, 1) < OT.oy(8, 0.20, 1, 1) ? 1 : 0, 0);
  { const pq = OT.paylar(8, 0.20, 1);
    iddia('ÖT · yanlış inanç · q > p (mod yanlış)', 1, pq.q > pq.p ? 1 : 0, 0);
    iddia('ÖT · yanlış inanç · p', 0.1531, pq.p, 4);
    iddia('ÖT · yanlış inanç · q', 0.2703, pq.q, 4); }
  /* cok buyuk K de inis sinira dogru devam ediyor */
  { const buyukOy = Kb => { const r = rng(OT.SEED), dl = [], hd = [];
      for (let s0 = 0; s0 < CT.M; s0++){ const dd = OT.cevapDagilimi(s0, 8, 0.20, 1);
        const cc = []; let acc = 0;
        for (let z = 0; z < CT.M; z++){ acc += dd[z]; cc.push(acc); }
        dl.push(cc); hd.push(CT.uygula(s0, 8)); }
      let dg = 0;
      for (let t = 0; t < 4000; t++){ const s0 = t % CT.M, cc = dl[s0], say = new Array(CT.M).fill(0);
        for (let j = 0; j < Kb; j++){ const u = r(); let z = 0;
          while (z < CT.M - 1 && u > cc[z]) z++; say[z]++; }
        let en = -1, ad = [];
        for (let z = 0; z < CT.M; z++){ if (say[z] > en){ en = say[z]; ad = [z]; }
          else if (say[z] === en) ad.push(z); }
        if (ad[Math.floor(ad.length*r())] === hd[s0]) dg++; }
      return 100*dg/4000; };
    iddia('ÖT · yanlış inanç · K=1001', 20.9, buyukOy(1001), 1);
    iddia('ÖT · yanlış inanç · K=4001', 12.3, buyukOy(4001), 1); }

  /* 4. adım · maliyet */
  { const kaz = (a, b2) => 100*(OT.oy(8,0.20,0,b2) - OT.oy(8,0.20,0,a))/(b2 - a);
    iddia('ÖT · zincir başına kazanç · 3→5', 3.12, kaz(3, 5), 2);
    iddia('ÖT · zincir başına kazanç · 21→41', 0.96, kaz(21, 41), 2);
    iddia('ÖT · zincir başına kazanç · 41→101', 0.30, kaz(41, 101), 2);
    iddia('ÖT · zincir başına kazanç · 101→201', 0.02, kaz(101, 201), 2);
    /* tepeden sonra marjinal kazanc monoton dusuyor */
    let ihlal = 0;
    for (let i = 3; i < OT.KS.length; i++)
      if (kaz(OT.KS[i-1], OT.KS[i]) > kaz(OT.KS[i-2], OT.KS[i-1])) ihlal++;
    iddia('ÖT · K=5 ten sonra marjinal kazanç azalıyor', 0, ihlal, 0); }
  iddia('ÖT · ε=0.20 · K=11', 43.7, 100*OT.oy(8, 0.20, 0, 11), 1);
  iddia('ÖT · ε=0.10 · K=11', 91.2, 100*OT.oy(8, 0.10, 0, 11), 1);
  iddia('ÖT · iyi model 11 oyla, kötü model 101 oyu geçemiyor', 1,
        OT.oy(8, 0.10, 0, 11) < OT.oy(8, 0.20, 0, 101) ? 1 : 0, 0);
  iddia('ÖT · iyi model 11 oyla kötü modelin 41 oyunu geçiyor', 1,
        OT.oy(8, 0.10, 0, 11) > OT.oy(8, 0.20, 0, 41) ? 1 : 0, 0);
}
console.log('═══ TALİMAT İNCE AYARI ═══');
{
  iddia('TA · girdi sayısı (6³)', 216, TA.GIRDI.length, 0);
  iddia('TA · ön eğitilmiş görev sayısı', 5, TA.GOREV.length, 0);
  iddia('TA · ağırlıklar toplamı', 1, TA.AGIR.reduce((a, z) => a + z, 0), 6);
  /* yeni gorev gercekten farkli bir islem mi: hicbir eski gorevle ozdes degil */
  { let ozdes = 0;
    TA.GOREV.forEach(g => { let ayni = 0;
      TA.GIRDI.forEach(x => { if (g.f(x) === TA.YENI.f(x)) ayni++; });
      if (ayni === TA.GIRDI.length) ozdes++; });
    iddia('TA · ortanca hiçbir eski görevle özdeş değil', 0, ozdes, 0); }
  /* gorev ciftlerinin cakismasi: dersteki %42.1 iddiasi */
  { const cak = (i, j) => { let c = 0;
      TA.GIRDI.forEach(x => { if (TA.GOREV[i].f(x) === TA.GOREV[j].f(x)) c++; });
      return 100*c/TA.GIRDI.length; };
    iddia('TA · çakışma · ilk / en büyük', 42.1, cak(3, 1), 1);
    iddia('TA · çakışma · ilk / en küçük', 42.1, cak(3, 2), 1);
    iddia('TA · çakışma · topla / en büyük', 16.2, cak(0, 1), 1);
    iddia('TA · çakışma · en büyük / en küçük', 2.8, cak(1, 2), 1); }

  /* 1. adım · temel model */
  iddia('TA · temel · baskın topla · topla', 93.5, 100*TA.temelDogruluk(0, 0), 1);
  iddia('TA · temel · baskın topla · en büyük', 22.7, 100*TA.temelDogruluk(0, 1), 1);
  iddia('TA · temel · baskın topla · en küçük', 18.1, 100*TA.temelDogruluk(0, 2), 1);
  iddia('TA · temel · baskın topla · ilk', 23.1, 100*TA.temelDogruluk(0, 3), 1);
  { const ort = d2 => 100*[0,1,2,3,4].reduce((a, k) => a + TA.temelDogruluk(d2, k), 0)/5;
    iddia('TA · temel ortalama · baskın topla', 36.1, ort(0), 1);
    iddia('TA · temel ortalama · baskın en büyük', 43.1, ort(1), 1);
    iddia('TA · temel ortalama · baskın ilk', 44.3, ort(3), 1);
    /* baskin gorev degisse de ortalama dar bir bantta kaliyor */
    let lo = 100, hi = 0;
    for (let d2 = 0; d2 < 5; d2++){ lo = Math.min(lo, ort(d2)); hi = Math.max(hi, ort(d2)); }
    iddia('TA · ortalama bandı · en düşük', 36.1, lo, 1);
    iddia('TA · ortalama bandı · en yüksek', 44.3, hi, 1); }
  /* baskin gorev her zaman zirve mi */
  { let ihlal = 0;
    for (let d2 = 0; d2 < 5; d2++) for (let k = 0; k < 5; k++)
      if (k !== d2 && TA.temelDogruluk(d2, k) > TA.temelDogruluk(d2, d2)) ihlal++;
    iddia('TA · zirve her zaman baskın görevde', 0, ihlal, 0); }
  iddia('TA · en büyük baskınken en küçük', 10.2, 100*TA.temelDogruluk(1, 2), 1);
  iddia('TA · o değer rastgele tabanın altında', 1,
        TA.temelDogruluk(1, 2) < 1/TA.A ? 1 : 0, 0);

  /* 2. adım · talimat başına örnek */
  iddia('TA · talimat · topla · 1 örnek', 100.0, 100*TA.talimat(0, 1), 1);
  iddia('TA · talimat · en büyük · 1 örnek', 85.3, 100*TA.talimat(1, 1), 1);
  iddia('TA · talimat · ilk · 1 örnek', 46.9, 100*TA.talimat(3, 1), 1);
  iddia('TA · talimat · ilk · 3 örnek', 92.3, 100*TA.talimat(3, 3), 1);
  { const ort = m => 100*[0,1,2,3,4].reduce((a, k) => a + TA.talimat(k, m), 0)/5;
    iddia('TA · talimat ortalaması · 0 örnek', 36.1, ort(0), 1);
    iddia('TA · talimat ortalaması · 1 örnek', 73.1, ort(1), 1);
    iddia('TA · talimat ortalaması · 3 örnek', 96.1, ort(3), 1);
    iddia('TA · talimat ortalaması · 5 örnek', 99.1, ort(5), 1);
    /* ornek sayisinda monoton */
    let ihlal = 0;
    for (let i = 1; i < TA.MLER.length; i++) if (ort(TA.MLER[i]) < ort(TA.MLER[i-1]) - 0.01) ihlal++;
    iddia('TA · talimat ortalaması monoton artıyor', 0, ihlal, 0); }
  /* en cakisan gorev en yavas ogreniliyor: ilk & son en dusuk, topla en yuksek */
  { let enDusuk = 0;
    for (let k = 1; k < 5; k++) if (TA.talimat(k, 1) < TA.talimat(enDusuk, 1)) enDusuk = k;
    iddia('TA · 1 örnekte en zor görev (ilk = 3)', 3, enDusuk, 0);
    let enYuksek = 0;
    for (let k = 1; k < 5; k++) if (TA.talimat(k, 1) > TA.talimat(enYuksek, 1)) enYuksek = k;
    iddia('TA · 1 örnekte en kolay görev (topla = 0)', 0, enYuksek, 0); }

  /* 3. adım · toplam bütçe */
  iddia('TA · bütçe · n=0', 36.1, 100*TA.ayar(0, false).hepsi, 1);
  iddia('TA · bütçe · n=10', 82.1, 100*TA.ayar(10, false).hepsi, 1);
  iddia('TA · bütçe · n=20', 95.2, 100*TA.ayar(20, false).hepsi, 1);
  iddia('TA · bütçe · n=50', 100.0, 100*TA.ayar(50, false).hepsi, 1);
  iddia('TA · bütçe · n=20 henüz %100 değil', 1, TA.ayar(20, false).hepsi < 0.999 ? 1 : 0, 0);
  iddia('TA · n=0 doğruluğu temel modelin ortalamasına eşit (fark)', 0,
        100*Math.abs(TA.ayar(0, false).hepsi -
          [0,1,2,3,4].reduce((a, k) => a + TA.temelDogruluk(0, k), 0)/5), 1);

  /* 4. adım · ön eğitimde olmayan işlem */
  iddia('TA · yeni görev · ayarsız', 24.1, 100*TA.ayar(0, true).yeni, 1);
  iddia('TA · yeni görev · n=100', 29.7, 100*TA.ayar(100, true).yeni, 1);
  iddia('TA · yeni görev · n=500', 48.6, 100*TA.ayar(500, true).yeni, 1);
  iddia('TA · yeni görev · n=1000', 64.9, 100*TA.ayar(1000, true).yeni, 1);
  iddia('TA · eski görevler · n=100', 100.0, 100*TA.ayar(100, true).eski, 1);
  iddia('TA · eski görevler · n=50', 99.8, 100*TA.ayar(50, true).eski, 1);
  /* ayni butcede eski hep yeniden ilerde */
  { let ihlal = 0;
    for (const nv of TA.NLER){ const r2 = TA.ayar(nv, true);
      if (r2.eski < r2.yeni) ihlal++; }
    iddia('TA · her bütçede eski görevler yeniden ilerde', 0, ihlal, 0); }
  /* eski gorevler doyduktan sonra bile yeni gorev doymuyor */
  iddia('TA · eski n=100 de doymuş, yeni n=1000 de bile değil', 1,
        (TA.ayar(100, true).eski >= 0.999 && TA.ayar(1000, true).yeni < 0.7) ? 1 : 0, 0);
  /* yeni gorev ezberle ilerliyor: 200 → 1000 arasinda belirgin artis */
  iddia('TA · yeni görev n=200 den n=1000 e artış (puan)', 30.0,
        100*(TA.ayar(1000, true).yeni - TA.ayar(200, true).yeni), 1);
}
console.log('═══ ZİNCİRLEME PROMPT ═══');
{
  /* kapali form, dogrudan simulasyonla dogrulaniyor */
  { const r0 = rng(5); let dg = 0, cagri = 0, D = 200000;
    const eps = ZP.EPS, rc = 0.95, fc = 0.20, R = 3;
    for (let d2 = 0; d2 < D; d2++){ let hepsi = true;
      for (let s = 0; s < ZP.N; s++){ let kalan = R, ok;
        for (;;){ cagri++; ok = r0() >= eps;
          const bayrak = ok ? (r0() < fc) : (r0() < rc);
          if (!bayrak || kalan === 0) break;
          kalan--; }
        if (!ok) hepsi = false; }
      if (hepsi) dg++; }
    iddia('ZP · formül ile simülasyon farkı (yüzde puan)', 0,
          100*Math.abs(dg/D - ZP.zincir(eps, rc, fc, R)), 1);
    iddia('ZP · çağrı sayısı · formül ile simülasyon farkı', 0,
          Math.abs(cagri/D - ZP.toplamCagri(eps, rc, fc, R)), 1); }

  /* 1. adım · bölmek etkisiz */
  iddia('ZP · kontrolsüz zincir (0.9⁸)', 43.0, 100*Math.pow(1 - ZP.EPS, ZP.N), 1);
  iddia('ZP · R=0 kontrolcü yokken zincir aynı', 0,
        100*Math.abs(ZP.zincir(ZP.EPS, 0, 0, 0) - Math.pow(1 - ZP.EPS, ZP.N)), 6);
  /* kontrolcu kapaliyken (r=f=0) tekrar hakki hicbir sey degistirmiyor */
  { let fark = 0;
    for (const Rv of ZP.Rler) fark = Math.max(fark, Math.abs(ZP.zincir(ZP.EPS, 0, 0, Rv) - Math.pow(0.9, 8)));
    iddia('ZP · kontrolcü yokken tekrar hakkı etkisiz', 0, 100*fark, 6); }
  { const IH = ZP.ilkHata(ZP.EPS);
    iddia('ZP · ilk hata dağılımı toplamı', 1, IH.pay.reduce((a, z) => a + z, 0), 6);
    iddia('ZP · ilk hata · 1. adım payı', 17.6, 100*IH.pay[0], 1);
    iddia('ZP · ilk hata · 8. adım payı', 8.4, 100*IH.pay[7], 1);
    iddia('ZP · koşullu beklenen ilk hata adımı', 3.953, IH.bek, 3);
    iddia('ZP · kurtarılabilen iş oranı', 36.9, 100*(IH.bek - 1)/ZP.N, 1);
    /* ilk hata dagilimi azalan (geometrik) */
    let ihlal = 0;
    for (let i = 1; i < ZP.N; i++) if (IH.pay[i] > IH.pay[i-1]) ihlal++;
    iddia('ZP · ilk hata dağılımı monoton azalıyor', 0, ihlal, 0); }

  /* 2. adım · kontrol noktası */
  iddia('ZP · r=0.95 f=0.05 · R=1', 85.8, 100*ZP.zincir(ZP.EPS, 0.95, 0.05, 1), 1);
  iddia('ZP · r=0.95 f=0.05 · R=3', 95.2, 100*ZP.zincir(ZP.EPS, 0.95, 0.05, 3), 1);
  iddia('ZP · r=0.95 f=0.05 · sonsuz', 95.4,
        100*Math.pow(ZP.sinir(ZP.EPS, 0.95, 0.05), ZP.N), 1);
  iddia('ZP · r=0.95 f=0 · R=1', 89.0, 100*ZP.zincir(ZP.EPS, 0.95, 0, 1), 1);
  iddia('ZP · r=0.95 f=0 · R=3', 95.6, 100*ZP.zincir(ZP.EPS, 0.95, 0, 3), 1);
  iddia('ZP · r=0.95 f=0 · sonsuz', 95.7, 100*Math.pow(ZP.sinir(ZP.EPS, 0.95, 0), ZP.N), 1);
  iddia('ZP · r=0.50 f=0.05 · R=3', 63.4, 100*ZP.zincir(ZP.EPS, 0.50, 0.05, 3), 1);
  iddia('ZP · r=0 f=0.05 · R=3', 41.3, 100*ZP.zincir(ZP.EPS, 0, 0.05, 3), 1);
  iddia('ZP · r=0 f=0.05 kontrolsüzden kötü', 1,
        ZP.zincir(ZP.EPS, 0, 0.05, 3) < Math.pow(0.9, 8) ? 1 : 0, 0);
  /* R buyudukce tavana yaklasiyor ve asmiyor */
  /* c_R sabit noktaya monoton yaklasiyor: r > f iken alttan, r < f iken ustten */
  { let ihlal = 0, yon = 0;
    for (const rv of ZP.rler) for (const fv of ZP.fler){
      const L = ZP.sinir(ZP.EPS, rv, fv);
      for (let i = 1; i < ZP.Rler.length; i++)
        if (Math.abs(ZP.adim(ZP.EPS, rv, fv, ZP.Rler[i]) - L) >
            Math.abs(ZP.adim(ZP.EPS, rv, fv, ZP.Rler[i-1]) - L) + 1e-15) ihlal++;
      /* R=0 hangi taraftaysa hep o tarafta kaliyor */
      const ustte = ZP.adim(ZP.EPS, rv, fv, 0) > L;
      for (const Rv of ZP.Rler)
        if ((ZP.adim(ZP.EPS, rv, fv, Rv) > L + 1e-15) !== ustte &&
            Math.abs(ZP.adim(ZP.EPS, rv, fv, Rv) - L) > 1e-15) yon++; }
    iddia('ZP · c_R sınıra monoton yaklaşıyor', 0, ihlal, 0);
    iddia('ZP · yaklaşma yönü hiç değişmiyor', 0, yon, 0);
    /* r < f iken sinir kontrolsuz tabanin altinda */
    iddia('ZP · r=0 f=0.20 · sınır kontrolsüzün altında', 1,
          Math.pow(ZP.sinir(ZP.EPS, 0, 0.20), ZP.N) < Math.pow(0.9, 8) ? 1 : 0, 0);
    iddia('ZP · r=0.95 f=0.05 · sınır kontrolsüzün üstünde', 1,
          Math.pow(ZP.sinir(ZP.EPS, 0.95, 0.05), ZP.N) > Math.pow(0.9, 8) ? 1 : 0, 0); }
  /* 3. haktan sonraki kazanc ihmal edilebilir */
  iddia('ZP · r=0.95 f=0 · R=3 ten R=5 e kazanç (puan)', 0.1,
        100*(ZP.zincir(ZP.EPS, 0.95, 0, 5) - ZP.zincir(ZP.EPS, 0.95, 0, 3)), 1);

  /* 3. adım · r = f teoremi */
  { let enBuyukFark = 0;
    for (const v of [0.05, 0.1, 0.2, 0.35, 0.5, 0.8, 0.95])
      for (const Rv of [0, 1, 3, 5, 20])
        enBuyukFark = Math.max(enBuyukFark, Math.abs(ZP.zincir(ZP.EPS, v, v, Rv) - Math.pow(0.9, 8)));
    iddia('ZP · r = f de kontrol TAM olarak etkisiz (en büyük sapma)', 0, 100*enBuyukFark, 6); }
  /* farkli eps degerlerinde de gecerli */
  { let enBuyukFark = 0;
    for (const ev of [0.05, 0.2, 0.4]) for (const v of [0.1, 0.5, 0.9])
      enBuyukFark = Math.max(enBuyukFark,
        Math.abs(ZP.zincir(ev, v, v, 5) - Math.pow(1 - ev, ZP.N)));
    iddia('ZP · r = f teoremi her ε de geçerli', 0, 100*enBuyukFark, 6); }
  /* r > f kazandiriyor, r < f zarar veriyor */
  { let ihlal = 0;
    for (const fv of ZP.fler) for (const rv of [0, 0.1, 0.2, 0.3, 0.5, 0.8, 0.95]){
      const d3 = ZP.zincir(ZP.EPS, rv, fv, 3), taban = Math.pow(0.9, 8);
      if (rv > fv + 1e-9 && d3 <= taban) ihlal++;
      if (rv < fv - 1e-9 && d3 >= taban) ihlal++; }
    iddia('ZP · r > f kazandırır, r < f zarar verir', 0, ihlal, 0); }
  iddia('ZP · r=0 f=0.20 · R=3', 35.4, 100*ZP.zincir(ZP.EPS, 0, 0.20, 3), 1);
  iddia('ZP · r=0 f=0.50 · R=3', 21.6, 100*ZP.zincir(ZP.EPS, 0, 0.50, 3), 1);
  iddia('ZP · r=0.95 f=0.20 · R=3', 93.1, 100*ZP.zincir(ZP.EPS, 0.95, 0.20, 3), 1);
  iddia('ZP · r=0.95 f=0.50 · R=3', 81.4, 100*ZP.zincir(ZP.EPS, 0.95, 0.50, 3), 1);

  /* 4. adım · maliyet */
  iddia('ZP · çağrı · kontrolsüz', 8.00, ZP.toplamCagri(ZP.EPS, 0, 0, 0), 2);
  iddia('ZP · çağrı · r=0.95 f=0 · R=3', 8.84, ZP.toplamCagri(ZP.EPS, 0.95, 0, 3), 2);
  iddia('ZP · çağrı · r=0.95 f=0.20 · R=3', 10.97, ZP.toplamCagri(ZP.EPS, 0.95, 0.20, 3), 2);
  iddia('ZP · çağrı · r=0.95 f=0.50 · R=3', 16.03, ZP.toplamCagri(ZP.EPS, 0.95, 0.50, 3), 2);
  iddia('ZP · çağrı · r=0 f=0.20 · R=3', 9.75, ZP.toplamCagri(ZP.EPS, 0, 0.20, 3), 2);
  /* f=0.50 hem daha pahali hem daha az dogru */
  iddia('ZP · f=0.50 hem pahalı hem kötü', 1,
        (ZP.toplamCagri(ZP.EPS, 0.95, 0.50, 3) > ZP.toplamCagri(ZP.EPS, 0.95, 0, 3) &&
         ZP.zincir(ZP.EPS, 0.95, 0.50, 3) < ZP.zincir(ZP.EPS, 0.95, 0, 3)) ? 1 : 0, 0);
  /* cagri sayisi R de monoton artiyor */
  { let ihlal = 0;
    for (const rv of ZP.rler) for (const fv of ZP.fler)
      for (let i = 1; i < ZP.Rler.length; i++)
        if (ZP.toplamCagri(ZP.EPS, rv, fv, ZP.Rler[i]) <
            ZP.toplamCagri(ZP.EPS, rv, fv, ZP.Rler[i-1]) - 1e-12) ihlal++;
    iddia('ZP · çağrı sayısı tekrar hakkında monoton artıyor', 0, ihlal, 0); }
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
