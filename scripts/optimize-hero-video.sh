#!/usr/bin/env bash
# optimize-hero-video.sh
# Compresses a source video for use as a hero background loop.
#
# Output targets:
#   hero.mp4  — H.264, 1280x720, ~1500 kbps, web-optimised (moov atom first)
#   hero.webm — VP9,   1280x720, ~1200 kbps, smaller for modern browsers
#
# Usage:
#   bash scripts/optimize-hero-video.sh <source.mp4> [output-dir]
#
# Defaults:
#   output-dir = public/videos

set -e

SOURCE="${1:?Usage: $0 <source.mp4> [output-dir]}"
OUTDIR="${2:-public/videos}"

if ! command -v ffmpeg &>/dev/null; then
  echo "Error: ffmpeg not found. Install with: brew install ffmpeg"
  exit 1
fi

mkdir -p "$OUTDIR"

echo "Source: $SOURCE"
echo "Output: $OUTDIR/"
echo ""

# ── MP4 (H.264 + AAC-stripped) ───────────────────────────────────────────────
# CRF 28 at 720p gives ~1.2–1.8 MB for a 14s clip.
# -movflags +faststart puts the moov atom at the front so the browser can play
# before the download completes.
echo "→ Encoding hero.mp4 (H.264, 720p, CRF 28)…"
ffmpeg -y \
  -i "$SOURCE" \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -profile:v high \
  -level 4.0 \
  -pix_fmt yuv420p \
  -an \
  -movflags +faststart \
  "$OUTDIR/hero.mp4"

# ── WebM (VP9) ────────────────────────────────────────────────────────────────
# Two-pass VP9 for tighter bitrate control. -b:v 0 + -crf 35 = quality-based.
echo "→ Encoding hero.webm (VP9, 720p, CRF 35)…"
ffmpeg -y \
  -i "$SOURCE" \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  -c:v libvpx-vp9 \
  -b:v 0 \
  -crf 35 \
  -deadline good \
  -cpu-used 2 \
  -pix_fmt yuv420p \
  -an \
  "$OUTDIR/hero.webm"

echo ""
echo "✓ Done. Output files:"
ls -lh "$OUTDIR/hero.mp4" "$OUTDIR/hero.webm"
echo ""
echo "Next: update VIDEO_SRC in components/blocks/Hero.tsx to '/videos/hero.mp4'"
echo "      and add a <source src='/videos/hero.webm' type='video/webm' /> as the first child."
