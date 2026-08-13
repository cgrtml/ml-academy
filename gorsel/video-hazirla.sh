#!/usr/bin/env bash
# ML Academy · tanıtım videosunu paylaşıma hazırla
# ─────────────────────────────────────────────────────────────────────
# macOS ekran kaydı (Cmd+Shift+5) büyük ve ham çıkıyor; olduğu gibi
# yüklenince LinkedIn ve X yeniden sıkıştırıp bulanıklaştırıyor. Bu betik
# önceden doğru boyuta ve bit hızına getiriyor, sonuç daha net oluyor.
#
#     ./gorsel/video-hazirla.sh ~/Desktop/kayit.mov
#
# Üretilenler, kaydın yanına:
#   *-linkedin.mp4   1280x720  · LinkedIn, X, Reddit
#   *-kare.mp4       1080x1080 · Instagram, LinkedIn akışında daha çok yer kaplar
#   *-onizleme.gif   800px     · GitHub README, e-posta
set -e
[ -z "$1" ] && { echo "kullanım: $0 <kayit.mov>"; exit 1; }
[ -f "$1" ] && : || { echo "dosya yok: $1"; exit 1; }

GIRDI="$1"
KOK="${GIRDI%.*}"

echo "→ süre ve boyut"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$GIRDI"

echo "→ linkedin/x · 1280x720"
ffmpeg -loglevel error -y -i "$GIRDI" \
  -vf "scale=1280:-2:flags=lanczos,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x070a0f,fps=30" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -movflags +faststart -an \
  "${KOK}-linkedin.mp4"

echo "→ kare · 1080x1080"
ffmpeg -loglevel error -y -i "$GIRDI" \
  -vf "scale=1080:-2:flags=lanczos,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:color=0x070a0f,fps=30" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -movflags +faststart -an \
  "${KOK}-kare.mp4"

echo "→ gif · 800px"
# İki geçiş: önce renk paleti çıkarılıyor, sonra o paletle kodlanıyor.
# Tek geçişte GIF'te bantlaşma oluyor, grafiklerde bu çok göze batıyor.
ffmpeg -loglevel error -y -i "$GIRDI" \
  -vf "fps=15,scale=800:-1:flags=lanczos,palettegen=stats_mode=diff" "${KOK}-palet.png"
ffmpeg -loglevel error -y -i "$GIRDI" -i "${KOK}-palet.png" \
  -lavfi "fps=15,scale=800:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
  "${KOK}-onizleme.gif"
rm -f "${KOK}-palet.png"

echo
ls -lh "${KOK}"-linkedin.mp4 "${KOK}"-kare.mp4 "${KOK}"-onizleme.gif
