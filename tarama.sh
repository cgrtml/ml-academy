#!/bin/bash
# Bütün derslerin ilk adımını ekran görüntüsüne alır (görsel hata taraması için)
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
KOK="${1:-http://localhost:8899}"
mkdir -p /tmp/mlq && rm -f /tmp/mlq/*.png
IDS=$(node -e "
const fs=require('fs');
eval(fs.readFileSync('viz.js','utf8')+fs.readFileSync('content.js','utf8')+
  'console.log(Object.keys(DERSLER).join(\" \"))');
")
for id in $IDS; do
  "$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1400,900 --virtual-time-budget=5000 \
    --screenshot="/tmp/mlq/$id.png" "$KOK/lesson.html?id=$id" 2>/dev/null
done
ls /tmp/mlq/*.png | wc -l | xargs echo "alınan görüntü:"
