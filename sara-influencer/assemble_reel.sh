#!/bin/bash
set -e
cd ~/Desktop/sara-persona
python3 make_caps2.py
mkdir -p reel clips

# clip, caption -> segmento: trim cola 0.4s, speed 1.2x (v+a), 24fps, overlay
seg () {
  local IN=$1 CAP=$2 OUT=$3
  ffmpeg -y -i "$IN" -loop 1 -i "$CAP" -filter_complex "\
[0:v]trim=0:7.6,setpts=(PTS-STARTPTS)/1.2,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=24,setsar=1[v0];\
[v0][1:v]overlay=0:0[v];\
[0:a]atrim=0:7.6,asetpts=PTS-STARTPTS,atempo=1.2[a]" \
    -map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -c:a aac -ar 44100 -ac 2 -shortest "$OUT"
}

seg clips/cap1b.mp4 reel/kc1.png reel/r1.mp4
seg clips/cap2b.mp4 reel/kc2.png reel/r2.mp4
seg clips/cap3.mp4  reel/kc3.png reel/r3.mp4

ffmpeg -y -i reel/r1.mp4 -i reel/r2.mp4 -i reel/r3.mp4 -filter_complex "\
[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a]" \
-map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -c:a aac -movflags +faststart clips/sara-reel-v2.mp4

echo "=== LISTO ==="
ffprobe -v error -show_entries format=duration:stream=r_frame_rate,width,height -of default=noprint_wrappers=1 clips/sara-reel-v2.mp4
