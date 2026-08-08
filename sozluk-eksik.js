/* ML Academy · sözlükte karşılığı olmayan metinleri listeler.
   Varsayılan hedef tuval (viz-sozluk.js + .tuval-envanter.json);
   "arayuz" verilirse ders sayfasının dinamik metinleri (arayuz-sozluk.js).
   Kullanım: node sozluk-eksik.js [kaç tane] [atla] [tuval|arayuz]   */
const fs = require('fs');

const hedef = process.argv[4] || 'tuval';
const dosya = hedef === 'arayuz'
  ? { soz:'./arayuz-sozluk.js', env:'./.arayuz-envanter.json', ad:'ARAYUZ_EN', ayni:'ARAYUZ_AYNI' }
  : { soz:'./viz-sozluk.js',    env:'./.tuval-envanter.json',  ad:'TUVAL_EN',  ayni:'TUVAL_AYNI' };

const env = JSON.parse(fs.readFileSync(dosya.env,'utf8'));
const S = new Function(fs.readFileSync(dosya.soz,'utf8') +
  ';return { EN:' + dosya.ad + ', AYNI:(typeof ' + dosya.ayni + '!=="undefined"?' + dosya.ayni + ':[]) };')();
const AYNI = new Set(S.AYNI);
/* arayüz katmanı, karşılığı olmayanlarda tuval sözlüğüne düşer */
let YEDEK = { EN:{}, AYNI:[] };
if (hedef === 'arayuz'){
  try { YEDEK = new Function(fs.readFileSync('./viz-sozluk.js','utf8') +
    ';return { EN:TUVAL_EN, AYNI:TUVAL_AYNI };')(); } catch(e){}
}
const YEDEK_AYNI = new Set(YEDEK.AYNI);

const cift = x => Array.isArray(x) ? x : [x, ''];
const tumu = [...env.sabit.map(cift), ...env.sablon.map(cift)];
const eksik = tumu.filter(([s]) =>
  S.EN[s] === undefined && !AYNI.has(s) &&
  YEDEK.EN[s] === undefined && !YEDEK_AYNI.has(s));

const N    = parseInt(process.argv[2] || '120', 10);
const atla = parseInt(process.argv[3] || '0', 10);
eksik.sort((a,b) => (a[1]||'').localeCompare(b[1]||'') || a[0].length - b[0].length);
if (N > 0) eksik.slice(atla, atla+N).forEach(([s,w]) => console.log('  ' + JSON.stringify(s) + ': ,   // ' + w));
console.log('\n// eksik: ' + eksik.length + ' / ' + tumu.length +
            '   (sözlük ' + Object.keys(S.EN).length + ' · aynı kalan ' + AYNI.size + ')');
