"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award } from "lucide-react";
import { TEAM } from "@/lib/utils";

const BG_GRADIENTS = [
  "from-brand-400 to-brand-600",
  "from-teal-400 to-teal-600",
  "from-violet-400 to-purple-600",
];

export default function TeamSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" ref={ref} className="py-24 lg:py-36 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-10 bg-brand-400" />
            <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">Meet the Team</span>
            <div className="h-px w-10 bg-brand-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-display text-4xl sm:text-5xl font-light text-gray-900 mb-4"
          >
            Experts Dedicated
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-teal-500">
              to Your Smile
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-gray-500"
          >
            Our specialists bring decades of combined experience and genuine passion for changing lives through dentistry.
          </motion.p>
        </div>

        {/* Team cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 + 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Color header */}
              <div className={`relative h-40 bg-gradient-to-br ${BG_GRADIENTS[i]} flex items-end justify-center pb-0`}>
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" viewBox="0 0 200 160">
                    <circle cx="180" cy="20" r="60" fill="white" fillOpacity=".3" />
                    <circle cx="20" cy="140" r="50" fill="white" fillOpacity=".2" />
                  </svg>
                </div>
                {/* Avatar */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-white/20 border-4 border-white/50 flex items-center justify-center font-display text-2xl text-white font-light translate-y-10 shadow-xl">
                  {member.avatar}
                </div>
              </div>

              {/* Content */}
              <div className="pt-14 pb-6 px-6 text-center">
                <h3 className="font-display text-xl font-medium text-gray-900 mb-1">{member.name}</h3>
                <p className="text-brand-500 text-sm font-medium mb-1">{member.role}</p>
                <p className="text-gray-400 text-xs mb-4">{member.education}</p>

                {/* Experience badge */}
                <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                  <Award size={12} />
                  {member.experience} experience
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap justify-center gap-1.5">
                  {member.specialties.map((s) => (
                    <span key={s} className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
