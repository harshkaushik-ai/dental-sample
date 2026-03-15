import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

export const SERVICES = [
  {
    id: "whitening",
    title: "Teeth Whitening",
    description:
      "Transform your smile with our professional-grade whitening treatments. Achieve up to 8 shades brighter in a single session.",
    icon: "Sparkles",
    duration: "60 min",
    badge: "Most Popular",
    color: "from-yellow-50 to-amber-50",
    accent: "#f59e0b",
  },
  {
    id: "implants",
    title: "Dental Implants",
    description:
      "Permanent, natural-looking tooth replacement using titanium implants that fuse seamlessly with your jawbone.",
    icon: "Zap",
    duration: "Multiple visits",
    badge: "Lifetime Solution",
    color: "from-blue-50 to-sky-50",
    accent: "#0d87f0",
  },
  {
    id: "rootcanal",
    title: "Root Canal Treatment",
    description:
      "Pain-free root canal therapy using the latest rotary systems. Save your natural tooth and eliminate infection effectively.",
    icon: "Shield",
    duration: "90 min",
    badge: "Pain-Free",
    color: "from-teal-50 to-cyan-50",
    accent: "#20afaa",
  },
  {
    id: "orthodontics",
    title: "Orthodontics",
    description:
      "Straighten your teeth discreetly with clear aligners or traditional braces. Customized for every age.",
    icon: "GitBranch",
    duration: "12–24 months",
    badge: "Clear Aligners",
    color: "from-purple-50 to-violet-50",
    accent: "#8b5cf6",
  },
  {
    id: "smile",
    title: "Smile Makeover",
    description:
      "A comprehensive transformation combining veneers, whitening, and contouring for the smile you've always dreamed of.",
    icon: "Star",
    duration: "Custom plan",
    badge: "Full Transformation",
    color: "from-rose-50 to-pink-50",
    accent: "#f43f5e",
  },
  {
    id: "cleaning",
    title: "Preventive Care",
    description:
      "Comprehensive check-ups, professional cleaning, and X-rays to keep your oral health at its peak.",
    icon: "Heart",
    duration: "45 min",
    badge: "Essential",
    color: "from-green-50 to-emerald-50",
    accent: "#10b981",
  },
];

export const TEAM = [
  {
    name: "Dr. Sophia Merritt",
    role: "Lead Cosmetic Dentist",
    experience: "15+ years",
    education: "Harvard School of Dental Medicine",
    specialties: ["Smile Design", "Veneers", "Implants"],
    avatar: "SM",
  },
  {
    name: "Dr. James Okafor",
    role: "Orthodontist",
    experience: "12+ years",
    education: "UCLA School of Dentistry",
    specialties: ["Clear Aligners", "Braces", "Jaw Correction"],
    avatar: "JO",
  },
  {
    name: "Dr. Priya Nair",
    role: "Endodontist",
    experience: "10+ years",
    education: "NYU College of Dentistry",
    specialties: ["Root Canals", "Oral Surgery", "Pain Management"],
    avatar: "PN",
  },
];

export const STATS = [
  { value: "12,000+", label: "Smiles Transformed" },
  { value: "98%", label: "Patient Satisfaction" },
  { value: "15+", label: "Years of Excellence" },
  { value: "3", label: "Expert Specialists" },
];
