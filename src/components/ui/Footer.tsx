"use client";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, ArrowUp, Heart } from "lucide-react";

const FOOTER_LINKS = {
  Services: [
    "Teeth Whitening",
    "Dental Implants",
    "Root Canal Treatment",
    "Orthodontics",
    "Smile Makeover",
    "Preventive Care",
  ],
  Company: ["About Us", "Our Team", "Careers", "Press", "Blog"],
  Support: ["Book Appointment", "Patient Portal", "Insurance Info", "Emergency Care", "Contact Us"],
};

const SOCIAL = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-gray-950 text-white">
      {/* Top CTA band */}
      <div className="bg-gradient-to-r from-brand-600 to-teal-600 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-light mb-1">
              Ready for your perfect smile?
            </h3>
            <p className="text-white/70 text-sm">First consultation is always free.</p>
          </div>
          <a
            href="#booking"
            className="flex-shrink-0 bg-white text-brand-700 font-semibold px-7 py-3.5 rounded-full hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all"
          >
            Book Free Consultation
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C9 2 6 4.5 6 8c0 2 .8 3.8 2 5 .6.6 1 1.4 1 2.2V17a1 1 0 001 1h4a1 1 0 001-1v-1.8c0-.8.4-1.6 1-2.2 1.2-1.2 2-3 2-5 0-3.5-3-6-6-6z"
                    fill="white"
                    fillOpacity=".9"
                  />
                </svg>
              </div>
              <span className="font-display text-xl font-semibold tracking-wide">
                Lumina<span className="text-brand-400">.</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Where cutting-edge technology meets artistry. We craft smiles that radiate 
              confidence, health, and joy — since 2009.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-500/20 border border-white/10 flex items-center justify-center text-gray-400 hover:text-brand-400 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm flex items-center gap-1.5">
            © {new Date().getFullYear()} Lumina Dental. Made with{" "}
            <Heart size={12} className="text-rose-400 fill-rose-400" /> for healthier smiles.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">HIPAA Notice</a>
          </div>
          <button
            onClick={scrollTop}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-brand-500/20 border border-white/10 flex items-center justify-center text-gray-500 hover:text-brand-400 transition-all"
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
