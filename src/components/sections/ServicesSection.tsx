"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Sparkles, Zap, Shield, GitBranch, Star, Heart, Clock, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles, Zap, Shield, GitBranch, Star, Heart,
};

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="services" ref={ref} className="py-24 lg:py-36 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex items-center gap-3 mb-5"
          >
            <div className="h-px w-10 bg-brand-400" />
            <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">Our Services</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 leading-tight mb-5"
          >
            Comprehensive Care
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-teal-500">
              For Every Smile
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg leading-relaxed"
          >
            From preventive care to full smile transformations, our specialists 
            provide treatments that are precise, comfortable, and lasting.
          </motion.p>
        </div>

        {/* Service Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon];
            const isHovered = hovered === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 + 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(service.id)}
                onMouseLeave={() => setHovered(null)}
                className="group relative bg-white rounded-2xl p-7 cursor-pointer border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: isHovered ? service.accent + "20" : "#f3f4f6",
                      }}
                    >
                      {Icon && (
                        <Icon
                          size={22}
                          style={{ color: isHovered ? service.accent : "#6b7280" }}
                          className="transition-colors duration-300"
                        />
                      )}
                    </div>
                    <span
                      className="text-xs font-medium px-3 py-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: isHovered ? service.accent + "15" : "#f3f4f6",
                        color: isHovered ? service.accent : "#9ca3af",
                      }}
                    >
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-transparent">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Clock size={13} />
                      {service.duration}
                    </div>
                    <div
                      className="flex items-center gap-1 text-xs font-medium transition-all duration-300 opacity-0 group-hover:opacity-100"
                      style={{ color: service.accent }}
                    >
                      Learn more <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-14 text-center"
        >
          <a
            href="#booking"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-teal-500 text-white font-semibold px-8 py-4 rounded-full hover:shadow-xl hover:shadow-brand-200/50 hover:-translate-y-0.5 transition-all"
          >
            <Sparkles size={16} />
            Schedule Your Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
