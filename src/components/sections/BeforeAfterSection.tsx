"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────
// TO USE YOUR OWN IMAGES:
// 1. Create folder: public/before-after/
// 2. Add images:    case1-before.jpg, case1-after.jpg, etc.
// 3. Update the src fields below with your image paths
// ─────────────────────────────────────────────────────────────
const CASES = [
  {
    id: 1,
    title: "Smile Makeover",
    treatment: "Veneers + Whitening",
    duration: "3 visits",
    beforeLabel: "Before",
    afterLabel: "After",
    // Replace these with your own: "/before-after/case1-before.jpg"
    beforeSrc: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80",
    afterSrc:  "https://images.unsplash.com/photo-1581585104816-a53f7f67c9f1?w=800&q=80",
  },
  {
    id: 2,
    title: "Teeth Whitening",
    treatment: "Professional Bleaching",
    duration: "1 session",
    beforeLabel: "Before",
    afterLabel: "After",
    beforeSrc: "https://images.unsplash.com/photo-1588776814546-ec7e6b3cc7ab?w=800&q=80",
    afterSrc:  "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&q=80",
  },
  {
    id: 3,
    title: "Orthodontic Treatment",
    treatment: "Clear Aligners",
    duration: "14 months",
    beforeLabel: "Before",
    afterLabel: "After",
    beforeSrc: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80",
    afterSrc:  "https://images.unsplash.com/photo-1601063476271-a159c71ab0b3?w=800&q=80",
  },
];

function ComparisonSlider({ caseItem }: { caseItem: typeof CASES[0] }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => { if (isDragging) updatePos(e.clientX); },
    [isDragging, updatePos]
  );
  const onTouchMove = useCallback(
    (e: React.TouchEvent) => { updatePos(e.touches[0].clientX); },
    [updatePos]
  );

  useEffect(() => {
    const onUp = () => setIsDragging(false);
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] sm:aspect-[3/2] rounded-2xl overflow-hidden cursor-col-resize select-none bg-gray-200"
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
    >
      {/* ── BEFORE (full width base layer) ── */}
      <div className="absolute inset-0">
        <Image
          src={caseItem.beforeSrc}
          alt={`${caseItem.title} before`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          unoptimized={caseItem.beforeSrc.startsWith("http")}
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm tracking-wide">
          {caseItem.beforeLabel}
        </div>
      </div>

      {/* ── AFTER (clipped layer sliding from left) ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <Image
          src={caseItem.afterSrc}
          alt={`${caseItem.title} after`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          unoptimized={caseItem.afterSrc.startsWith("http")}
        />
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute top-4 right-4 bg-brand-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm tracking-wide">
          {caseItem.afterLabel}
        </div>
      </div>

      {/* ── Divider line ── */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] pointer-events-none z-10"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-2xl flex items-center justify-center gap-0.5 border-2 border-gray-100 z-20">
          <ChevronLeft size={13} className="text-gray-500" />
          <ChevronRight size={13} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCase, setActiveCase] = useState(0);

  return (
    <section id="results" ref={ref} className="py-24 lg:py-36 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="flex items-center gap-3 mb-5"
            >
              <div className="h-px w-10 bg-brand-400" />
              <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">Real Results</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 leading-tight"
            >
              Smile
              <br />
              Transformations
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg leading-relaxed"
          >
            Drag the slider to reveal the incredible difference our treatments make. 
            These are real patient results — no filters, no enhancements.
          </motion.p>
        </div>

        {/* Case tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveCase(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCase === i
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-200/50"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c.title}
            </button>
          ))}
        </motion.div>

        {/* Slider */}
        <motion.div
          key={activeCase}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <ComparisonSlider caseItem={CASES[activeCase]} />

          {/* Case details */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {[
              { label: "Treatment", value: CASES[activeCase].treatment },
              { label: "Duration", value: CASES[activeCase].duration },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-5 py-3 text-center">
                <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                <div className="font-semibold text-gray-800 text-sm">{value}</div>
              </div>
            ))}
            <a
              href="#booking"
              className="bg-brand-50 text-brand-600 rounded-xl px-5 py-3 text-sm font-medium hover:bg-brand-100 transition-colors"
            >
              Get Similar Results →
            </a>
          </div>
        </motion.div>

        {/* Instruction hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-400 text-sm mt-6 flex items-center justify-center gap-2"
        >
          <ChevronLeft size={14} />
          Drag slider to compare
          <ChevronRight size={14} />
        </motion.p>
      </div>
    </section>
  );
}
