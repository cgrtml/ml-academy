/* ML Academy · taşma ve çakışma testi
   Sahte canvas her çizimin GERÇEK koordinatını kaydeder, sonra üç şey arar:
     1) tuval sınırlarının dışına taşan metin ve şekiller
     2) üst üste binen metin kutuları
     3) NaN koordinatla çizilen her şey
   Metinlerin tamamı ui-monospace ile çizildiği için genişlik güvenilir tahmin edilir.
   Kullanım: node tasma-testi.js   */
const fs = require('fs');

const ORAN    = 0.6;  // monospace karakter genişliği / punto
const TOL     = 4;    // sınır taşmasında yok sayılan cihaz pikseli (2 mantıksal px)
const CAKISMA = 0.25; // küçük kutunun bu oranından fazlası örtülüyorsa çakışma

const SINIR = { w:3000, h:1400 };
const KAYIT = { metin:[], disari:[], nan:[] };
const RAPOR = { disari:[], cakisma:[], nan:[] };

function sahteCtx(){
  let m = [1,0,0,1,0,0];
  const yigin = [];
  const carp = (a,b) => [
    a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1],
    a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3],
    a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5],
  ];
  const nokta = (x,y) => [ m[0]*x+m[2]*y+m[4], m[1]*x+m[3]*y+m[5] ];
  const kutula = pts => {
    const xs = pts.map(p=>p[0]), ys = pts.map(p=>p[1]);
    return { x0:Math.min(...xs), x1:Math.max(...xs), y0:Math.min(...ys), y1:Math.max(...ys) };
  };
  const gecerli = k => isFinite(k.x0) && isFinite(k.x1) && isFinite(k.y0) && isFinite(k.y1);
  const disarida = k => k.x0 < -TOL || k.y0 < -TOL || k.x1 > SINIR.w+TOL || k.y1 > SINIR.h+TOL;

  const c = {
    font:'22px monospace', textAlign:'start', textBaseline:'alphabetic',
    fillStyle:'#000', strokeStyle:'#000', lineWidth:1, globalAlpha:1, lineCap:'butt', lineJoin:'miter',
  };
  const yok = () => {};
  ['beginPath','closePath','fill','stroke','setLineDash','clip','putImageData','drawImage',
   'arcTo','quadraticCurveTo','bezierCurveTo','clearRect','roundRect','ellipse'].forEach(k => c[k] = yok);

  c.save    = () => { yigin.push(m.slice()); };
  c.restore = () => { if (yigin.length) m = yigin.pop(); };
  c.setTransform = (a,b,cc,d,e,f) => { m = [a,b,cc,d,e,f]; };
  c.translate = (x,y) => { m = carp(m,[1,0,0,1,x,y]); };
  c.scale     = (x,y) => { m = carp(m,[x,0,0,y,0,0]); };
  c.rotate    = r => { const co=Math.cos(r), si=Math.sin(r); m = carp(m,[co,si,-si,co,0,0]); };

  const sekil = (pts, tip) => {
    const k = kutula(pts);
    if (!gecerli(k)) { KAYIT.nan.push(tip); return; }
    if (disarida(k)) KAYIT.disari.push({ tip, ...k, sw:SINIR.w, sh:SINIR.h });
  };

  c.fillRect   = (x,y,w,h) => sekil([nokta(x,y),nokta(x+w,y),nokta(x,y+h),nokta(x+w,y+h)],'fillRect');
  c.strokeRect = (x,y,w,h) => sekil([nokta(x,y),nokta(x+w,y),nokta(x,y+h),nokta(x+w,y+h)],'strokeRect');
  c.rect       = c.fillRect;
  c.arc  = (x,y,r) => sekil([nokta(x-r,y-r),nokta(x+r,y-r),nokta(x-r,y+r),nokta(x+r,y+r)],'arc');
  c.moveTo = (x,y) => sekil([nokta(x,y)],'cizgi');
  c.lineTo = c.moveTo;

  c.fillText = (s,x,y) => {
    s = String(s == null ? '' : s);
    if (!s.length) return;
    const pnt = parseFloat((c.font.match(/(\d+(?:\.\d+)?)px/) || [0,22])[1]) || 22;
    const gen = s.length * pnt * ORAN;
    const al  = c.textAlign;
    const sol = al === 'center' ? -gen/2 : (al === 'right' || al === 'end') ? -gen : 0;
    const ust = -pnt*0.78, alt = pnt*0.22;
    const k = kutula([ nokta(x+sol,y+ust), nokta(x+sol+gen,y+ust),
                       nokta(x+sol,y+alt), nokta(x+sol+gen,y+alt) ]);
    if (!gecerli(k)) { KAYIT.nan.push('metin:'+s); return; }
    KAYIT.metin.push({ s, ...k });
    if (disarida(k)) KAYIT.disari.push({ tip:'metin', s, ...k, sw:SINIR.w, sh:SINIR.h });
  };
  c.strokeText = c.fillText;

  c.createLinearGradient = () => ({ addColorStop:yok });
  c.createRadialGradient = () => ({ addColorStop:yok });
  c.createPattern = () => null;
  c.createImageData = (w,h) => ({ data:new Uint8ClampedArray(Math.max(4, Math.abs(w*h*4)|0)) });
  c.getImageData    = (x,y,w,h) => ({ data:new Uint8ClampedArray(Math.max(4, Math.abs(w*h*4)|0)) });
  c.measureText = s => ({ width: String(s).length * 22 * ORAN });
  return c;
}

