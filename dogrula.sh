#!/bin/bash
# ML Academy · tam doğrulama
# 1) sözdizimi  2) sayısal iddialar + yapı denetimi  3) çizim testi
cd "$(dirname "$0")"
echo "── 1 · SÖZDİZİMİ ──"
node -e "
const fs=require('fs');
['viz.js','content.js','content-en.js','modeller.js','kitap-kaynak.js'].forEach(f=>{new Function(fs.readFileSync(f,'utf8'));console.log('  ✓ '+f)});
['index.html','lesson.html','modeller.html'].forEach(f=>{const s=fs.readFileSync(f,'utf8');
  [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(m=>new Function(m[1]));console.log('  ✓ '+f)});
" || exit 1
echo; echo "── 2 · SAYI + YAPI ──"; node denetim.js 2>&1 | tail -14
echo; echo "── 3 · ÇİZİM ──"; node cizim-testi.js 2>&1 | tail -6
