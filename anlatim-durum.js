/* ML Academy · konu anlatımı kapsamı
   Hangi adımlarda anlatım var, hangilerinde yok; TR ve EN ayrı ayrı.
   Kullanım: node anlatim-durum.js [rota]   */
const fs = require('fs');
const V = fs.readFileSync('./viz.js','utf8');
const C = fs.readFileSync('./content.js','utf8');
const { DERSLER } = eval(V + C + '({ DERSLER })');
const TR = new Function(fs.readFileSync('./anlatim.js','utf8')    + ';return ANLATIM;')();
const EN = new Function(fs.readFileSync('./anlatim-en.js','utf8') + ';return ANLATIM_EN;')();

const rotaAd = { 0:'R0 Sıfırdan', 1:'R1 Klasik ML', 2:'R2 Derin Öğrenme', 3:'R3 LLM', 4:'R4 AI Kullanma' };
const sadece = process.argv[2] !== undefined ? +process.argv[2] : null;
const rota = {};
let toplam = 0, trVar = 0, enVar = 0, eksikTR = [];

Object.entries(DERSLER).forEach(([id, d]) => {
  const r = d.rota;
  rota[r] = rota[r] || { adim:0, tr:0, en:0, dersEksik:new Set() };
  d.adimlar.forEach((a, i) => {
    const k = id + ':' + (i+1);
    toplam++; rota[r].adim++;
    if (TR[k]) { trVar++; rota[r].tr++; } else { rota[r].dersEksik.add(id); eksikTR.push(k); }
    if (EN[k]) { enVar++; rota[r].en++; }
  });
});

console.log('═══ KONU ANLATIMI KAPSAMI ═══\n');
Object.keys(rota).sort().forEach(r => {
  const g = rota[r];
  console.log('  ' + (rotaAd[r]||('rota '+r)).padEnd(18) +
    'TR ' + String(g.tr).padStart(3) + '/' + String(g.adim).padEnd(4) +
    ' EN ' + String(g.en).padStart(3) + '/' + String(g.adim).padEnd(4) +
    (g.tr < g.adim ? '  eksik ders: ' + [...g.dersEksik].join(', ') : '  ✓'));
});
console.log('\n  TOPLAM  TR ' + trVar + '/' + toplam + '  ·  EN ' + enVar + '/' + toplam);
/* TR'si olup EN'i olmayan adım motoru bozmaz ama EN kullanıcısı anlatımı göremez */
const enEksik = Object.keys(TR).filter(k => !EN[k]);
if (enEksik.length) console.log('  ⚠ TR var EN yok: ' + enEksik.length + '  ' + enEksik.slice(0,6).join(' '));
if (sadece !== null){
  console.log('\n  rota ' + sadece + ' eksikleri:');
  eksikTR.filter(k => DERSLER[k.split(':')[0]].rota === sadece)
         .forEach(k => console.log('    ' + k));
}
