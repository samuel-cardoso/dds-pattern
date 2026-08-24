#!/usr/bin/env bash
# Regenerates public/sample-dds.mp4: a local 14s test pattern (with running
# clock) used by the DDS demo's VideoViewer, so the demo doesn't depend on an
# external video host. Requires ffmpeg (brew install ffmpeg).
set -euo pipefail

cd "$(dirname "$0")/.."

ffmpeg -y -f lavfi -i "testsrc=size=854x480:rate=30:duration=14" \
  -f lavfi -i "sine=frequency=440:duration=14" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest \
  public/sample-dds.mp4
