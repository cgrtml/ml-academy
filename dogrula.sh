#!/bin/bash
# ML Academy · tam doğrulama
#   1) sözdizimi
#   2) sayısal iddialar + yapı denetimi
#   3) çizim testi (hiçbir widget patlamıyor)
#   4) taşma ve çakışma · TR yerleşimi
#   5) taşma ve çakışma · EN yerleşimi
#   6) EN modunda tuvale Türkçe metin çiziliyor mu
#   7) EN modunda çevrilmemiş metin var mı (tuval + arayüz)
#   8) her görselin ekran okuyucu için metin karşılığı var mı
#
# 4, 5, 6 ve 7 sonradan eklendi. Öncesinde yalnız Türkçe yerleşim ölçülüyordu:
# viz.js'teki VDIL localStorage'a bakıyor, Node'da yok, hep TR'ye düşüyordu.
# İngilizce karşılıklar Türkçesinden uzun olduğu için EN yerleşiminde 172
# taşma ve 13 bindirme birikmişti ve hiçbir test bunu görmüyordu. Ayrıca
# canlı rozet satırı [etiket, değer, renk] ve toplayıcılar yalnız etiketi
# alıyordu: sayfanın bastığı metnin yarısı hiçbir denetime girmiyor, 148
# Türkçe rozet İngilizce sayfada görünüyordu.
cd "$(dirname "$0")"

echo "── 1 · SÖZDİZİMİ ──"
node -e "
const fs=require('fs');
['viz.js','viz-sozluk.js','content.js','content-en.js','modeller.js','paylas.js'].forEach(f=>{new Function(fs.readFileSync(f,'utf8'));console.log('  ✓ '+f)});
['index.html','lesson.html','modeller.html'].forEach(f=>{const s=fs.readFileSync(f,'utf8');
  [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(m=>new Function(m[1]));console.log('  ✓ '+f)});
" || exit 1

echo; echo "── 2 · SAYI + YAPI ──";        node denetim.js         2>&1 | tail -14
echo; echo "── 3 · ÇİZİM ──";              node cizim-testi.js     2>&1 | tail -6
echo; echo "── 4 · TAŞMA · TR ──";         node tasma-testi.js     2>&1 | tail -5
echo; echo "── 5 · TAŞMA · EN ──"; DIL=en  node tasma-testi.js     2>&1 | tail -5
echo; echo "── 6 · TUVAL DİLİ · EN ──";    node tuval-en-denetim.js 2>&1 | tail -4
echo; echo "── 7 · ÇEVİRİ KAPSAMI · EN ──"; node en-denetim.js       2>&1 | tail -8
echo; echo "── 8 · TUVAL ÖZETLERİ ──";     node ozet-denetim.js     2>&1 | tail -6
