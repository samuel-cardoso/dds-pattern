#!/usr/bin/env bash
# Regenerates public/sample-dds.mp4: a local 720p test pattern (with running
# clock) used by the DDS demo's VideoViewer, so the demo doesn't depend on an
# external video host. Long/high-bitrate on purpose (~2min, tens of MB) to
# exercise real Range-request streaming through the mock external CDN
# (scripts/mock-external-video-server.mjs), not just a tiny clip that loads
# in one shot. Requires ffmpeg (brew install ffmpeg).
set -euo pipefail

cd "$(dirname "$0")/.."

ffmpeg -y -f lavfi -i "testsrc=size=1280x720:rate=30:duration=120" \
  -f lavfi -i "sine=frequency=440:duration=120" \
  -c:v libx264 -pix_fmt yuv420p -b:v 8M -c:a aac -shortest \
  public/sample-dds.mp4
