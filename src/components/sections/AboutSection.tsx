"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Lightbulb, Users, CheckCircle } from "lucide-react";
import { STATS, TEAM } from "@/lib/utils";

const VALUES = [
  { icon: Heart, title: "Patient-First Care", desc: "Your comfort and wellbeing guide every decision we make." },
  { icon: Lightbulb, title: "Innovation", desc: "We invest in the latest technology to deliver precise, painless results." },
  { icon: Users, title: "Lifelong Relationships", desc: "We see patients as partners in their oral health journey." },
];

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-24 lg:py-36 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="h-px w-10 bg-brand-400" />
          <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">About Us</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
          {/* Left: Text */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 leading-tight mb-6"
            >
              Crafting Beautiful
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-teal-500">
                Smiles Since 2009
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-gray-500 text-lg leading-relaxed mb-6"
            >
              At Lumina Dental, we believe a healthy smile is the foundation of confidence. 
              Founded by Dr. Sophia Merritt, our clinic blends clinical excellence with 
              genuine compassion — creating an environment where anxiety dissolves and 
              patients leave beaming.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-gray-500 text-lg leading-relaxed mb-10"
            >
              From routine cleanings to full smile transformations, every treatment 
              is tailored precisely to you — because no two smiles are alike.
            </motion.p>
            {/* Checklist */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="space-y-3"
            >
              {[
                "State-of-the-art digital X-rays & 3D imaging",
                "Same-day emergency appointments",
                "Flexible payment plans & insurance accepted",
                "Sedation dentistry available",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-600">
                  <CheckCircle size={18} className="text-teal-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main card */}
            <div className="relative bg-gradient-to-br from-brand-50 to-teal-50 rounded-3xl p-8 lg:p-10">
              {/* Decorative blobs */}
              <div className="absolute top-6 right-6 w-32 h-32 rounded-full bg-brand-100/70 blur-2xl" />
              <div className="absolute bottom-6 left-6 w-24 h-24 rounded-full bg-teal-100/70 blur-2xl" />

              {/* Doctor avatar area */}
              <div className="relative z-10 flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white font-display text-3xl font-light shadow-xl shadow-brand-200/60 mb-4">
                  SM
                </div>
                <h3 className="font-display text-2xl font-medium text-gray-900">Dr. Sophia Merritt</h3>
                <p className="text-brand-500 text-sm font-medium mt-1">Founder & Lead Cosmetic Dentist</p>
                <p className="text-gray-500 text-sm mt-2 max-w-xs">
                  Harvard-trained specialist with 15+ years crafting transformative smiles.
                </p>
              </div>

              {/* Credential badges */}
              <div className="relative z-10 flex flex-wrap justify-center gap-2">
                {["Harvard DMD", "ADA Member", "AACD Fellow", "Board Certified"].map((cred) => (
                  <span
                    key={cred}
                    className="bg-white/80 backdrop-blur text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-white shadow-sm"
                  >
                    {cred}
                  </span>
                ))}
              </div>
            </div>

            {/* Floating stat card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <Heart size={18} className="text-teal-500" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">98%</div>
                <div className="text-xs text-gray-500">Patient Satisfaction</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
            >
              <div className="text-2xl font-bold text-gray-900 font-display">12k+</div>
              <div className="text-xs text-gray-500">Smiles Transformed</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i + 0.5, duration: 0.7 }}
              className="bg-gray-50 rounded-2xl p-6 hover:bg-brand-50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-100 group-hover:bg-brand-200 flex items-center justify-center mb-4 transition-colors">
                <v.icon size={22} className="text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center py-8 border-r last:border-r-0 border-gray-100">
              <div className="font-display text-4xl lg:text-5xl font-light text-brand-600 mb-2">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
