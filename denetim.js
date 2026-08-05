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
