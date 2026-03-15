import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumina Dental — Premium Dental Care",
  description:
    "Experience world-class dental care at Lumina Dental Clinic. Expert cosmetic dentistry, implants, orthodontics, and comprehensive oral health services.",
  keywords: "dental clinic, teeth whitening, dental implants, orthodontics, cosmetic dentistry",
  openGraph: {
    title: "Lumina Dental — Premium Dental Care",
    description: "Where every smile tells a story of excellence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
