const fs=require('fs');
// sahte canvas 2D bağlamı — her çağrıyı sayar, patlarsa yakalar
function sahteCtx(){
  const c={_c:0};
  const noop=()=>{c._c++};
  ['fillRect','strokeRect','beginPath','moveTo','lineTo','arc','ellipse','closePath','fill','stroke',
   'save','restore','translate','rotate','scale','setLineDash','fillText','setTransform','roundTo',
   'bezierCurveTo','quadraticCurveTo','clearRect','roundRect','clip','putImageData','drawImage',
   'rect','arcTo','arcTo','clip'].forEach(m=>c[m]=noop);
  c.createLinearGradient=()=>({addColorStop:noop});
  c.createRadialGradient=()=>({addColorStop:noop});
  c.createImageData=(w,h)=>({data:new Uint8ClampedArray(w*h*4)});
  c.measureText=()=>({width:10});
  return c;
}
const V=fs.readFileSync('./viz.js','utf8');
const C=fs.readFileSync('./content.js','utf8');
eval(V + C + `
const el={width:0,height:0,getContext:()=>sahteCtx()};
useCanvas(el,1500,700);
let ok=0,pat=0;
console.log('═══ GÖRSEL ÇİZİM TESTİ ═══');
// her dersin her adımını, gerçek state'iyle çiz
Object.entries(DERSLER).forEach(([id,d])=>{
  d.adimlar.forEach((a,i)=>{
    const yer=id+'['+(i+1)+']';
    const durumlar=[];
    if(a.kind==='phases') a.phases.forEach(p=>durumlar.push({...(a.state||{}),...(p.state||{})}));
    else if(a.kind==='play'){ const F=a.frames();
      [0,Math.floor(F.length/2),F.length-1].forEach(k=>durumlar.push({...(a.state||{}),...(F[k].state||{})})); }
    else { const st={...(a.state||{})}; (a.controls||[]).forEach(c=>st[c.k]=c.val);
      durumlar.push(st);
      (a.controls||[]).forEach(c=>{ durumlar.push({...st,[c.k]:c.min}); durumlar.push({...st,[c.k]:c.max}); }); }
    durumlar.forEach((st,k)=>{
      let s2={...st};
      try{
        if(a.derive) s2={...s2,_d:a.derive(s2),...a.derive(s2)};
        useCanvas(el,1500,a.h||700);
        VIZ[a.viz](s2);
        if(a.live) a.live(s2);
        ok++;
      }catch(e){ console.log('  ✗ '+yer+' durum#'+k+' → '+e.message); pat++; }
    });
  });
});
console.log('  başarılı çizim: '+ok+'   ·   patlayan: '+pat);
// tüm VIZ'leri de tek tek dene
console.log('\\n═══ TÜM WIDGET\\'LAR ═══');
const ornek={
  tablo:{col:1},tabloGrafik:{t:0.5},dogruUydur:{w:7,b:20,artik:true,kare:true,mseGoster:true},
  ezberKural:{yeni:6.5},kayipHarita:{w:8,b:20,gradyan:true,yol:[[12,42],[8,20]]},
  esik:{mod:'both',t:5,T:0.6,turev:true,noktalar:true},agac:{t:5,T:0.6,x:5.4},
  polinom:{derece:5,test:true,gercek:true},sirala:{dizi:[5,2,8,1],a:0,b:1,takas:true,mesaj:'x'},
  noron:{girdi:[6,7,3.5],agirlik:[.8,.35,-.6],bias:-1.2,faz:4},
  attention:{tokenlar:['a','b','c'],q:1,faz:4,skor:[1,2,3]},
  arama:{k:5},turOzet:{tur:3},
  agEgitim:(()=>{const F=agEgitimKareleri();return{...F[5],tarih:[1,.5,.2]};})(),
  geriYayilim:{faz:5},kmeans:kmeansKareler('iyi')[3],evrisim:{k:50},
  metrik:{esik:0.5},bolme:{mod:'kfold',kat:3},sizinti:{faz:2},sinir:{aci:45,kaydir:0},
  agacKur:{derinlik:4},bolunmeAra:{oz:1,t:3.95},orman:{nAgac:12},boost:{adim:15},knn:{k:5,qx:5,qy:5},
};
let w1=0,w2=0;
Object.keys(VIZ).forEach(k=>{
  try{ useCanvas(el,1500,800); VIZ[k](ornek[k]||{}); w1++; }
  catch(e){ console.log('  ✗ VIZ.'+k+' → '+e.message); w2++; }
});
console.log('  çizilen widget: '+w1+' / '+Object.keys(VIZ).length+'   ·   patlayan: '+w2);
console.log('\\n'+(pat+w2===0 ? '  ✓✓  TÜM GÖRSELLER SORUNSUZ ÇİZİLİYOR' : '  ✗ '+(pat+w2)+' sorun var'));
`);
