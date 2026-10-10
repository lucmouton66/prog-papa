#!/usr/bin/env bash
# Compresse les vidéos déposées dans videos-a-integrer/ et les place dans public/videos/
# Usage: ./scripts/integrate-videos.sh
set -euo pipefail

SRC_DIR="$(dirname "$0")/../videos-a-integrer"
OUT_DIR="$(dirname "$0")/../public/videos"
mkdir -p "$OUT_DIR"

shopt -s nullglob
found=0
for f in "$SRC_DIR"/*.mp4 "$SRC_DIR"/*.mov "$SRC_DIR"/*.MOV "$SRC_DIR"/*.MP4; do
  [ -e "$f" ] || continue
  id="$(basename "${f%.*}")"
  out="$OUT_DIR/$id.mp4"
  echo "→ $id"
  ffmpeg -y -i "$f" \
    -vf "scale='min(720,iw)':-2" \
    -c:v libx264 -preset medium -crf 27 \
    -c:a aac -b:a 96k \
    -movflags +faststart \
    "$out" -loglevel error
  found=$((found + 1))
done

if [ "$found" -eq 0 ]; then
  echo "Aucune vidéo trouvée dans $SRC_DIR"
else
  echo ""
  echo "$found vidéo(s) compressée(s) dans $OUT_DIR"
fi
