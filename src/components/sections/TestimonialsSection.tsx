"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Thompson",
    role: "Marketing Director",
    avatar: "ST",
    rating: 5,
    text: "I was terrified of the dentist for years. Dr. Merritt and her team completely changed my experience. My smile makeover took just three visits and the results are beyond what I imagined. I genuinely look forward to my check-ups now.",
    treatment: "Smile Makeover",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Software Engineer",
    avatar: "MR",
    rating: 5,
    text: "Had a dental implant done after losing a tooth in an accident. The process was explained thoroughly and was completely painless. Six months later, I can't tell the difference from my natural teeth. Exceptional work.",
    treatment: "Dental Implant",
  },
  {
    id: 3,
    name: "Aisha Patel",
    role: "Teacher",
    avatar: "AP",
    rating: 5,
    text: "Got clear aligners 14 months ago and just finished treatment. My teeth are perfectly straight now. The team checked in with me regularly and made every adjustment comfortable. Best investment I've made in myself.",
    treatment: "Clear Aligners",
  },
  {
    id: 4,
    name: "James O'Brien",
    role: "Restaurant Owner",
    avatar: "JO",
    rating: 5,
    text: "Whitening treatment gave me 7 shades brighter teeth in a single session. The staff are warm, professional, and efficient. Lumina is the only dental practice I'll ever recommend to family and friends.",
    treatment: "Teeth Whitening",
  },
  {
    id: 5,
    name: "Lin Wei",
    role: "Photographer",
    avatar: "LW",
    rating: 5,
    text: "As someone who photographs smiles for a living, I'm very particular about mine. Dr. Okafor designed a treatment plan that addressed spacing and alignment perfectly. The attention to aesthetic detail here is unmatched.",
    treatment: "Orthodontics",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(id);
  }, [autoplay]);

  const prev = () => {
    setAutoplay(false);
    setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };
  const next = () => {
    setAutoplay(false);
    setActive((a) => (a + 1) % TESTIMONIALS.length);
  };

  const t = TESTIMONIALS[active];

  return (
    <section ref={ref} className="py-24 lg:py-36 bg-gradient-to-b from-white to-[#f8f9fc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-10 bg-brand-400" />
            <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">Patient Stories</span>
            <div className="h-px w-10 bg-brand-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-display text-4xl sm:text-5xl font-light text-gray-900"
          >
            What Our Patients Say
          </motion.h2>
        </div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-10"
        >
          <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-100/80 p-8 lg:p-10 border border-gray-100">
            {/* Quote icon */}
            <div className="absolute top-6 right-8 text-brand-100">
              <Quote size={48} strokeWidth={1} />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
              ))}
            </div>

            {/* Quote text */}
            <motion.p
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-gray-700 text-lg leading-relaxed mb-8 font-light italic"
            >
              &ldquo;{t.text}&rdquo;
            </motion.p>

            {/* Author */}
            <motion.div
              key={`author-${t.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-gray-400 text-sm">{t.role}</div>
                </div>
              </div>
              <span className="text-xs font-medium bg-brand-50 text-brand-600 px-3 py-1.5 rounded-full">
                {t.treatment}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Controls + dots */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-400 hover:text-brand-500 transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); setAutoplay(false); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-8 bg-brand-500" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-400 hover:text-brand-500 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Summary stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-14 grid grid-cols-3 max-w-lg mx-auto gap-8 text-center"
        >
          {[
            { val: "4.9", sub: "Google Rating" },
            { val: "2,400+", sub: "5-Star Reviews" },
            { val: "98%", sub: "Would Recommend" },
          ].map(({ val, sub }) => (
            <div key={sub}>
              <div className="font-display text-3xl font-light text-brand-600 mb-1">{val}</div>
              <div className="text-gray-400 text-xs">{sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
