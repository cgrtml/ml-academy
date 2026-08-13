#!/usr/bin/env bash
# ML Academy · paylaşım kartlarını üret
# ─────────────────────────────────────────────────────────────────────
# kart.html'i üç biçimde ve iki dilde çizip PNG'ye alır. og-uret.sh ile
# aynı yöntem: kart elle çizilmiyor, tarayıcı çiziyor.
#
#   hikaye  1080x1920  Instagram / WhatsApp durumu
#   kare    1080x1080  Instagram gönderisi, LinkedIn kare
#   yatay   1200x627   LinkedIn / X gönderisi
#
# Ders sayısı ya da doğrulanan sayı değişince kart.html içindeki N
# nesnesini güncelle ve bunu tekrar çalıştır.
#
#     ./gorsel/kart-uret.sh
set -e
DIZIN="$(cd "$(dirname "$0")" && pwd)"
CIKTI="$DIZIN/paylasim"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p "$CIKTI"

uret(){   # $1 biçim  $2 genişlik  $3 yükseklik  $4 dil
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --screenshot="$CIKTI/$1-$4.png" --window-size="$2,$3" \
    "file://$DIZIN/kart.html?b=$1&d=$4" 2>/dev/null
  echo "  $1-$4.png   $2x$3"
}

for DIL in tr en; do
  uret hikaye 1080 1920 "$DIL"
  uret kare   1080 1080 "$DIL"
  uret yatay  1200  627 "$DIL"
done

echo
echo "gorsel/paylasim/ hazır"
