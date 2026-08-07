/* ML Academy · TR/EN kapsam raporu
   Üç şeyi ayrı ayrı ölçer:
     1) hangi dersler İngilizce'ye çevrilmiş, hangileri çevrilmemiş
     2) çevrilmiş derslerde motoru bozacak yapı uyuşmazlıkları ve eksik/çevrilmemiş alanlar
     3) viz.js içinde LB() ile sarılmamış, yani arayüz EN olsa bile Türkçe kalan tuval etiketleri
   Kullanım: node ceviri-raporu.js   */
const fs = require('fs');

const TRCH = /[ğüşıöçĞÜŞİÖÇ]/;
const V = fs.readFileSync('./viz.js','utf8');
const C = fs.readFileSync('./content.js','utf8');
const E = fs.readFileSync('./content-en.js','utf8');

// content.js viz.js'teki yardımcıları (grad, polyfit ...) kullanıyor, önce o yüklenmeli
const M = eval(V + C + E + '({ DERSLER, DERSLER_EN })');
const DERSLER = M.DERSLER, DERSLER_EN = M.DERSLER_EN;

/* ── 1 · ders kapsamı ── */
const trIds = Object.keys(DERSLER);
const enIds = Object.keys(DERSLER_EN);
const eksik = trIds.filter(id => !enIds.includes(id));
const fazla = enIds.filter(id => !trIds.includes(id));

console.log('═══ TR/EN KAPSAM RAPORU ═══\n');
console.log('── 1 · DERS KAPSAMI ──');
console.log('  Türkçe ders : ' + trIds.length);
console.log('  İngilizce   : ' + enIds.length + '  (%' + Math.round(100*enIds.length/trIds.length) + ')');
if (fazla.length) console.log('  ⚠ TR karşılığı olmayan EN ders: ' + fazla.join(', '));

const rotaAd = { 0:'R0 Sıfırdan', 1:'R1 Klasik ML', 2:'R2 Derin Öğrenme', 3:'R3 LLM', 4:'R4 AI Kullanma' };
const rota = {};
trIds.forEach(id => {
  const r = DERSLER[id].rota;
  (rota[r] = rota[r] || { var:[], yok:[] })[enIds.includes(id) ? 'var' : 'yok'].push(id);
});
Object.keys(rota).sort().forEach(r => {
  const g = rota[r];
  console.log('  ' + (rotaAd[r]||('rota '+r)).padEnd(20) +
              g.var.length + '/' + (g.var.length+g.yok.length) + ' çevrildi' +
              (g.yok.length ? '   eksik: ' + g.yok.join(', ') : ''));
});

