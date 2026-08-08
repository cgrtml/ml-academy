/* ML Academy · tuvale çizilen METİNLERİN TAMAMININ envanteri
   Bütün widget'ları bütün kontrol durumlarında çizer ve txt()/frame() ile
   fillText'e giden her metni toplar. Türkçe'ye özgü harf aramaz, çünkü
   "tahmin", "toplam", "karar", "oran" gibi etiketler ASCII'dir ve o filtreden
   kaçar. Sayı/simge yığınları ayıklanır, kalanlar sözlükle karşılaştırılır.
   Sayı içerenler şablona indirgenir: rakam dizileri # ile temsil edilir.
   Kullanım: node tuval-metin.js            → özet + .tuval-envanter.json  */
const fs = require('fs');

const GORULEN = new Map();   // metin -> { n, w:Set }

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
    if (!s.length) return;
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

/* sayı içerenler şablona indirgenir */
const sablonla = s => s.replace(/-?\d+(?:[.,]\d+)?/g, '#');
/* harf içermeyen (sadece rakam, işaret, ok, matematik simgesi) metinler çeviri istemez */
const HARF = /[A-Za-zÇĞİÖŞÜçğıöşü]/;
/* tek başına anlamı dilden bağımsız olan kısa simgeler */
const NOTR = /^(?:[a-zA-Z](?:[₀-₉0-9']*)|[xyzwbhkntpqfKQVWLTNRSEHF](?:\S{0,3})?|[A-Z]{1,3}\d*|σ|μ|λ|α|β|γ|ε|κ|ρ|π|θ|Δ|∇|∞|±|→|←|↔|·|■|●|◎|○|✓|✗|⚠|%|#)$/;

const hepsi = [...GORULEN.entries()].map(([s,g]) => ({ s, n:g.n, w:[...g.w] }));
const cevrilebilir = hepsi.filter(x => HARF.test(x.s));
const sabit  = cevrilebilir.filter(x => !/\d/.test(x.s));
const sayili = cevrilebilir.filter(x => /\d/.test(x.s));
const sablonlar = new Map();
sayili.forEach(x => { const k = sablonla(x.s); if (!sablonlar.has(k)) sablonlar.set(k, []); sablonlar.get(k).push(x.s); });

fs.writeFileSync('./.tuval-envanter.json', JSON.stringify({
  sabit: sabit.map(x => [x.s, x.w[0] || '']),
  sablon: [...sablonlar.entries()].map(([k,v]) => [k, (GORULEN.get(v[0])||{w:new Set()}).w ? [...GORULEN.get(v[0]).w][0] : '']),
  simge: hepsi.filter(x => !HARF.test(x.s)).length,
}, null, 0));

console.log('═══ TUVALE ÇİZİLEN METİN ═══\n');
console.log('  benzersiz metin        : ' + hepsi.length);
console.log('  harf içermeyen (simge) : ' + (hepsi.length - cevrilebilir.length));
console.log('  sabit metin            : ' + sabit.length);
console.log('  sayı içeren            : ' + sayili.length + '  → ' + sablonlar.size + ' şablon');
console.log('  çeviri gereken toplam  : ' + (sabit.length + sablonlar.size));
