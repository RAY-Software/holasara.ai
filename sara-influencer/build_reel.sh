#!/bin/bash
set -e
cd ~/Desktop/sara-persona
mkdir -p reel clips
python3 make_caps.py

# ---------- SEG 1: hook de Sara (video con voz) + caption overlay ----------
ffmpeg -y -i clips/sara-instagram-9x16.mp4 -loop 1 -i reel/cap1.png -filter_complex "\
[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30[v0];\
[v0][1:v]overlay=0:0[v]" \
-map "[v]" -map 0:a -c:v libx264 -pix_fmt yuv420p -c:a aac -ar 44100 -ac 2 -t 8 -r 30 reel/seg1.mp4

# ---------- SEG 2: scroll del sitio real ----------
magick set/faceup-full.png -resize 1080x -gravity north -crop 1080x3520+0+0 +repage reel/scroll-src.png
ffmpeg -y -loop 1 -t 5 -i reel/scroll-src.png -loop 1 -i reel/cap2.png -f lavfi -t 5 -i anullsrc=r=44100:cl=stereo -filter_complex "\
[0:v]crop=1080:1920:0:'min(1600*t/5\,1600)',fps=30,setsar=1[v0];\
[v0][1:v]overlay=0:0[v]" \
-map "[v]" -map 2:a -c:v libx264 -pix_fmt yuv420p -c:a aac -ar 44100 -ac 2 -r 30 -t 5 reel/seg2.mp4

# ---------- SEG 3: zoom al chat real de Sara ----------
magick set/faceup-chat.png -resize 1080x -gravity north -crop 1080x1920+0+200 +repage reel/chat-1080.png
ffmpeg -y -loop 1 -t 5 -i reel/chat-1080.png -loop 1 -i reel/cap3.png -f lavfi -t 5 -i anullsrc=r=44100:cl=stereo -filter_complex "\
[0:v]scale=1080:1920,zoompan=z='min(zoom+0.0009\,1.15)':d=150:x='iw/2-(iw/zoom/2)':y=0:s=1080x1920:fps=30,setsar=1[v0];\
[v0][1:v]overlay=0:0[v]" \
-map "[v]" -map 2:a -c:v libx264 -pix_fmt yuv420p -c:a aac -ar 44100 -ac 2 -r 30 -t 5 reel/seg3.mp4

# ---------- CONCAT ----------
ffmpeg -y -i reel/seg1.mp4 -i reel/seg2.mp4 -i reel/seg3.mp4 -filter_complex "\
[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a]" \
-map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -c:a aac -movflags +faststart clips/sara-reel-instagram.mp4

echo "=== LISTO ==="
ffprobe -v error -show_entries format=duration:stream=width,height -of default=noprint_wrappers=1 clips/sara-reel-instagram.mp4
