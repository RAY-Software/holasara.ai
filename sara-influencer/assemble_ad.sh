#!/bin/bash
set -e
cd ~/Desktop/sara-persona
mkdir -p reel clips

# SEG1: Sara caminando (voz ROI) + hook caption
ffmpeg -y -hide_banner -loglevel error -i clips/sara-walk3.mp4 -loop 1 -i reel/adcap-hook.png -filter_complex "\
[0:v]trim=0:7.6,setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=24,setsar=1[v0];\
[v0][1:v]overlay=0:0[v];[0:a]atrim=0:7.6,asetpts=PTS-STARTPTS[a]" \
-map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -c:a aac -ar 44100 -ac 2 -shortest reel/adseg1.mp4

# SEG2: dashboard real (zoom lento)
ffmpeg -y -hide_banner -loglevel error -loop 1 -t 5 -i reel/ad-dash.png -f lavfi -t 5 -i anullsrc=r=44100:cl=stereo -filter_complex "\
[0:v]scale=2160:3840,zoompan=z='min(zoom+0.0004\,1.08)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=24,setsar=1[v]" \
-map "[v]" -map 1:a -c:v libx264 -pix_fmt yuv420p -c:a aac -ar 44100 -ac 2 -t 5 reel/adseg2.mp4

# SEG3: CTA (zoom sutil)
ffmpeg -y -hide_banner -loglevel error -loop 1 -t 3.5 -i reel/ad-cta.png -f lavfi -t 3.5 -i anullsrc=r=44100:cl=stereo -filter_complex "\
[0:v]scale=2160:3840,zoompan=z='min(zoom+0.0003\,1.05)':d=84:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=24,setsar=1[v]" \
-map "[v]" -map 1:a -c:v libx264 -pix_fmt yuv420p -c:a aac -ar 44100 -ac 2 -t 3.5 reel/adseg3.mp4

# CONCAT
ffmpeg -y -hide_banner -loglevel error -i reel/adseg1.mp4 -i reel/adseg2.mp4 -i reel/adseg3.mp4 -filter_complex "\
[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a]" \
-map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -c:a aac -movflags +faststart clips/sara-ad-roi.mp4

echo "=== LISTO ==="
ffprobe -v error -show_entries format=duration:stream=r_frame_rate,width,height -of default=noprint_wrappers=1 clips/sara-ad-roi.mp4
