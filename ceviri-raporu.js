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
      if (a.quiz.correct !== b.quiz.correct){
        sorun.push(ad+' doğru şık indeksi TR '+a.quiz.correct+' ≠ EN '+b.quiz.correct); yapiHata++; }
      (a.quiz.opts||[]).forEach((o,j) => {
        const p = (b.quiz.opts||[])[j]; if (!p) return;
        ['t','why'].forEach(k => {
          if (o[k] && !p[k]) { sorun.push(ad+' şık '+j+' "'+k+'" EN tarafında yok'); alanHata++; }
          else if (o[k] && p[k] && o[k] === p[k]) { sorun.push(ad+' şık '+j+' "'+k+'" hâlâ Türkçe'); alanHata++; }
        });
      });
      if (a.quiz.q && b.quiz.q && a.quiz.q === b.quiz.q){ sorun.push(ad+' quiz sorusu hâlâ Türkçe'); alanHata++; }
    }
    /* kontrol ve durum anahtarları motoru sürüyor, birebir aynı olmalı */
    const ac = (a.controls||[]).map(c=>c.k).join(','), bc = (b.controls||[]).map(c=>c.k).join(',');
    if (ac !== bc){ sorun.push(ad+' controls anahtarları TR {'+ac+'} EN {'+bc+'}'); yapiHata++; }
    (a.controls||[]).forEach((c,j) => { const p=(b.controls||[])[j]; if(!p) return;
      if (c.min!==p.min || c.max!==p.max || c.step!==p.step || c.val!==p.val){
        sorun.push(ad+' control "'+c.k+'" aralığı farklı'); yapiHata++; } });
    METIN.forEach(k => {
      if (a[k] && !b[k]) { sorun.push(ad+' "'+k+'" EN tarafında yok'); alanHata++; }
      else if (a[k] && b[k] && a[k] === b[k]) { sorun.push(ad+' "'+k+'" hâlâ Türkçe (birebir aynı)'); alanHata++; }
      else if (b[k] && TRCH.test(String(b[k]).replace(/<[^>]*>/g,''))) {
        /* Türkçe aslında da aynen geçen kelimeler ALINTI sayılır: tokenizasyon ve
           gömme derslerinde Türkçe örnek kelimeler bilerek korunuyor. */
        const cikar = s => String(s||'').replace(/<[^>]*>/g,' ')
          .match(/[\wçğıöşüÇĞİÖŞÜ]*[ğüşıöçĞÜŞİÖÇ][\wçğıöşüÇĞİÖŞÜ]*/g) || [];
        const trKelime = new Set(cikar(a[k]));
        const yeni = [...new Set(cikar(b[k]))].filter(w => !trKelime.has(w));
        if (yeni.length){
          sorun.push(ad+' "'+k+'" içinde çevrilmemiş Türkçe: ' + yeni.slice(0,4).join(', ')); alanHata++; }}
    });
  }
  if (sorun.length) console.log('  ' + id + '\n' + sorun.map(s => '      · ' + s).join('\n'));
});
if (!yapiHata && !alanHata) console.log('  ✓ çevrilmiş derslerde sorun yok');
else console.log('  toplam: ' + yapiHata + ' yapı uyuşmazlığı, ' + alanHata + ' alan sorunu');

/* ── 3 · viz.js tuval etiketleri ── */
console.log('\n── 3 · TUVAL ETİKETLERİ (viz.js) ──');
/* Tuval metinleri artık viz-sozluk.js'teki TUVAL_EN üzerinden çevriliyor.
   Envanter .tuval-envanter.json'da; üretmek için: node tuval-metin.js  */
let TUVAL_EN = {}, env = null;
try { TUVAL_EN = new Function(fs.readFileSync('./viz-sozluk.js','utf8') + ';return TUVAL_EN;')(); } catch(e){}
try { env = JSON.parse(fs.readFileSync('./.tuval-envanter.json','utf8')); } catch(e){}
let tuvalEksik = 0;
if (!env){
  console.log('  envanter yok · önce: node tuval-metin.js');
} else {
  const tumu = [...env.sabit.map(x => x[0]), ...env.sablon];
  const eksikTuval = tumu.filter(s => TUVAL_EN[s] === undefined);
  tuvalEksik = eksikTuval.length;
  console.log('  sözlükteki kayıt          : ' + Object.keys(TUVAL_EN).length);
  console.log('  çizilen benzersiz metin   : ' + tumu.length + '  (sabit ' + env.sabit.length +
              ' + sayı şablonu ' + env.sablon.length + ')');
  console.log('  karşılığı olmayan         : ' + tuvalEksik);
  eksikTuval.slice(0, 20).forEach(s => console.log('    ' + JSON.stringify(s).slice(0,90)));
  if (tuvalEksik > 20) console.log('    ... ve ' + (tuvalEksik-20) + ' tane daha');
  const uyumsuz = Object.entries(TUVAL_EN).filter(([k,v]) =>
    (k.match(/#/g)||[]).length !== (String(v).match(/#/g)||[]).length);
  if (uyumsuz.length){
    console.log('  ⚠ # yer tutucu sayısı uyuşmayan kayıt: ' + uyumsuz.length);
    uyumsuz.slice(0,10).forEach(([k]) => console.log('    ' + JSON.stringify(k).slice(0,80)));
  }
}

console.log('\n── ÖZET ──');
console.log('  çevrilmemiş ders   : ' + eksik.length + ' / ' + trIds.length);
console.log('  yapı uyuşmazlığı   : ' + yapiHata);
console.log('  eksik/çevrilmemiş alan : ' + alanHata);
console.log('  çevrilmemiş tuval etiketi : ' + tuvalEksik);
