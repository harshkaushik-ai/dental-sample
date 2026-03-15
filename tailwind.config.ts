import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef9ff",
          100: "#d8f1ff",
          200: "#b9e8ff",
          300: "#89daff",
          400: "#52c3ff",
          500: "#29a6fb",
          600: "#0d87f0",
          700: "#0e70d8",
          800: "#115aaf",
          900: "#144d8a",
          950: "#112f56",
        },
        teal: {
          50:  "#edfcfa",
          100: "#d2f7f4",
          200: "#aaeee9",
          300: "#72e0da",
          400: "#3acac4",
          500: "#20afaa",
          600: "#178c89",
          700: "#17706f",
          800: "#195a59",
          900: "#194c4b",
          950: "#092d2d",
        },
        cream: "#fafaf8",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
