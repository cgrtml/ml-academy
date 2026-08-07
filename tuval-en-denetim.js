/* ML Academy · EN modunda tuvale hâlâ Türkçe metin çiziliyor mu?
   viz.js'i localStorage.mlacad_dil = 'en' ile yükler, bütün widget'ları çizer
   ve fillText'e giden metinlerde Türkçe karakter arar.
   Kullanım: node tuval-en-denetim.js   */
const fs = require('fs');

const TRCH = /[ğüşıöçĞÜŞİÖÇ]/;
const KALAN = new Map();

function sahteCtx(){
  const c = { font:'22px monospace', textAlign:'start', textBaseline:'alphabetic',
    fillStyle:'#000', strokeStyle:'#000', lineWidth:1, globalAlpha:1, lineCap:'butt', lineJoin:'miter' };
  const yok = () => {};
  ['beginPath','closePath','fill','stroke','setLineDash','clip','putImageData','drawImage',
   'arcTo','quadraticCurveTo','bezierCurveTo','clearRect','roundRect','ellipse',
   'save','restore','setTransform','translate','scale','rotate',
   'fillRect','strokeRect','rect','arc','moveTo','lineTo'].forEach(k => c[k] = yok);
  c.fillText = s => {
    s = String(s == null ? '' : s);
    if (!s.length || !TRCH.test(s)) return;
    if (!KALAN.has(s)) KALAN.set(s, new Set());
    if (AKTIF) KALAN.get(s).add(AKTIF);
  };
  c.strokeText = c.fillText;
  c.createLinearGradient = () => ({ addColorStop:yok });
  c.createRadialGradient = () => ({ addColorStop:yok });
  c.createPattern = () => null;
  c.createImageData = (w,h) => ({ data:new Uint8ClampedArray(Math.max(4, Math.abs(w*h*4)|0)) });
  c.getImageData    = (x,y,w,h) => ({ data:new Uint8ClampedArray(Math.max(4, Math.abs(w*h*4)|0)) });
  c.measureText = s => ({ width: String(s).length * 22 * 0.6 });
  return c;
}

let CTX = sahteCtx(), AKTIF = '';
const localStorage = { getItem: k => k === 'mlacad_dil' ? 'en' : null, setItem(){}, removeItem(){} };

const SZ = fs.readFileSync('./viz-sozluk.js','utf8');
const V  = fs.readFileSync('./viz.js','utf8');
const C  = fs.readFileSync('./content.js','utf8');

eval(SZ + V + C + `
const el = { width:0, height:0, getContext: () => CTX };
function ciz(a, st){
  CTX = sahteCtx();
  try {
    useCanvas(el, 1500, a.h || 700);
    let s2 = { ...st };
    if (a.derive) s2 = { ...s2, _d:a.derive(s2), ...a.derive(s2) };
    VIZ[a.viz](s2);
    if (a.live) a.live(s2);
  } catch(e){}
}
Object.entries(DERSLER).forEach(([id,d]) => {
  d.adimlar.forEach((a,i) => {
    if (!a.viz || !VIZ[a.viz]) return;
    AKTIF = a.viz;
    const durumlar = [];
    if (a.kind === 'phases') a.phases.forEach(p => durumlar.push({ ...(a.state||{}), ...(p.state||{}) }));
    else if (a.kind === 'play'){ const F = a.frames();
      F.forEach((f,k) => { if (k % Math.max(1, Math.floor(F.length/6)) === 0 || k === F.length-1)
        durumlar.push({ ...(a.state||{}), ...(f.state||{}) }); }); }
    else { const st = { ...(a.state||{}) }; (a.controls||[]).forEach(c => st[c.k] = c.val);
      durumlar.push(st);
      (a.controls||[]).forEach(c => {
        const adim = Math.max(c.step || 1, (c.max - c.min) / 12);
        for (let v = c.min; v <= c.max + 1e-9; v += adim) durumlar.push({ ...st, [c.k]:v });
        durumlar.push({ ...st, [c.k]:c.max });
      }); }
    durumlar.forEach(st => ciz(a, st));
  });
});
`);

console.log('═══ EN MODU · TUVAL DENETİMİ ═══\n');
if (!KALAN.size){ console.log('  ✓✓  EN modunda tuvale Türkçe metin çizilmiyor.'); process.exit(0); }
console.log('  Çevrilmemiş kalan metin: ' + KALAN.size + '\n');
[...KALAN.entries()].slice(0, 60).forEach(([s, w]) =>
  console.log('    ' + JSON.stringify(s).slice(0,90) + '   [' + [...w].slice(0,3).join(', ') + ']'));
