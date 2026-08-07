/* ML Academy · tuvale çizilen Türkçe metinlerin envanteri
   Bütün widget'ları bütün kontrol durumlarında çizer ve fillText'e giden
   her metni toplar. Sayı içerenleri ayırır, çünkü onlar şablon olarak
   çevrilmeli (sabit parça sözlükte, sayı yerinde kalır).
   Kullanım: node tuval-metin.js            → özet
             node tuval-metin.js liste      → benzersiz metinlerin tamamı
             node tuval-metin.js eksik      → sözlükte karşılığı olmayanlar   */
const fs = require('fs');

const TRCH = /[ğüşıöçĞÜŞİÖÇ]/;
const GORULEN = new Map();   // metin -> { n, widget:Set }

let CTX = sahteCtx();
function sahteCtx(){
  const c = {
    font:'22px monospace', textAlign:'start', textBaseline:'alphabetic',
    fillStyle:'#000', strokeStyle:'#000', lineWidth:1, globalAlpha:1, lineCap:'butt', lineJoin:'miter',
  };
  const yok = () => {};
  ['beginPath','closePath','fill','stroke','setLineDash','clip','putImageData','drawImage',
   'arcTo','quadraticCurveTo','bezierCurveTo','clearRect','roundRect','ellipse',
   'save','restore','setTransform','translate','scale','rotate',
   'fillRect','strokeRect','rect','arc','moveTo','lineTo'].forEach(k => c[k] = yok);
  c.fillText = s => {
    s = String(s == null ? '' : s);
    if (!s.length || !TRCH.test(s)) return;
    if (!GORULEN.has(s)) GORULEN.set(s, { n:0, w:new Set() });
    const g = GORULEN.get(s); g.n++; if (AKTIF) g.w.add(AKTIF);
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

let AKTIF = '';
const V = fs.readFileSync('./viz.js','utf8');
const C = fs.readFileSync('./content.js','utf8');

eval(V + C + `
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

/* sayı içerenler şablona indirgenir: rakam dizileri # ile değiştirilir */
const sablon = s => s.replace(/-?\d+(?:[.,]\d+)?/g, '#');
const hepsi = [...GORULEN.entries()].map(([s,g]) => ({ s, n:g.n, w:[...g.w], sayili:/\d/.test(s) }));
const sabit = hepsi.filter(x => !x.sayili);
const sayili = hepsi.filter(x => x.sayili);
const sablonlar = new Map();
sayili.forEach(x => { const k = sablon(x.s); if (!sablonlar.has(k)) sablonlar.set(k, []); sablonlar.get(k).push(x.s); });

fs.writeFileSync('./.tuval-envanter.json', JSON.stringify({sabit:sabit.map(x=>[x.s,x.n]), sablon:[...sablonlar.keys()]}, null, 0));
const mod = process.argv[2] || 'ozet';

if (mod === 'liste'){
  sabit.sort((a,b) => a.s.localeCompare(b.s,'tr')).forEach(x => console.log(x.s));
} else if (mod === 'sablon'){
  [...sablonlar.keys()].sort((a,b) => a.localeCompare(b,'tr')).forEach(k => console.log(k));
} else if (mod === 'eksik'){
  let SOZ = {};
  try { SOZ = eval(fs.readFileSync('./viz-sozluk.js','utf8') + ';TUVAL_EN'); } catch(e){}
  const eksik = sabit.filter(x => !SOZ[x.s]);
  eksik.sort((a,b) => b.n - a.n).forEach(x => console.log(JSON.stringify(x.s)));
  console.log('\n// eksik sabit metin: ' + eksik.length + ' / ' + sabit.length);
} else {
  console.log('═══ TUVALE ÇİZİLEN TÜRKÇE METİN ═══\n');
  console.log('  benzersiz metin        : ' + hepsi.length);
  console.log('  sayı içermeyen (sabit) : ' + sabit.length);
  console.log('  sayı içeren            : ' + sayili.length + '  → ' + sablonlar.size + ' şablon');
  console.log('\n  en sık 15 sabit metin:');
  sabit.sort((a,b) => b.n - a.n).slice(0,15).forEach(x =>
    console.log('    ' + String(x.n).padStart(4) + '×  "' + x.s.slice(0,60) + '"'));
}
