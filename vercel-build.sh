#!/bin/bash

# Install FFmpeg for Vercel
echo "Installing FFmpeg for Vercel..."

# Download and install FFmpeg
curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz -o ffmpeg.tar.xz
tar -xf ffmpeg.tar.xz
mv ffmpeg-*-amd64-static/ffmpeg /usr/local/bin/
chmod +x /usr/local/bin/ffmpeg

# Clean up
rm -rf ffmpeg-*-amd64-static ffmpeg.tar.xz

echo "FFmpeg installation completed!"
