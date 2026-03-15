"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Star, Shield, Award } from "lucide-react";

const TOTAL_FRAMES = 120;
const FRAMES_BASE = "/frames";

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [framesLoaded, setFramesLoaded] = useState(0);
  const [hasFrames, setHasFrames] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 0.3, 0.1]);
  const scaleCanvas = useTransform(scrollYProgress, [0, 0.3], [1.06, 1]);

  // Draw a frame on canvas
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const x = (cw - iw * scale) / 2;
    const y = (ch - ih * scale) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, iw * scale, ih * scale);
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      drawFrame(currentFrameRef.current);
    };

    setSize();
    window.addEventListener("resize", setSize);

    // Check if frames exist by trying to load first one
    const testImg = new Image();
    testImg.src = `${FRAMES_BASE}/frame001.png`;
    testImg.onload = () => {
      setHasFrames(true);
      imagesRef.current = new Array(TOTAL_FRAMES).fill(null);
      imagesRef.current[0] = testImg;
      drawFrame(0);
      setFramesLoaded(1);

      // Load rest of frames
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        const num = String(i + 1).padStart(3, "0");
        img.src = `${FRAMES_BASE}/frame${num}.png`;
        img.onload = () => {
          imagesRef.current[i] = img;
          setFramesLoaded((p) => p + 1);
        };
      }
    };
    testImg.onerror = () => setHasFrames(false);

    return () => window.removeEventListener("resize", setSize);
  }, []);

  // Scroll-driven frame update
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (!hasFrames) return;
      const target = Math.min(
        Math.floor(v * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      );
      if (target === currentFrameRef.current) return;
      currentFrameRef.current = target;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(target));
    });
    return () => {
      unsubscribe();
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress, hasFrames]);

  const loadingPercent = Math.round((framesLoaded / TOTAL_FRAMES) * 100);

  return (
    <div ref={sectionRef} className="scroll-section relative" style={{ height: "500vh" }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Canvas for frame animation (or gradient fallback) */}
        <motion.div
          style={{ scale: scaleCanvas }}
          className="absolute inset-0 origin-center"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: hasFrames ? "block" : "none" }}
          />

          {/* Fallback gradient when no frames */}
          {!hasFrames && (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-800 to-teal-800">
              {/* Animated mesh */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full mix-blend-overlay"
                    style={{
                      width: `${200 + i * 80}px`,
                      height: `${200 + i * 80}px`,
                      left: `${10 + (i % 4) * 25}%`,
                      top: `${20 + Math.floor(i / 4) * 40}%`,
                      background: i % 2 === 0
                        ? "radial-gradient(circle, rgba(29,166,251,0.4) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(32,175,170,0.3) 0%, transparent 70%)",
                    }}
                    animate={{
                      x: [0, 30, 0, -20, 0],
                      y: [0, -20, 10, 0],
                      scale: [1, 1.1, 0.95, 1],
                    }}
                    transition={{
                      duration: 8 + i * 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.7,
                    }}
                  />
                ))}
              </div>
              {/* Tooth illustration */}
              <div className="absolute inset-0 flex items-center justify-end pr-[10%]">
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="opacity-10"
                >
                  <svg width="320" height="380" viewBox="0 0 320 380" fill="none">
                    <path
                      d="M160 10C100 10 50 55 50 110c0 35 15 65 38 85 12 10 20 25 20 42v50c0 8 6 14 14 14h76c8 0 14-6 14-14v-50c0-17 8-32 20-42 23-20 38-50 38-85 0-55-50-100-110-100z"
                      fill="white"
                    />
                    <rect x="116" y="301" width="88" height="18" rx="9" fill="white" opacity=".6" />
                    <rect x="122" y="325" width="76" height="18" rx="9" fill="white" opacity=".4" />
                    <rect x="132" y="349" width="56" height="18" rx="9" fill="white" opacity=".25" />
                  </svg>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Dark overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black/20 pointer-events-none"
        />

        {/* Foreground content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6">
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="text-center max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-8"
            >
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              Premium Dental Care — Est. 2009
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-6xl lg:text-8xl font-light text-white leading-[1.05] mb-6"
            >
              Your Perfect
              <br />
              <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-teal-300">
                Smile
              </em>{" "}
              Starts Here
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-white/70 text-lg sm:text-xl max-w-xl mx-auto mb-10 font-light"
            >
              Where cutting-edge technology meets artistry. We craft smiles
              that radiate confidence, health, and joy.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#booking"
                className="group relative bg-white text-brand-700 font-semibold px-8 py-4 rounded-full overflow-hidden hover:shadow-2xl hover:shadow-brand-400/30 transition-all hover:-translate-y-1"
              >
                <span className="relative z-10">Book Free Consultation</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-50 to-teal-50 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              </a>
              <a
                href="#services"
                className="flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white font-medium px-8 py-4 rounded-full backdrop-blur-sm transition-all hover:-translate-y-1"
              >
                Explore Services
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 px-4"
        >
          {[
            { icon: Shield, text: "ADA Certified" },
            { icon: Award, text: "Top-Rated 2024" },
            { icon: Star, text: "4.9 ★ Rating" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 text-white/60 text-xs font-medium"
            >
              <Icon size={13} className="text-teal-400" />
              {text}
            </div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 right-8 flex flex-col items-center gap-1.5 text-white/40"
        >
          <span className="text-[10px] tracking-widest uppercase rotate-90 mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowDown size={14} />
          </motion.div>
        </motion.div>

        {/* Frame loader */}
        {hasFrames && framesLoaded < TOTAL_FRAMES && (
          <div className="absolute bottom-20 right-8 text-white/30 text-xs">
            Loading {loadingPercent}%
          </div>
        )}
      </div>
    </div>
  );
}
