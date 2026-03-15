# Frames Directory

Place your video frames here as:
  frame001.png
  frame002.png
  ...
  frame120.png

## Extract frames with FFmpeg:

```bash
# Extract 120 frames from a video (adjust fps as needed)
ffmpeg -i your-video.mp4 -vframes 120 -q:v 2 frame%03d.png

# Or extract at a specific FPS
ffmpeg -i your-video.mp4 -vf fps=12 -q:v 2 frame%03d.png
```

## Tips:
- Use WebP for better compression: change frame001.png → frame001.webp
  (update FRAMES_BASE and extension in HeroSection.tsx)
- Recommended resolution: 1920×1080 or 1280×720
- 60-120 frames gives a smooth animation
