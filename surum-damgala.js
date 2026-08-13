#!/usr/bin/env node
/* ML Academy · önbellek kırıcı sürüm damgası
   ─────────────────────────────────────────────────────────────────────
   Sorun: tarayıcılar ve GitHub Pages'in CDN'i .js dosyalarını agresif
   önbelleğe alıyor. Bir değişikliği push ettikten sonra kullanıcı hâlâ
   eski dosyayı görüyor ve "düzelmemiş" diye geri dönüyor. Bu üç kez oldu.

   Çözüm: her yerel betiğin adresine son commit'in kısa hash'ini ekle.
   Adres değişince tarayıcı dosyayı yeniden indirmek zorunda kalır.

   Kullanım:  node surum-damgala.js     (commit ATMADAN ÖNCE çalıştır)   */

const fs = require('fs');
const { execSync } = require('child_process');

const h = execSync('git rev-parse --short HEAD').toString().trim();
const YEREL = ['anlatim-en.js','anlatim.js','arayuz-sozluk.js','content-en.js','paylas.js',
               'content.js','modeller.js','topluluk/hesap.js','topluluk/topluluk.js',
               'topluluk/ilerleme.js','viz-sozluk.js','viz.js','yapilandirma.js'];
const kac = (s, f) => (s.match(new RegExp('src="' + f.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\?v=', 'g')) || []).length;

let toplam = 0;
for (const p of ['index.html','lesson.html','modeller.html','onay.html']){
  let s = fs.readFileSync(p, 'utf8');
  let n = 0;
  for (const f of YEREL){
    const kacan = f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const once = kac(s, f);
    s = s.replace(new RegExp('src="' + kacan + '(\\?v=[^"]*)?"', 'g'), `src="${f}?v=${h}"`);
    n += kac(s, f) - (once ? 0 : 0);
  }
  n = YEREL.reduce((a,f) => a + kac(s,f), 0);
  fs.writeFileSync(p, s);
  console.log(`${p.padEnd(15)} ${n} betik damgalandı`);
  toplam += n;
}
console.log(`\nsürüm: ${h}  ·  toplam ${toplam} betik`);
console.log('Not: bu damga BİR ÖNCEKİ commit\'in hash\'idir; önemli olan');
console.log('     her sürümde DEĞİŞMESİ, hangi değere eşit olduğu değil.');