function cakismaBul(metinler){
  const out = [];
  for (let i=0;i<metinler.length;i++){
    for (let j=i+1;j<metinler.length;j++){
      const a = metinler[i], b = metinler[j];
      const w = Math.min(a.x1,b.x1) - Math.max(a.x0,b.x0);
      const h = Math.min(a.y1,b.y1) - Math.max(a.y0,b.y0);
      if (w <= 0 || h <= 0) continue;
      const ka = (a.x1-a.x0)*(a.y1-a.y0), kb = (b.x1-b.x0)*(b.y1-b.y0);
      const kucuk = Math.min(ka,kb);
      if (kucuk > 0 && (w*h)/kucuk > CAKISMA) out.push({ a:a.s, b:b.s, oran:(w*h)/kucuk });
    }
  }
  return out;
}

let CTX = sahteCtx();
const DUMP = process.env.DUMP || '';
let DUMPN = 0;

/* Dil seçimi:  node tasma-testi.js        → TR yerleşimi
                DIL=en node tasma-testi.js → EN yerleşimi
   viz.js'teki VDIL localStorage'a bakar. Node'da localStorage yoktu, TR'ye
   düşüyordu, yani İNGİLİZCE YERLEŞİM HİÇ ÖLÇÜLMÜYORDU. İngilizce karşılıklar
   Türkçesinden uzun olduğu için taşmaların bir kısmı yalnızca EN'de çıkıyor.
   EN modunda viz-sozluk.js de yüklenmeli, yoksa CEV() sözlüğü bulamaz ve
   metinler Türkçe uzunlukta ölçülür. */
const DIL = process.env.DIL === 'en' ? 'en' : 'tr';
const localStorage = { getItem: k => k === 'mlacad_dil' ? DIL : null, setItem(){}, removeItem(){} };

const S = DIL === 'en' ? fs.readFileSync('./viz-sozluk.js','utf8') : '';
const V = fs.readFileSync('./viz.js','utf8');
const C = fs.readFileSync('./content.js','utf8');

eval(S + V + C + `
const el = { width:0, height:0, getContext: () => CTX };

function olc(yer, a, st){
  KAYIT.metin.length = 0; KAYIT.disari.length = 0; KAYIT.nan.length = 0;
  /* Tarayıcı ile AYNI varsayılan. Önce 700 yazıyordu, oysa lesson.html
     600 kullanıyor: h yazılmamış adımlar 700'de test edilip 600'de
     çiziliyordu ve taşmalar hiç görünmüyordu. */
  const H = a.h || 600;
  SINIR.w = 1500*2; SINIR.h = H*2;
  CTX = sahteCtx();
  useCanvas(el, 1500, H);
  let s2 = { ...st };
  try {
    if (a.derive) s2 = { ...s2, _d:a.derive(s2), ...a.derive(s2) };
    VIZ[a.viz](s2);
    if (a.live) a.live(s2);
  } catch(e){ return; }   // patlayanlar cizim-testi.js'in işi
  KAYIT.disari.forEach(d => RAPOR.disari.push({ yer, viz:a.viz, ...d }));
  KAYIT.nan.forEach(n => RAPOR.nan.push({ yer, viz:a.viz, n }));
  const cak = cakismaBul(KAYIT.metin);
  cak.forEach(c => RAPOR.cakisma.push({ yer, viz:a.viz, ...c }));
  if (DUMP && yer === DUMP && cak.length){
    console.log('\\n── DÖKÜM ' + yer + ' (durum ' + (++DUMPN) + ', çakışma ' + cak.length + ') ──');
    KAYIT.metin.slice().sort((p,q) => p.y0 - q.y0).forEach(k =>
      console.log('  y ' + String(Math.round(k.y0/2)).padStart(4) + '-' + String(Math.round(k.y1/2)).padEnd(5) +
                  ' x ' + String(Math.round(k.x0/2)).padStart(5) + '-' + String(Math.round(k.x1/2)).padEnd(6) +
                  ' "' + String(k.s).slice(0,54) + '"'));
  }
}

Object.entries(DERSLER).forEach(([id,d]) => {
  d.adimlar.forEach((a,i) => {
    if (!a.viz || !VIZ[a.viz]) return;
    const yer = id + '[' + (i+1) + ']';
    const durumlar = [];
    if (a.kind === 'phases') a.phases.forEach(p => durumlar.push({ ...(a.state||{}), ...(p.state||{}) }));
    else if (a.kind === 'play'){ const F = a.frames();
      [0, Math.floor(F.length/2), F.length-1].forEach(k => durumlar.push({ ...(a.state||{}), ...(F[k].state||{}) })); }
    else { const st = { ...(a.state||{}) }; (a.controls||[]).forEach(c => st[c.k] = c.val);
      durumlar.push(st);
      (a.controls||[]).forEach(c => { durumlar.push({ ...st, [c.k]:c.min }); durumlar.push({ ...st, [c.k]:c.max }); }); }
    durumlar.forEach(st => olc(yer, a, st));
  });
});
`);

