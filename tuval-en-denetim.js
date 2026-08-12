/* ML Academy · EN modunda tuvale hâlâ Türkçe metin çiziliyor mu?
   viz.js'i localStorage.mlacad_dil = 'en' ile yükler, bütün widget'ları çizer
   ve fillText'e giden metinlere iki ayrı test uygular.
   Kullanım: node tuval-en-denetim.js

   1) Türkçe karakter testi. Ucuz ama KÖR: "kontrol", "tahmin", "toplam",
      "karar", "oran", "buldu" gibi etiketlerin hepsi ASCII ve bu filtreden
      kaçıyor. tuval-metin.js kendi başlığında tam bu tuzağı yazıyor, burası
      ona rağmen yalnız aksanlı harfe bakıyordu.
   2) Sözlük anahtarı testi. Kesin: EN modunda tuvale çizilen bir metin
      TUVAL_EN'in ANAHTARI ise, o metnin İngilizce karşılığı var demektir ve
      yine de Türkçesi çizilmiştir; yani CEV() atlanmıştır. Bu, o metnin
      txt() yerine doğrudan cx.fillText ile çizildiğini gösterir.
      Aksan içermeyen kaçakları yakalayan tek test budur. */
const fs = require('fs');

const TRCH = /[ğüşıöçĞÜŞİÖÇ]/;
const KALAN = new Map();
const CEVSIZ = new Map();

/* Bilerek Türkçe kalan metinler. İki ders Türkçe'nin KENDİSİNİ inceliyor,
   oradaki Türkçe kelime çeviri artığı değil, incelenen veri:
     bpe       "kitaplarımızdan" nasıl parçalanıyor, ekleri BPE öğrenebiliyor mu
     cokanlam  "yüz" üç ayrı anlama geliyor, statik gömme birine çöküyor
   Bu satırlar çevrilirse ders anlamsızlaşır. Muafiyet dar tutulmalı: yalnız
   bu iki widget'ta ve yalnız bu kelimeleri içeren metinlerde geçerli, böylece
   aynı widget'a sonradan sızacak gerçek bir Türkçe metin yine yakalanır. */
const BILEREK = [
  { viz:'bpe',      kelime:['kitaplarımızdan','kitapları'] },
  { viz:'cokanlam', kelime:['yüz'] },
];
const bilerekMi = (s, viz) => BILEREK.some(b =>
  b.viz === viz && b.kelime.some(k => s.includes(k)));

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
    if (!s.length) return;
    /* Karşılığı kendisiyle aynı olanlar sayılmaz: "AUC", "R²", "Huffman",
       "SMOTE" gibi terimler sözlükte duruyor ama iki dilde de aynı yazılıyor,
       çizilmeleri doğru. Yalnız karşılığı FARKLI olanlar kaçak demektir. */
    if (typeof TUVAL_EN !== 'undefined' && TUVAL_EN[s] !== undefined && TUVAL_EN[s] !== s){
      if (!CEVSIZ.has(s)) CEVSIZ.set(s, new Set());
      if (AKTIF) CEVSIZ.get(s).add(AKTIF);
    }
    if (!TRCH.test(s) || bilerekMi(s, AKTIF)) return;
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

console.log('── 1 · SÖZLÜKTE KARŞILIĞI OLDUĞU HÂLDE TÜRKÇE ÇİZİLEN ── ' + CEVSIZ.size);
if (CEVSIZ.size) console.log('     (CEV() atlanmış: txt() yerine doğrudan cx.fillText)');
[...CEVSIZ.entries()].slice(0, 60).forEach(([s, w]) =>
  console.log('    ' + JSON.stringify(s).slice(0,90) + '   [' + [...w].slice(0,3).join(', ') + ']'));

console.log('\n── 2 · TÜRKÇE KARAKTER İÇEREN METİN ── ' + KALAN.size);
[...KALAN.entries()].slice(0, 60).forEach(([s, w]) =>
  console.log('    ' + JSON.stringify(s).slice(0,90) + '   [' + [...w].slice(0,3).join(', ') + ']'));

const toplam = CEVSIZ.size + KALAN.size;
console.log('\n' + (toplam === 0
  ? '  ✓✓  EN modunda tuvale Türkçe metin çizilmiyor.'
  : '  ✗  toplam ' + toplam + ' benzersiz metin'));
