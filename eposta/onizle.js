#!/usr/bin/env node
/* ML Academy · e-posta şablonu önizlemesi
   ─────────────────────────────────────────────────────────────────────
   Şablonlar Supabase'in Go değişkenlerini içerir ({{ .ConfirmationURL }}
   gibi). Tarayıcıda doğrudan açılınca o değişkenler ham metin olarak
   görünür ve tasarımı değerlendirmek zorlaşır.

   Bu betik değişkenleri örnek değerlerle doldurup üç şablonu tek bir
   sayfada yan yana yazar. Tek doğru kaynak yine şablon dosyalarıdır;
   burada kopya tutulmuyor, sadece değiştirilip birleştiriliyor.

       node eposta/onizle.js && open eposta/onizleme.html
*/

const fs   = require('fs');
const path = require('path');

const dizin = __dirname;

/* Supabase'in gerçekte göndereceği değerlerin makul karşılıkları. */
const ORNEK = {
  '.ConfirmationURL':
    'https://uhiwcrkwmyjzprmbuyja.supabase.co/auth/v1/verify?token=pkce_9f3c1a7e4b28&type=signup&redirect_to=https://mltraining.org',
  '.Email':    'ornek@mltraining.org',
  '.NewEmail': 'yeni@mltraining.org',
  '.SiteURL':  'https://mltraining.org',
  '.Token':    '482915',
};

const SABLONLAR = [
  { dosya:'dogrulama.html',      ad:'Confirm signup',
    konu:'ML Academy · e-posta adresini doğrula' },
  { dosya:'sifirlama.html',      ad:'Reset password',
    konu:'ML Academy · şifreni sıfırla' },
  { dosya:'adres-degistir.html', ad:'Change email address',
    konu:'ML Academy · yeni e-posta adresini onayla' },
];

/* {{ .Foo }} ve {{.Foo}} yazımlarının ikisini de karşıla. */
function doldur(html){
  return html.replace(/\{\{\s*(\.[A-Za-z]+)\s*\}\}/g, (tam, ad) =>
    Object.prototype.hasOwnProperty.call(ORNEK, ad) ? ORNEK[ad] : tam);
}

/* Şablonun <body> içeriğini al: iframe yerine doğrudan gömüyoruz,
   böylece dosya tek parça kalır ve çevrimdışı açılır. */
function govde(html){
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return m ? m[1] : html;
}

const parcalar = SABLONLAR.map(s => {
  const ham = fs.readFileSync(path.join(dizin, s.dosya), 'utf8');
  return `
  <section>
    <div class="ust">
      <div class="ad">${s.ad}</div>
      <div class="yol">eposta/${s.dosya}</div>
    </div>
    <div class="kutu">
      <div class="satir"><span>Kimden</span> ML Academy &lt;noreply@mltraining.org&gt;</div>
      <div class="satir"><span>Konu</span> <b>${s.konu}</b></div>
    </div>
    <div class="cerceve">${doldur(govde(ham))}</div>
  </section>`;
}).join('\n');

const cikti = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ML Academy · e-posta şablonları</title>
<style>
  :root{ --bg:#f6f8fc; --panel:#fff; --line:#dde5ef; --txt:#0f1b2d; --mut:#586a80;
         --mono:'SF Mono',ui-monospace,Menlo,Consolas,monospace; }
  *{box-sizing:border-box}
  body{margin:0;padding:40px 20px 80px;background:var(--bg);color:var(--txt);
       font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
  h1{max-width:640px;margin:0 auto 6px;font-size:24px}
  .not{max-width:640px;margin:0 auto 44px;color:var(--mut);font-size:14px;line-height:1.65}
  section{max-width:640px;margin:0 auto 60px}
  .ust{display:flex;align-items:baseline;gap:12px;margin-bottom:14px}
  .ad{font-weight:700;font-size:15px}
  .yol{font-family:var(--mono);font-size:11.5px;color:var(--mut)}
  .kutu{background:var(--panel);border:1px solid var(--line);border-radius:12px 12px 0 0;
        border-bottom:0;padding:14px 18px}
  .satir{font-size:13px;line-height:1.9;color:var(--txt)}
  .satir span{display:inline-block;width:62px;color:var(--mut);
              font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase}
  .cerceve{border:1px solid var(--line);border-radius:0 0 12px 12px;overflow:hidden}
  .cerceve > table{margin:0 !important}
</style></head>
<body>
  <h1>E-posta şablonları · önizleme</h1>
  <p class="not">Bu dosya <code>node eposta/onizle.js</code> ile üretildi ve elle
     düzenlenmemeli. Değişkenler örnek değerlerle dolduruldu; gerçek e-postada
     Supabase kendi değerlerini koyar. Şablonu değiştirdikten sonra betiği
     tekrar çalıştır.</p>
${parcalar}
</body></html>
`;

const hedef = path.join(dizin, 'onizleme.html');
fs.writeFileSync(hedef, cikti);
console.log(`${SABLONLAR.length} şablon birleştirildi → ${path.relative(process.cwd(), hedef)}`);