const grupla = (arr, anahtar) => {
  const m = new Map();
  arr.forEach(x => { const k = anahtar(x); if (!m.has(k)) m.set(k, { ...x, n:0 }); m.get(k).n++; });
  return [...m.values()];
};
const LIMIT = parseInt(process.env.LIMIT || '40', 10);

console.log('═══ TAŞMA VE ÇAKIŞMA TESTİ · ' + DIL.toUpperCase() + ' ═══\n');

const tumu = grupla(RAPOR.disari, x => x.yer+'|'+x.viz+'|'+x.tip+'|'+(x.s||''));
// çizgi ve arc taşması tuval tarafından kırpılır, görsel hata değil; metin ve dolu kutu gerçek
const d      = tumu.filter(x => x.tip === 'metin' || x.tip === 'fillRect' || x.tip === 'strokeRect');
const kirpik = tumu.filter(x => x.tip === 'cizgi' || x.tip === 'arc');
console.log('── 1 · TUVAL DIŞINA TAŞAN METİN VE KUTU ── ' + d.length + ' benzersiz'
            + '   (ayrıca kırpılan çizgi/daire: ' + kirpik.length + ', görsel hata sayılmaz)');
d.sort((a,b) => b.n - a.n).slice(0,LIMIT).forEach(x => {
  const nerede = [];
  if (x.x0 < -TOL) nerede.push('sol ' + Math.round(-x.x0/2));
  if (x.y0 < -TOL) nerede.push('üst ' + Math.round(-x.y0/2));
  if (x.x1 > x.sw+TOL) nerede.push('sağ ' + Math.round((x.x1-x.sw)/2));
  if (x.y1 > x.sh+TOL) nerede.push('alt ' + Math.round((x.y1-x.sh)/2));
  console.log('  ' + x.yer.padEnd(20) + ' ' + ('VIZ.'+x.viz).padEnd(16) + ' ' +
              x.tip.padEnd(11) + ' ' + nerede.join(', ') + 'px' +
              (x.s ? '   "' + String(x.s).slice(0,40) + '"' : ''));
});
if (d.length > LIMIT) console.log('  ... ve ' + (d.length-LIMIT) + ' tane daha');

const c = grupla(RAPOR.cakisma, x => x.yer+'|'+x.viz+'|'+x.a+'|'+x.b);
console.log('\n── 2 · ÜST ÜSTE BİNEN METİN ── ' + c.length + ' benzersiz');
c.sort((a,b) => b.oran - a.oran).slice(0,LIMIT).forEach(x => {
  console.log('  ' + x.yer.padEnd(20) + ' ' + ('VIZ.'+x.viz).padEnd(16) +
              ' %' + String(Math.round(x.oran*100)).padStart(3) + '  "' +
              String(x.a).slice(0,28) + '" ↔ "' + String(x.b).slice(0,28) + '"');
});
if (c.length > LIMIT) console.log('  ... ve ' + (c.length-LIMIT) + ' tane daha');

const n = grupla(RAPOR.nan, x => x.yer+'|'+x.viz+'|'+x.n);
console.log('\n── 3 · GEÇERSİZ KOORDİNAT (NaN) ── ' + n.length + ' benzersiz');
n.slice(0,LIMIT).forEach(x => console.log('  ' + x.yer.padEnd(20) + ' VIZ.' + x.viz + '  ' + x.n));

const t = d.length + c.length + n.length;
console.log('\n' + (t === 0 ? '  ✓✓  TAŞMA VE ÇAKIŞMA YOK' : '  ✗  toplam ' + t + ' benzersiz sorun'));