/* ── 2 · çevrilmiş derslerde yapı ve alan denetimi ── */
console.log('\n── 2 · ÇEVRİLMİŞ DERSLERDE SORUN ──');
const METIN = ['t','goal','todo','body','learned'];
let yapiHata = 0, alanHata = 0;
enIds.filter(id => trIds.includes(id)).forEach(id => {
  const tr = DERSLER[id], en = DERSLER_EN[id], sorun = [];

  if (tr.adimlar.length !== en.adimlar.length)
    sorun.push('adım sayısı TR ' + tr.adimlar.length + ' ≠ EN ' + en.adimlar.length), yapiHata++;

  const n = Math.min(tr.adimlar.length, en.adimlar.length);
  for (let i=0;i<n;i++){
    const a = tr.adimlar[i], b = en.adimlar[i], ad = '[' + (i+1) + ']';
    if (a.viz !== b.viz)   { sorun.push(ad+' viz TR "'+a.viz+'" ≠ EN "'+b.viz+'"'); yapiHata++; }
    if (a.kind !== b.kind) { sorun.push(ad+' kind TR "'+a.kind+'" ≠ EN "'+b.kind+'"'); yapiHata++; }
    if ((a.xp||0) !== (b.xp||0)) { sorun.push(ad+' xp TR '+(a.xp||0)+' ≠ EN '+(b.xp||0)); yapiHata++; }
    const ak = Object.keys(a.state||{}).sort().join(','), bk = Object.keys(b.state||{}).sort().join(',');
    if (ak !== bk) { sorun.push(ad+' state anahtarları farklı: TR {'+ak+'} EN {'+bk+'}'); yapiHata++; }
    if (!!a.quiz !== !!b.quiz) { sorun.push(ad+' quiz birinde var birinde yok'); yapiHata++; }
    if (a.quiz && b.quiz){
      if ((a.quiz.opts||[]).length !== (b.quiz.opts||[]).length){
        sorun.push(ad+' şık sayısı TR '+(a.quiz.opts||[]).length+' ≠ EN '+(b.quiz.opts||[]).length); yapiHata++; }
      if (a.quiz.dogru !== b.quiz.dogru){ sorun.push(ad+' doğru şık indeksi farklı'); yapiHata++; }
    }
    METIN.forEach(k => {
      if (a[k] && !b[k]) { sorun.push(ad+' "'+k+'" EN tarafında yok'); alanHata++; }
      else if (a[k] && b[k] && a[k] === b[k]) { sorun.push(ad+' "'+k+'" hâlâ Türkçe (birebir aynı)'); alanHata++; }
      else if (b[k] && TRCH.test(String(b[k]).replace(/<[^>]*>/g,''))) {
        const kelime = String(b[k]).replace(/<[^>]*>/g,'').match(/[\wçğıöşüÇĞİÖŞÜ]*[ğüşıöçĞÜŞİÖÇ][\wçğıöşüÇĞİÖŞÜ]*/g) || [];
        sorun.push(ad+' "'+k+'" içinde Türkçe kelime: ' + [...new Set(kelime)].slice(0,4).join(', ')); alanHata++; }
    });
  }
  if (sorun.length) console.log('  ' + id + '\n' + sorun.map(s => '      · ' + s).join('\n'));
});
if (!yapiHata && !alanHata) console.log('  ✓ çevrilmiş derslerde sorun yok');
else console.log('  toplam: ' + yapiHata + ' yapı uyuşmazlığı, ' + alanHata + ' alan sorunu');

/* ── 3 · viz.js tuval etiketleri ── */
console.log('\n── 3 · TUVAL ETİKETLERİ (viz.js) ──');
const LB_TR = new Set();
const lbRe = /LB\(\s*(['"`])((?:\\.|(?!\1)[\s\S])*?)\1\s*,/g;
let mm; while ((mm = lbRe.exec(V))) LB_TR.add(mm[2]);

const litRe = /(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
const acik = [];
let m2; while ((m2 = litRe.exec(V))){
  const s = m2[2];
  if (!TRCH.test(s)) continue;
  if (LB_TR.has(s)) continue;
  if (/^[#.][\w-]+$/.test(s)) continue;           // seçici ya da renk değil
  acik.push({ s, i:m2.index });
}
const wRe = /VIZ\.([A-Za-z0-9_]+)\s*=/g;
const wPos = []; let m3; while ((m3 = wRe.exec(V))) wPos.push({ ad:m3[1], i:m3.index });
const widgetBul = i => { let ad = '(yardımcı)'; for (const w of wPos){ if (w.i <= i) ad = w.ad; else break; } return ad; };

const grup = {};
acik.forEach(x => { const w = widgetBul(x.i); (grup[w] = grup[w] || []).push(x.s); });
const sirali = Object.entries(grup).sort((a,b) => b[1].length - a[1].length);
console.log('  LB() ile çevrilmiş etiket : ' + LB_TR.size);
console.log('  LB() dışında kalan Türkçe : ' + acik.length + '   (arayüz EN olsa bile Türkçe görünür)');
sirali.slice(0, 20).forEach(([w, arr]) => {
  console.log('    VIZ.' + w.padEnd(16) + String(arr.length).padStart(3) + '  ör: ' +
              [...new Set(arr)].slice(0,3).map(s => '"' + s.slice(0,30) + '"').join(' '));
});
if (sirali.length > 20) console.log('    ... ve ' + (sirali.length-20) + ' widget daha');

console.log('\n── ÖZET ──');
console.log('  çevrilmemiş ders   : ' + eksik.length + ' / ' + trIds.length);
console.log('  yapı uyuşmazlığı   : ' + yapiHata);
console.log('  eksik/çevrilmemiş alan : ' + alanHata);
console.log('  çevrilmemiş tuval etiketi : ' + acik.length);
