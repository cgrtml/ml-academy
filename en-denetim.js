/* ML Academy · EN modunda hâlâ Türkçe kalan metin var mı?
   İki katmanı da denetler:
     1) TUVAL   · viz.js CEV() üzerinden çizilen her metin
     2) ARAYÜZ  · lesson.html CEVIR() üzerinden basılan dinamik metinler
   Ölçüt "Türkçe harf içeriyor mu" değil, "sözlükte anahtar olarak duruyor mu":
   bir metin İngilizce modda hâlâ anahtar biçiminde çiziliyorsa çeviri uygulanmamış
   demektir. Ayrıca envanterde olup sözlükte hiç karşılığı olmayanlar da raporlanır.
   Kullanım: node en-denetim.js   */
const fs = require('fs');

const SZ  = fs.readFileSync('./viz-sozluk.js','utf8');
const ASZ = fs.readFileSync('./arayuz-sozluk.js','utf8');
const V   = fs.readFileSync('./viz.js','utf8');
const C   = fs.readFileSync('./content.js','utf8');

const T = new Function(SZ  + ';return { EN:TUVAL_EN,  AYNI:TUVAL_AYNI };')();
const A = new Function(ASZ + ';return { EN:ARAYUZ_EN, AYNI:ARAYUZ_AYNI };')();
const SAYI = /-?\d+(?:[.,]\d+)?/g;
const sablonla = s => s.replace(SAYI, '#');

