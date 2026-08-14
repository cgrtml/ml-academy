/* ML Academy · ders iniş sayfalarını üret
   ─────────────────────────────────────────────────────────────────────
   SORUN. Bütün dersler tek adreste yaşıyor: lesson.html?id=<ders>. O
   sayfanın ham HTML'i her ders için birebir aynı ve boş:

       <title>Ders · ML Academy</title>
       <h1 id="dAd"></h1>          ← boş, JS dolduruyor
       og etiketi                  ← hiç yok

   Sonuçları:
     · Arama motoru için 123 ders TEK sayfa. Ana sayfanın ham HTML'inde
       yalnız 3 ders bağlantısı var, kalan 120'si JS ile üretiliyor.
     · Sosyal ağ tarayıcıları (LinkedIn, WhatsApp, X) JavaScript
       ÇALIŞTIRMAZ. Paylaş düğmesiyle bir ders paylaşıldığında kart
       "Ders · ML Academy" diyor, yani paylaşım özelliği boşa çalışıyor.

   ÇÖZÜM. Her ders için gerçek bir iniş sayfası: ders/<dil>/<id>.html.
   Yönlendirme DEĞİL, kendi başına anlamlı bir sayfa; doğru başlık, özet,
   ne öğreneceğin, kaynaklar, ve derse giren bir düğme. Tarayıcı da insan
   da aynı sayfayı görüyor, yani gizleme yok.

   KİLİT. Her rotanın ilk 3 dersi kayıtsız açık, gerisi hesap istiyor. Bu
   kilit arayüz düzeyinde; içerik zaten content.js içinde ve herkese
   açık. Yine de arama motoruna dürüst davranmak için her sayfa
   schema.org isAccessibleForFree alanını gerçek duruma göre yazıyor.
   Google'ın bu durum için önerdiği yol bu.

   Kullanım:  node ders-sayfa-uret.js
   Üretilen:  ders/en/*.html · ders/tr/*.html · sitemap.xml · robots.txt
   ───────────────────────────────────────────────────────────────────── */

const fs = require('fs');
const path = require('path');

const KOK = 'https://mltraining.org';
const UCRETSIZ = 3;          // yapilandirma.js'teki SUPA.ucretsizDers ile aynı olmalı

/* ── müfredatı yükle ── */
const localStorage = { getItem: () => null, setItem(){}, removeItem(){} };
/* content.js "const ROTALAR" diyor; eval içindeki const dışarı sızmaz, o
   yüzden değerler eval'ın son ifadesiyle geri alınıyor. */
const { ROTALAR, DERSLER, DERSLER_EN, DERS_ADI_EN } = eval(
    fs.readFileSync('./viz.js', 'utf8')
  + fs.readFileSync('./content.js', 'utf8')
  + fs.readFileSync('./content-en.js', 'utf8')
  + ';({ ROTALAR, DERSLER, DERSLER_EN, DERS_ADI_EN })');

/* Rota adlarının İngilizcesi index.html'in içinde duruyor; oradan
   çekiliyor ki tek kaynak kalsın ve iki yerde ayrı ayrı güncellenmesin. */
const ROTA_EN = (() => {
  const s = fs.readFileSync('./index.html', 'utf8');
  const m = s.match(/rota:\{[\s\S]*?\n  \},/);
  if (!m) throw new Error('index.html içinde EN.rota bulunamadı');
  return eval('({' + m[0].replace(/,$/, '') + '})').rota;
})();

