#!/usr/bin/env bash
# ML Academy · tanıtım videosunu sitenin kendi motoruyla üret
# ─────────────────────────────────────────────────────────────────────
# Ekran kaydı yok, yapay zeka video üreticisi yok. Kareleri viz.js
# içindeki gerçek polinom uydurma kodu çiziyor, sayılar dersin kendi
# live() çıktısından geliyor. Yani video ürünün canlandırması değil,
# ürünün kendisi.
#
#     ./gorsel/film-uret.sh
#
# Üretilenler: gorsel/tanitim.mp4 · gorsel/tanitim.gif
set -e
DIZIN="$(cd "$(dirname "$0")/.." && pwd)"
CIK="$DIZIN/gorsel/kareler"
KROM="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8902

rm -rf "$CIK"; mkdir -p "$CIK"

( cd "$DIZIN" && python3 -m http.server $PORT >/dev/null 2>&1 & echo $! > /tmp/mlfilm.pid )
sleep 2

echo "→ 9 kare çiziliyor"
for d in 1 2 3 4 5 6 7 8 9; do
  "$KROM" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=3000 \
    --screenshot="$CIK/d$(printf '%02d' $d).png" --window-size=1280,720 \
    "http://localhost:$PORT/gorsel/film.html?derece=$d" 2>/dev/null
  printf '  derece %d ✓\n' $d
done

kill "$(cat /tmp/mlfilm.pid)" 2>/dev/null || true
rm -f /tmp/mlfilm.pid

# Süreler: ilk ve son kare uzun dursun. İlk karede izleyici ne olduğunu
# anlıyor, son karede ezberlemenin sonucu akılda kalıyor. Aradakiler kısa.
echo "→ zaman çizelgesi"
{
  echo "file 'kareler/d01.png'"; echo "duration 2.2"
  for d in 02 03 04 05 06 07 08; do
    echo "file 'kareler/d$d.png'"; echo "duration 0.85"
  done
  echo "file 'kareler/d09.png'"; echo "duration 3.4"
  echo "file 'kareler/d09.png'"          # concat demuxer son kareyi tekrar ister
} > "$DIZIN/gorsel/liste.txt"

echo "→ mp4"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$DIZIN/gorsel/liste.txt" \
  -vf "fps=30,format=yuv420p" -c:v libx264 -profile:v high -crf 20 \
  -movflags +faststart "$DIZIN/gorsel/tanitim.mp4"

echo "→ gif"
ffmpeg -loglevel error -y -i "$DIZIN/gorsel/tanitim.mp4" \
  -vf "fps=12,scale=900:-1:flags=lanczos,palettegen=stats_mode=diff" "$DIZIN/gorsel/palet.png"
ffmpeg -loglevel error -y -i "$DIZIN/gorsel/tanitim.mp4" -i "$DIZIN/gorsel/palet.png" \
  -lavfi "fps=12,scale=900:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
  "$DIZIN/gorsel/tanitim.gif"
rm -f "$DIZIN/gorsel/palet.png" "$DIZIN/gorsel/liste.txt"

echo
ls -lh "$DIZIN/gorsel/tanitim.mp4" "$DIZIN/gorsel/tanitim.gif"
