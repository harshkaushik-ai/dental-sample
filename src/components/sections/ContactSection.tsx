"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const HOURS = [
  { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
  { day: "Saturday", hours: "9:00 AM – 3:00 PM" },
  { day: "Sunday", hours: "Emergency Only" },
];

const SOCIAL = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" ref={ref} className="py-24 lg:py-36 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-10 bg-brand-400" />
            <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">Find Us</span>
            <div className="h-px w-10 bg-brand-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-display text-4xl sm:text-5xl font-light text-gray-900 mb-4"
          >
            Visit Our Clinic
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-gray-500"
          >
            Conveniently located in the heart of the city, with free parking available.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 h-80 lg:h-auto min-h-[380px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648718453!2d-73.98784368459418!3d40.75797497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1635790498543!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 380 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lumina Dental Clinic Location"
            />
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="space-y-5"
          >
            {/* Address */}
            <InfoCard icon={MapPin} title="Address" accent="brand">
              <p className="text-gray-600">
                123 Lumina Plaza, Suite 400
                <br />
                New York, NY 10036
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-500 text-sm font-medium mt-2 inline-block hover:underline"
              >
                Get Directions →
              </a>
            </InfoCard>

            {/* Phone & Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoCard icon={Phone} title="Phone" accent="teal">
                <a href="tel:+12125550190" className="text-gray-600 hover:text-brand-500 transition-colors">
                  (212) 555-0190
                </a>
                <br />
                <span className="text-gray-400 text-xs">Emergency: (212) 555-0191</span>
              </InfoCard>
              <InfoCard icon={Mail} title="Email" accent="teal">
                <a href="mailto:hello@luminadental.com" className="text-gray-600 hover:text-brand-500 transition-colors text-sm break-all">
                  hello@luminadental.com
                </a>
              </InfoCard>
            </div>

            {/* Hours */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-brand-500" />
                <span className="font-semibold text-gray-800 text-sm">Opening Hours</span>
              </div>
              <div className="space-y-2">
                {HOURS.map(({ day, hours }) => (
                  <div key={day} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{day}</span>
                    <span className="font-medium text-gray-700">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-gradient-to-br from-brand-50 to-teal-50 rounded-2xl p-6">
              <p className="text-sm font-medium text-gray-700 mb-4">Follow our journey</p>
              <div className="flex gap-3">
                {SOCIAL.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-brand-500 hover:border-brand-200 hover:shadow-md transition-all"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: React.ElementType;
  title: string;
  accent: "brand" | "teal";
  children: React.ReactNode;
}) {
  const colors = accent === "brand"
    ? "text-brand-500 bg-brand-50"
    : "text-teal-500 bg-teal-50";

  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <div className={`w-9 h-9 rounded-lg ${colors} flex items-center justify-center mb-3`}>
        <Icon size={16} />
      </div>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{title}</div>
      {children}
    </div>
  );
}