const kac = s => String(s == null ? '' : s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;');
/* Özetlerde <b> gibi etiketler var; meta açıklamasında düz metin gerekir. */
const duz = s => String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const kirp = (s, n) => s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';

const SOZ = {
  tr: { rota:'Rota', adim:'adım', xp:'XP', kaynak:'Kaynaklar', basla:'Derse başla',
        tumu:'Bütün dersler', ogren:'Bu derste ne var', acik:'Kayıt olmadan açık',
        kilit:'Ücretsiz hesap gerekiyor', altyazi:'ML Academy · tarayıcıda çalışan interaktif makine öğrenmesi kursu' },
  en: { rota:'Track', adim:'steps', xp:'XP', kaynak:'Sources', basla:'Start the lesson',
        tumu:'All lessons', ogren:'What is in this lesson', acik:'Open without an account',
        kilit:'A free account is needed', altyazi:'ML Academy · an interactive machine learning course that runs in your browser' },
};

/* ── ders envanteri ── */
const dersler = [];
/* Kendi sayfası olan dersler (content.js'te dis:'...'): bunlara iniş
   sayfası ÜRETİLMİYOR, çünkü zaten gerçek bir adresleri var ve ikinci bir
   adres uydurmak aynı dersi iki yere bölerdi. Etiketleri kendi dosyasında
   duruyor; buradan yalnız sitemap'e ekleniyorlar. */
const disDersler = [];
ROTALAR.forEach((r, ri) => r.dersler.forEach((rd, i) => {
  if (rd.durum !== 'hazir') return;
  /* Kendi sayfası olan ders iki dilde de var: ders-kanit.html ve
     ders-kanit-en.html. İkisi de sitemap'e giriyor, hreflang ile eşlenmiş
     hâlde kendi dosyalarında duruyorlar. */
  if (rd.dis){
    disDersler.push({ yol: rd.dis, acik: i < UCRETSIZ });
    const en = rd.dis.replace(/\.html$/, '-en.html');
    if (fs.existsSync(en)) disDersler.push({ yol: en, acik: i < UCRETSIZ });
    return;
  }
  const d = DERSLER[rd.id];
  /* Buraya düşmek gerçek bir tutarsızlıktır: müfredat dersi "hazır"
     diyor ama içeriği yok. Sessizce atlamak yerine haber ver. */
  if (!d){ console.log('  ! UYARI  ' + rd.id + ' müfredatta hazır ama içeriği yok'); return; }
  const en = DERSLER_EN[rd.id] || {};
  dersler.push({
    id: rd.id,
    rotaIx: ri,
    sira: i,
    acik: i < UCRETSIZ,
    adim: d.adimlar.length,
    xp: d.adimlar.reduce((a, s) => a + (s.xp || 5), 0),
    kaynaklar: d.kaynaklar || [],
    tr: { ad: d.ad, alt: duz(d.alt), rota: r.ad },
    en: { ad: en.ad || DERS_ADI_EN[rd.id] || d.ad,
          alt: duz(en.alt || d.alt),
          rota: (ROTA_EN[ri] || [])[0] || r.ad },
  });
}));

/* ── sayfa şablonu ── */
function sayfa(d, dil){
  const t = SOZ[dil], m = d[dil];
  const digerDil = dil === 'tr' ? 'en' : 'tr';
  const adres = `${KOK}/ders/${dil}/${d.id}.html`;
  const uygulama = `${KOK}/lesson.html?id=${encodeURIComponent(d.id)}&lang=${dil}`;
  const aciklama = kirp(m.alt, 300);

  /* Kaynak künyeleri iki dilde ortak tutuluyor, ama yazar alanında Türkçe
     "ve ark." geçiyor ve İngilizce sayfada yabancı duruyor. Yalnız görüntüde
     çevriliyor, veriye dokunulmuyor. */
  const yazar = x => dil === 'en' ? String(x || '').replace(/\bve ark\./g, 'et al.') : x;
  const kaynakHTML = d.kaynaklar.length
    ? `<h2>${t.kaynak}</h2>\n<ul class="kaynak">` + d.kaynaklar.map(k =>
        `<li><b>${kac(yazar(k.y))}</b> ${kac(k.t)} · ${kac(k.b)}${k.n ? ' · <i>' + kac(k.n) + '</i>' : ''}</li>`
      ).join('') + '</ul>'
    : '';

  /* isAccessibleForFree gerçeği söylüyor: kilitli dersler için false ve
     ücretsiz kısım hasPart ile işaretleniyor. Arama motoruna kullanıcının
     görmediği bir şeyi vaat etmemek için. */
  const jsonld = JSON.stringify({
    '@context':'https://schema.org',
    '@type':'LearningResource',
    name: m.ad,
    description: aciklama,
    url: adres,
    inLanguage: dil,
    isAccessibleForFree: d.acik,
    learningResourceType: 'Interactive lesson',
    educationalLevel: 'Beginner to advanced',
    timeRequired: 'PT' + Math.max(5, d.adim * 4) + 'M',
    isPartOf: { '@type':'Course', name:'ML Academy', url: KOK + '/' },
    provider: { '@type':'Person', name:'Cagri Temel', url: KOK + '/' },
  });

  return `<!doctype html>
<html lang="${dil}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${kac(m.ad)} · ML Academy</title>
<meta name="description" content="${kac(aciklama)}">
<link rel="canonical" href="${adres}">
<link rel="alternate" hreflang="${dil}" href="${adres}">
<link rel="alternate" hreflang="${digerDil}" href="${KOK}/ders/${digerDil}/${d.id}.html">
<meta property="og:type"        content="article">
<meta property="og:site_name"   content="ML Academy">
<meta property="og:title"       content="${kac(m.ad)}">
<meta property="og:description" content="${kac(aciklama)}">
<meta property="og:url"         content="${adres}">
<meta property="og:image"       content="${KOK}/gorsel/og.png">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="${kac(m.ad)}">
<meta name="twitter:description" content="${kac(aciklama)}">
<meta name="twitter:image"       content="${KOK}/gorsel/og.png">
<script type="application/ld+json">${jsonld}</script>
<style>
  :root{--bg:#f6f8fc;--panel:#fff;--line:#dde5ef;--txt:#0f1b2d;--mut:#586a80;
        --green:#0a8b68;--mono:'SF Mono',ui-monospace,Menlo,Consolas,monospace}
  @media(prefers-color-scheme:dark){:root{--bg:#080b11;--panel:#0f151e;--line:#1e2a3a;
        --txt:#e6edf3;--mut:#8494a8;--green:#22d3a0}}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--txt);line-height:1.65;
       font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif}
  .kap{max-width:720px;margin:0 auto;padding:40px 20px 90px}
  a{color:var(--green)}
  .ust{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;
       color:var(--mut);margin-bottom:18px}
  h1{font-size:clamp(24px,4vw,34px);line-height:1.18;letter-spacing:-.02em;margin:0 0 12px}
  .alt{color:var(--mut);font-size:17px;margin:0 0 22px}
  .satir{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:26px}
  .cip{font-family:var(--mono);font-size:12px;padding:5px 11px;border-radius:99px;
       border:1px solid var(--line);background:var(--panel);color:var(--mut)}
  .cip.ok{border-color:var(--green);color:var(--green)}
  .basla{display:inline-flex;align-items:center;gap:9px;background:var(--green);color:#fff;
         font-size:16px;font-weight:700;padding:14px 24px;border-radius:12px;text-decoration:none}
  h2{font-size:14px;font-family:var(--mono);letter-spacing:.14em;text-transform:uppercase;
     color:var(--mut);margin:36px 0 12px;font-weight:700}
  ul.kaynak{list-style:none;padding:0;margin:0;display:grid;gap:9px}
  ul.kaynak li{background:var(--panel);border:1px solid var(--line);border-radius:11px;
               padding:11px 14px;font-size:14px}
  ul.kaynak b{font-weight:700}
  .dip{margin-top:44px;padding-top:20px;border-top:1px solid var(--line);
       font-family:var(--mono);font-size:12.5px;color:var(--mut)}
</style>
</head>
<body>
<div class="kap">
  <div class="ust"><a href="${KOK}/?lang=${dil}">ML Academy</a> · ${kac(t.rota)} ${d.rotaIx} · ${kac(m.rota)}</div>
  <h1>${kac(m.ad)}</h1>
  <p class="alt">${kac(m.alt)}</p>
  <div class="satir">
    <span class="cip">${d.adim} ${kac(t.adim)}</span>
    <span class="cip">${d.xp} ${kac(t.xp)}</span>
    <span class="cip ${d.acik ? 'ok' : ''}">${kac(d.acik ? t.acik : t.kilit)}</span>
  </div>
  <a class="basla" href="${uygulama}">${kac(t.basla)} &rarr;</a>
  ${kaynakHTML}
  <div class="dip">${kac(t.altyazi)} · <a href="${KOK}/?lang=${dil}">${kac(t.tumu)}</a></div>
</div>
</body>
</html>
`;
}

/* ── yaz ── */
['en','tr'].forEach(dil => fs.mkdirSync(path.join('ders', dil), { recursive:true }));
let n = 0;
dersler.forEach(d => ['en','tr'].forEach(dil => {
  fs.writeFileSync(path.join('ders', dil, d.id + '.html'), sayfa(d, dil));
  n++;
}));

/* ── sitemap ── */
const girdi = (loc, oncelik) =>
  `  <url><loc>${loc}</loc><priority>${oncelik}</priority></url>`;
const satirlar = [
  girdi(KOK + '/', '1.0'),
  girdi(KOK + '/modeller.html', '0.8'),
  girdi(KOK + '/about.html', '0.5'),
  girdi(KOK + '/privacy.html', '0.3'),
];
dersler.forEach(d => ['en','tr'].forEach(dil =>
  satirlar.push(girdi(`${KOK}/ders/${dil}/${d.id}.html`, d.acik ? '0.9' : '0.7'))));
disDersler.forEach(d => satirlar.push(girdi(`${KOK}/${d.yol}`, d.acik ? '0.9' : '0.7')));
fs.writeFileSync('sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  satirlar.join('\n') + '\n</urlset>\n');

fs.writeFileSync('robots.txt',
  'User-agent: *\nAllow: /\n\nSitemap: ' + KOK + '/sitemap.xml\n');

console.log('  ders sayfası : ' + n + '  (' + dersler.length + ' ders × 2 dil)');
console.log('  kendi sayfası: ' + disDersler.length + '  (' +
            disDersler.map(d => d.yol).join(', ') + ')');
console.log('  kayıtsız açık: ' + dersler.filter(d => d.acik).length +
            '  ·  hesap gerekli: ' + dersler.filter(d => !d.acik).length);
console.log('  sitemap.xml  : ' + (satirlar.length) + ' adres');
console.log('  robots.txt   : yazıldı');
