"use client";
import { useEffect, useRef, useCallback } from "react";

interface UseScrollFrameOptions {
  totalFrames: number;
  basePath: string;
  scrollHeight?: number; // px of scroll range to animate over
}

export function useScrollFrame({
  totalFrames,
  basePath,
  scrollHeight = 3000,
}: UseScrollFrameOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const loadedRef = useRef(0);

  const frameIndex = useCallback(
    (scrollY: number, offsetTop: number) => {
      const scrolled = Math.max(0, scrollY - offsetTop);
      const progress = Math.min(scrolled / scrollHeight, 1);
      return Math.min(Math.floor(progress * (totalFrames - 1)), totalFrames - 1);
    },
    [totalFrames, scrollHeight]
  );

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cover-fit
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const scale = Math.max(cw / iw, ch / ih);
    const x = (cw - iw * scale) / 2;
    const y = (ch - ih * scale) / 2;
    ctx.drawImage(img, x, y, iw * scale, ih * scale);
  }, []);

  const handleScroll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const offsetTop = canvas.closest(".scroll-section")?.getBoundingClientRect().top
      ? (canvas.closest(".scroll-section") as HTMLElement).offsetTop
      : 0;
    const target = frameIndex(window.scrollY, offsetTop);
    if (target === currentFrameRef.current) return;
    currentFrameRef.current = target;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => drawFrame(target));
  }, [frameIndex, drawFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener("resize", resize);

    // Preload frames with priority on first few
    const preload = () => {
      imagesRef.current = Array(totalFrames).fill(null);

      const loadImage = (i: number) => {
        const img = new Image();
        const num = String(i + 1).padStart(3, "0");
        img.src = `${basePath}/frame${num}.png`;
        img.onload = () => {
          imagesRef.current[i] = img;
          loadedRef.current++;
          if (i === 0) drawFrame(0); // Draw first frame immediately
        };
        img.onerror = () => {
          // fallback - just count as loaded
          loadedRef.current++;
        };
        return img;
      };

      // Load first 10 eagerly, rest lazily
      for (let i = 0; i < Math.min(10, totalFrames); i++) loadImage(i);
      setTimeout(() => {
        for (let i = 10; i < totalFrames; i++) loadImage(i);
      }, 500);
    };

    preload();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [totalFrames, basePath, handleScroll, drawFrame]);

  return { canvasRef };
}
