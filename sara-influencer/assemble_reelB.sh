#!/bin/bash
set -e
cd ~/Desktop/sara-persona
python3 make_capsB.py
mkdir -p reel clips

seg () {
  local IN=$1 CAP=$2 OUT=$3
  ffmpeg -y -i "$IN" -loop 1 -i "$CAP" -filter_complex "\
[0:v]trim=0:7.4,setpts=(PTS-STARTPTS)/1.2,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=24,setsar=1[v0];\
[v0][1:v]overlay=0:0[v];\
[0:a]atrim=0:7.4,asetpts=PTS-STARTPTS,atempo=1.2[a]" \
    -map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -c:a aac -ar 44100 -ac 2 -shortest "$OUT"
}

seg clips/capB1.mp4 reel/kcb1.png reel/rb1.mp4
seg clips/capB2.mp4 reel/kcb2.png reel/rb2.mp4
seg clips/capB3.mp4 reel/kcb3.png reel/rb3.mp4

ffmpeg -y -i reel/rb1.mp4 -i reel/rb2.mp4 -i reel/rb3.mp4 -filter_complex "\
[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a]" \
-map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -c:a aac -movflags +faststart clips/sara-reel-v2b.mp4

echo "=== LISTO ==="
ffprobe -v error -show_entries format=duration:stream=r_frame_rate,width,height -of default=noprint_wrappers=1 clips/sara-reel-v2b.mp4
