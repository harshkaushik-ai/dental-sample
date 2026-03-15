"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shadow-lg shadow-brand-200/50 group-hover:scale-105 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C9 2 6 4.5 6 8c0 2 .8 3.8 2 5 .6.6 1 1.4 1 2.2V17a1 1 0 001 1h4a1 1 0 001-1v-1.8c0-.8.4-1.6 1-2.2 1.2-1.2 2-3 2-5 0-3.5-3-6-6-6z"
                    fill="white"
                    fillOpacity=".9"
                  />
                  <rect x="9" y="18" width="6" height="1.5" rx=".75" fill="white" fillOpacity=".7" />
                  <rect x="9.5" y="20.5" width="5" height="1.5" rx=".75" fill="white" fillOpacity=".5" />
                </svg>
              </div>
              <span
                className={`font-display text-xl font-semibold tracking-wide transition-colors ${
                  scrolled ? "text-gray-900" : "text-white"
                }`}
              >
                Lumina<span className="text-brand-400">.</span>
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-brand-500 ${
                    scrolled ? "text-gray-600" : "text-white/80"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:+1234567890"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  scrolled ? "text-gray-600" : "text-white/80"
                } hover:text-brand-500`}
              >
                <Phone size={15} />
                (123) 456-7890
              </a>
              <a
                href="#booking"
                className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-brand-200/50 hover:-translate-y-0.5"
              >
                Book Appointment
              </a>
            </div>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col pt-20 px-6 pb-8">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 text-gray-700 font-medium hover:text-brand-500 border-b border-gray-50 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Phone size={15} /> (123) 456-7890
                </a>
                <a
                  href="#booking"
                  onClick={() => setMobileOpen(false)}
                  className="bg-brand-500 text-white text-center py-3 rounded-full font-medium"
                >
                  Book Appointment
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
