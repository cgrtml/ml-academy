/* ML Academy · ders sayfasındaki DİNAMİK metinlerin envanteri
   Bunlar content.js içindeki FONKSİYONLARDAN üretilir; content-en.js bunları
   geçersiz kılamaz, çünkü İngilizce ders yalnızca metin taşır. Kaynaklar:
     · unlockMsg          → kilit açma yönergesi
     · a.live(s)          → canlı sayaç etiketleri
     · a.bodyFn(s)        → dinamik gövde metni
     · frames[].body/live → oynatılan animasyonun anlatımı
     · kodlab.calistir()  → kod çalıştırınca dönen kareler
     · a.kod              → kod listesi satırları
   Kullanım: node arayuz-metin.js            → özet + .arayuz-envanter.json  */
const fs = require('fs');

const GORULEN = new Map();
const ekle = (s, nereden) => {
  s = String(s == null ? '' : s);
  if (!s.length) return;
  if (!GORULEN.has(s)) GORULEN.set(s, new Set());
  GORULEN.get(s).add(nereden);
};

const V = fs.readFileSync('./viz.js','utf8');
const C = fs.readFileSync('./content.js','utf8');
const M = eval(V + C + '({ DERSLER })');
const DERSLER = M.DERSLER;

/* çizim gerekmiyor; VIZ çağrılmıyor, sadece veri üreten fonksiyonlar koşuluyor */
function durumlar(a){
  const out = [];
  if (a.kind === 'phases') (a.phases||[]).forEach(p => out.push({ ...(a.state||{}), ...(p.state||{}) }));
  else if (a.kind === 'play' && a.frames){ const F = a.frames();
    F.forEach(f => out.push({ ...(a.state||{}), ...(f.state||{}) })); }
  else {
    const st = { ...(a.state||{}) }; (a.controls||[]).forEach(c => st[c.k] = c.val);
    out.push(st);
    (a.controls||[]).forEach(c => {
      const adim = Math.max(c.step || 1, (c.max - c.min) / 10);
      for (let v = c.min; v <= c.max + 1e-9; v += adim) out.push({ ...st, [c.k]:v });
      out.push({ ...st, [c.k]:c.max });
    });
  }
  return out;
}

Object.entries(DERSLER).forEach(([id, d]) => {
  d.adimlar.forEach((a, i) => {
    const yer = id + '[' + (i+1) + ']';
    if (a.unlockMsg) ekle(a.unlockMsg, 'unlockMsg');
    (a.kod || []).forEach(l => ekle(l, 'kod'));
    /* phases[].body ve state'i content-en.js zaten sağlıyor; yalnızca live etiketleri kalıyor */
    (a.phases || []).forEach(p => (p.live || []).forEach(r => ekle(r[0], 'phase.live')));
    if (a.kind === 'play' && a.frames){
      let F = []; try { F = a.frames(); } catch(e){}
      F.forEach(f => { if (f.body) ekle(f.body, 'frame.body');
        (f.live || []).forEach(r => ekle(r[0], 'frame.live')); });
    }
    durumlar(a).forEach(st => {
      let s = { ...st };
      try { if (a.derive){ s._d = a.derive(s); s = { ...s, ...s._d }; } } catch(e){}
      if (a.live){ try { (a.live(s) || []).forEach(r => ekle(r[0], 'live')); } catch(e){} }
      if (a.bodyFn){ try { ekle(a.bodyFn(s), 'bodyFn'); } catch(e){} }
    });
    if (a.kodlab && a.kodlab.calistir){
      const b = a.kodlab.bosluklar || {};
      /* hem doğru hem yanlış doldurmalar denenir, ikisi de kullanıcıya görünür */
      const secenekler = Object.keys(b).map(k => (b[k].secenekler || [b[k].dogru]));
      const dogru = {}; Object.keys(b).forEach(k => dogru[k] = b[k].dogru);
      const denemeler = [dogru];
      Object.keys(b).forEach((k, j) => secenekler[j].forEach(v => {
        denemeler.push({ ...dogru, [k]: v }); }));
      denemeler.forEach(vals => {
        let r; try { r = a.kodlab.calistir(vals, {}); } catch(e){ return; }
        (r && r.kareler || []).forEach(kare => {
          if (kare.body) ekle(kare.body, 'kodlab.body');
          (kare.live || []).forEach(x => ekle(x[0], 'kodlab.live'));
        });
        if (r && r.sonBody) ekle(r.sonBody, 'kodlab.sonBody');
        if (r && r.mesaj)   ekle(r.mesaj,   'kodlab.mesaj');
      });
    }
  });
});

const HARF = /[A-Za-zÇĞİÖŞÜçğıöşü]/;
const sablonla = s => s.replace(/-?\d+(?:[.,]\d+)?/g, '#');

const hepsi = [...GORULEN.entries()].map(([s, w]) => ({ s, w:[...w] }));
const yazi = hepsi.filter(x => HARF.test(x.s.replace(/<[^>]*>/g, '')));
const sabit  = yazi.filter(x => !/\d/.test(x.s));
const sayili = yazi.filter(x => /\d/.test(x.s));
const sablonlar = new Map();
sayili.forEach(x => { const k = sablonla(x.s); if (!sablonlar.has(k)) sablonlar.set(k, x.w); });

fs.writeFileSync('./.arayuz-envanter.json', JSON.stringify({
  sabit: sabit.map(x => [x.s, x.w[0]]),
  sablon: [...sablonlar.entries()].map(([s, w]) => [s, w[0]]),
}, null, 0));

const say = {};
yazi.forEach(x => x.w.forEach(k => say[k] = (say[k]||0)+1));
console.log('═══ DERS SAYFASI · DİNAMİK METİN ═══\n');
console.log('  benzersiz metin : ' + hepsi.length);
console.log('  sabit           : ' + sabit.length);
console.log('  sayı içeren     : ' + sayili.length + '  → ' + sablonlar.size + ' şablon');
console.log('  çeviri gereken  : ' + (sabit.length + sablonlar.size) + '\n');
Object.entries(say).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log('    ' + k.padEnd(16) + v));