/* ── 1 · tuval ── */
const CIZILEN = new Map();
function sahteCtx(){
  const c = { font:'22px monospace', textAlign:'start', textBaseline:'alphabetic',
    fillStyle:'#000', strokeStyle:'#000', lineWidth:1, globalAlpha:1, lineCap:'butt', lineJoin:'miter' };
  const yok = () => {};
  ['beginPath','closePath','fill','stroke','setLineDash','clip','putImageData','drawImage',
   'arcTo','quadraticCurveTo','bezierCurveTo','clearRect','roundRect','ellipse',
   'save','restore','setTransform','translate','scale','rotate',
   'fillRect','strokeRect','rect','arc','moveTo','lineTo'].forEach(k => c[k] = yok);
  c.fillText = s => { s = String(s == null ? '' : s); if (!s.length) return;
    if (!CIZILEN.has(s)) CIZILEN.set(s, new Set()); if (AKTIF) CIZILEN.get(s).add(AKTIF); };
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

const tuvalKalan = [];
/* Karşılığı kendisiyle aynı olan kayıtlar (model, normal, FORMAT ...) doğal
   olarak anahtar biçiminde çizilir; bunlar hata değil. */
const ayniKarsilik = (k, ciz) => T.EN[k] !== undefined && T.EN[k] === k;
[...CIZILEN.entries()].forEach(([s, w]) => {
  if (T.EN[s] !== undefined){
    if (!ayniKarsilik(s)) tuvalKalan.push([s, [...w][0], 'birebir anahtar']);
    return;
  }
  if (/\d/.test(s)){
    const k = sablonla(s);
    if (T.EN[k] !== undefined && T.EN[k] !== k) tuvalKalan.push([s, [...w][0], 'şablon anahtarı']);
  }
});

/* ── 2 · arayüz ── */
const M2 = eval(V + C + '({ DERSLER })');
const ARAYUZ = new Map();
const ekle = (s, n) => { s = String(s == null ? '' : s); if (!s.length) return;
  if (!ARAYUZ.has(s)) ARAYUZ.set(s, n); };
Object.values(M2.DERSLER).forEach(d => d.adimlar.forEach(a => {
  if (a.unlockMsg) ekle(a.unlockMsg, 'unlockMsg');
  (a.controls || []).forEach(c => { if (!c.fmt) return;
    const ad = Math.max(c.step || 1, (c.max - c.min) / 20);
    for (let v = c.min; v <= c.max + 1e-9; v += ad){ try { ekle(c.fmt(v), 'control.fmt'); } catch(e){} }
    try { ekle(c.fmt(c.max), 'control.fmt'); } catch(e){} });
  (a.kod || []).forEach(l => ekle(l, 'kod'));
  /* Canlı rozet satırı [etiket, değer, renk]. Burada yalnız r[0], yani ETİKET
     toplanıyordu; oysa lesson.html'deki cevirLive() ikisini de CEVIR()'den
     geçiriyor. Denetim sayfanın bastığı metnin yarısını görmüyordu ve
     "11 kontrol ✓" gibi çevrilmemiş DEĞERLER hiç raporlanmadan canlıya çıktı.
     İkisi de toplanmalı, sayfa ikisini de çeviriyor. */
  const canli = (r, n) => { ekle(r[0], n); ekle(r[1], n); };
  (a.phases || []).forEach(p => (p.live || []).forEach(r => canli(r, 'phase.live')));
  if (a.kind === 'play' && a.frames){ let F = []; try { F = a.frames(); } catch(e){}
    F.forEach(f => { if (f.body) ekle(f.body, 'frame.body');
      (f.live || []).forEach(r => canli(r, 'frame.live')); }); }
  const durumlar = [];
  if (a.kind === 'phases') (a.phases||[]).forEach(p => durumlar.push({ ...(a.state||{}), ...(p.state||{}) }));
  else { const st = { ...(a.state||{}) }; (a.controls||[]).forEach(c => st[c.k] = c.val);
    durumlar.push(st);
    (a.controls||[]).forEach(c => { const ad = Math.max(c.step || 1, (c.max - c.min) / 10);
      for (let v = c.min; v <= c.max + 1e-9; v += ad) durumlar.push({ ...st, [c.k]:v }); }); }
  durumlar.forEach(st => { let s = { ...st };
    try { if (a.derive){ s._d = a.derive(s); s = { ...s, ...s._d }; } } catch(e){}
    if (a.live){ try { (a.live(s)||[]).forEach(r => canli(r, 'live')); } catch(e){} }
    if (a.bodyFn){ try { ekle(a.bodyFn(s), 'bodyFn'); } catch(e){} } });
}));
const arayuzKalan = [];
/* CEVIR önce arayüz, sonra tuval sözlüğüne bakar; denetim de aynı zinciri izler */
const cevrilir = s => A.EN[s] !== undefined || T.EN[s] !== undefined ||
  (/\d/.test(s) && (A.EN[sablonla(s)] !== undefined || T.EN[sablonla(s)] !== undefined));
const ayniBirakildi = s => A.AYNI.includes(s) || A.AYNI.includes(sablonla(s)) ||
  T.AYNI.includes(s) || T.AYNI.includes(sablonla(s));
[...ARAYUZ.entries()].forEach(([s, n]) => {
  if (cevrilir(s)) return;
  if (ayniBirakildi(s)) return;
  if (!/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(s.replace(/<[^>]*>/g,''))) return;
  arayuzKalan.push([s, n]);
});

console.log('═══ EN MODU · DİL DENETİMİ ═══\n');
console.log('── 1 · TUVAL ──');
console.log('  çizilen benzersiz metin : ' + CIZILEN.size);
console.log('  çevrilmeden kalan       : ' + tuvalKalan.length);
tuvalKalan.slice(0, 25).forEach(([s,w,tip]) =>
  console.log('    ' + JSON.stringify(s).slice(0,80) + '   [' + w + ' · ' + tip + ']'));

console.log('\n── 2 · ARAYÜZ (live · unlockMsg · bodyFn · kareler · kod) ──');
console.log('  toplanan benzersiz metin : ' + ARAYUZ.size);
console.log('  sözlükte karşılığı yok   : ' + arayuzKalan.length);
arayuzKalan.slice(0, 25).forEach(([s,n]) =>
  console.log('    ' + JSON.stringify(s).slice(0,80) + '   [' + n + ']'));

const t = tuvalKalan.length + arayuzKalan.length;
console.log('\n' + (t === 0
  ? '  ✓✓  EN modunda çevrilmemiş metin yok.'
  : '  ✗  toplam ' + t + ' metin çevrilmeden kalıyor'));
