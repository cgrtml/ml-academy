/* ML Academy · tuval özetleri denetimi (erişilebilirlik)
   ─────────────────────────────────────────────────────────────────────
   <canvas> ekran okuyucuya hiçbir şey söylemez. viz.js her çizimde
   görselin kendi başlığını, eksenlerini, çiplerini ve durum yazısını
   topluyor; lesson.html bunu canvas'ın aria-label'ına yazıyor.

   Bu betik bütün widget'ları çizip her birinin ANLAMLI bir özet
   ürettiğini doğruluyor. Özetsiz bir widget, görme engelli bir kullanıcı
   için boş bir kutu demek, o yüzden burada hata sayılıyor.

   Yeni bir widget ortak yardımcıları (baslikSerit / frame / durum)
   kullanmıyorsa özetini kendisi yazmalı: OZET.bas ve OZET.alt.

   Kullanım:  node ozet-denetim.js      ·      DIL=en node ozet-denetim.js
   ───────────────────────────────────────────────────────────────────── */
const fs = require('fs');
function sahteCtx(){
  const c = { font:'22px monospace', textAlign:'start', textBaseline:'alphabetic',
    fillStyle:'#000', strokeStyle:'#000', lineWidth:1, globalAlpha:1, lineCap:'butt', lineJoin:'miter', letterSpacing:'0px' };
  const yok = () => {};
  ['beginPath','closePath','fill','stroke','setLineDash','clip','putImageData','drawImage',
   'arcTo','quadraticCurveTo','bezierCurveTo','clearRect','roundRect','ellipse',
   'save','restore','setTransform','translate','scale','rotate',
   'fillRect','strokeRect','rect','arc','moveTo','lineTo','fillText','strokeText'].forEach(k => c[k] = yok);
  c.createLinearGradient = () => ({ addColorStop:yok });
  c.createRadialGradient = () => ({ addColorStop:yok });
  c.createPattern = () => null;
  c.createImageData = (w,h) => ({ data:new Uint8ClampedArray(Math.max(4, Math.abs(w*h*4)|0)) });
  c.getImageData = (x,y,w,h) => ({ data:new Uint8ClampedArray(Math.max(4, Math.abs(w*h*4)|0)) });
  c.measureText = s => ({ width: String(s).length * 13 });
  return c;
}
let CTX = sahteCtx();
const DIL = process.env.DIL === 'en' ? 'en' : 'tr';
const localStorage = { getItem: k => k === 'mlacad_dil' ? DIL : null, setItem(){}, removeItem(){} };
const S = fs.readFileSync('./viz-sozluk.js','utf8');
const V = fs.readFileSync('./viz.js','utf8');
const C = fs.readFileSync('./content.js','utf8');
eval(S + V + C + `
const el = { width:0, height:0, getContext: () => CTX };
const bos = [], ornek = [];
const gorulen = new Set();
Object.entries(DERSLER).forEach(([id,d]) => d.adimlar.forEach((a,i) => {
  if (!a.viz || !VIZ[a.viz] || gorulen.has(a.viz)) return;
  gorulen.add(a.viz);
  CTX = sahteCtx();
  useCanvas(el, 1500, a.h || 600);
  let s2 = { ...(a.state||{}) };
  (a.controls||[]).forEach(c => s2[c.k] = c.val);
  if (a.kind === 'phases' && a.phases[0]) s2 = { ...s2, ...(a.phases[0].state||{}) };
  if (a.kind === 'play'){ try { const F = a.frames(); s2 = { ...s2, ...(F[Math.floor(F.length/2)].state||{}) }; } catch(e){} }
  try {
    if (a.derive) s2 = { ...s2, _d:a.derive(s2), ...a.derive(s2) };
    VIZ[a.viz](s2);
    if (a.live) a.live(s2);
  } catch(e){ bos.push(a.viz + '  (patladi: ' + e.message.slice(0,40) + ')'); return; }
  const o = TUVAL_OZET();
  if (!o || o.length < 12) bos.push(a.viz + '  → "' + o + '"');
  else ornek.push([a.viz, o]);
}));
console.log('═══ TUVAL ÖZETLERİ · ' + DIL.toUpperCase() + ' ═══\\n');
console.log('  widget: ' + gorulen.size + '  ·  özeti olan: ' + ornek.length +
            '  ·  özetsiz: ' + bos.length);
if (bos.length){
  console.log('\\n── ÖZETİ OLMAYAN ──');
  bos.forEach(x => console.log('    ' + x));
  console.log('\\n  Bu widget ortak yardımcıları kullanmıyor; özetini kendisi');
  console.log('  yazmalı: OZET.bas ve OZET.alt (viz.js).');
}
console.log('\\n' + (bos.length === 0
  ? '  ✓✓  HER GÖRSELİN METİN KARŞILIĞI VAR'
  : '  ✗  ' + bos.length + ' görsel ekran okuyucuya boş görünüyor'));
`);
