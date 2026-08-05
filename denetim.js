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
