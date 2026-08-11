#!/usr/bin/env bash
# ML Academy · paylaşım görselini üret
# ─────────────────────────────────────────────────────────────────────
# og.png elle çizilmiyor: og.html tarayıcıda çizilip ekran görüntüsü
# alınıyor. Sebep, README'nin başına gelen şeyin buraya gelmemesi.
# Sayılar değişince bu betiği tekrar çalıştır, görsel de güncellensin.
#
#     ./gorsel/og-uret.sh
set -e
DIZIN="$(cd "$(dirname "$0")" && pwd)"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars \
  --screenshot="$DIZIN/og.png" --window-size=1200,630 \
  "file://$DIZIN/og.html"
echo "gorsel/og.png güncellendi"
