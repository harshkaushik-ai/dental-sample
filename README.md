# 🦷 Lumina Dental — Premium Dental Clinic Website

A modern, production-ready dental clinic website built with Next.js 14, Tailwind CSS, Framer Motion, and TypeScript.

## ✨ Features

- **Scroll-Frame Animation** — Canvas-driven hero with sequential frame playback as user scrolls
- **Animated Sections** — Framer Motion scroll-triggered reveals across all sections
- **Appointment Booking** — Full form with double-booking prevention via API
- **Before/After Slider** — Interactive drag comparison with multiple cases
- **Responsive Design** — Mobile-first, looks great on all screen sizes
- **Google Maps Embed** — Interactive map in the contact section
- **Testimonials Carousel** — Auto-play with manual navigation
- **Performance Optimized** — Lazy loading, requestAnimationFrame, image optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or unzip the project
cd dental-clinic

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
dental-clinic/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── appointments/
│   │   │       └── route.ts          # Booking API (POST + GET)
│   │   ├── globals.css               # Global styles + CSS variables
│   │   ├── layout.tsx                # Root layout with fonts
│   │   └── page.tsx                  # Main page — assembles all sections
│   ├── components/
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx       # Scroll-frame canvas animation
│   │   │   ├── AboutSection.tsx      # Clinic story, values, stats
│   │   │   ├── ServicesSection.tsx   # 6 dental services with hover cards
│   │   │   ├── BeforeAfterSection.tsx # Interactive comparison slider
│   │   │   ├── TeamSection.tsx       # Dentist team profiles
│   │   │   ├── TestimonialsSection.tsx # Patient testimonials carousel
│   │   │   ├── BookingSection.tsx    # Appointment booking form
│   │   │   └── ContactSection.tsx    # Map + contact info + hours
│   │   └── ui/
│   │       ├── Navbar.tsx            # Sticky nav with mobile drawer
│   │       └── Footer.tsx            # Footer with CTA band
│   ├── hooks/
│   │   └── useScrollFrame.ts         # Custom hook for frame animation
│   └── lib/
│       └── utils.ts                  # Shared constants & utilities
├── public/
│   └── frames/                       # 📂 PUT YOUR FRAMES HERE
│       ├── frame001.png
│       ├── frame002.png
│       └── ... frame120.png
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

## 🎬 Scroll Frame Animation

### Adding Your Frames

1. Extract frames from your video (e.g., using FFmpeg):

```bash
ffmpeg -i your-video.mp4 -vf fps=24 -q:v 2 public/frames/frame%03d.png
```

2. Place frames in `public/frames/` as `frame001.png`, `frame002.png`, ..., `frame120.png`

3. In `src/components/sections/HeroSection.tsx`, adjust:
   - `TOTAL_FRAMES` — total number of frames
   - `FRAMES_BASE` — base path (default: `/frames`)

**Without frames:** A beautiful animated gradient hero with floating elements displays as a fallback.

### How it Works

- `useScrollFrame` hook preloads all images
- First 10 frames load eagerly; the rest load lazily after 500ms
- On scroll, `scrollYProgress` (Framer Motion) maps to a frame index
- `requestAnimationFrame` renders the correct frame to a `<canvas>` element
- Canvas uses `cover` fitting so it looks great at any aspect ratio

## 📅 Appointment Booking API

### Endpoints

**POST** `/api/appointments` — Book an appointment

Request body:
```json
{
  "patientName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1 555 000 0000",
  "date": "2025-06-15",
  "timeSlot": "10:00 AM",
  "reason": "Teeth Whitening"
}
```

Response (success):
```json
{
  "success": true,
  "message": "Appointment booked successfully!",
  "appointment": { "id": "APT-1234567", "date": "2025-06-15", "timeSlot": "10:00 AM" }
}
```

Response (conflict - double booking):
```json
{
  "success": false,
  "message": "The slot at 10:00 AM on 2025-06-15 is already booked."
}
```

**GET** `/api/appointments?date=2025-06-15` — Get booked slots for a date

```json
{ "bookedSlots": ["10:00 AM", "02:30 PM"] }
```

### Production Database

Replace the in-memory `appointments` array in `route.ts` with your database of choice:

```ts
// Example with Prisma
import { prisma } from "@/lib/prisma"

// Check conflict:
const conflict = await prisma.appointment.findFirst({
  where: { date, timeSlot }
})

// Save:
await prisma.appointment.create({ data: newAppointment })
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the brand palette:
```ts
brand: { 500: "#0d87f0", ... },  // Primary blue
teal:  { 500: "#20afaa", ... },  // Secondary teal
```

### Clinic Info
Edit `src/lib/utils.ts` to update:
- `SERVICES` — service cards with icons, descriptions, durations
- `TEAM` — team member profiles
- `STATS` — clinic statistics
- `TIME_SLOTS` — available appointment times

### Typography
Fonts are loaded from Google Fonts in `globals.css`:
- **Display**: Cormorant Garamond (headings)
- **Body**: DM Sans (body text)

Replace these with any Google Fonts pair you prefer.

## 📧 Email Notifications (Optional)

Add email confirmations using Resend, SendGrid, or Nodemailer in `route.ts`:

```ts
import { Resend } from "resend"
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: "Lumina Dental <noreply@luminadental.com>",
  to: email,
  subject: `Appointment Confirmed — ${date} at ${timeSlot}`,
  html: `<p>Hi ${patientName}, your appointment is confirmed!</p>`
})
```

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD ["npm", "start"]
```

## 📸 Credits

- Icons: [Lucide React](https://lucide.dev)
- Animations: [Framer Motion](https://framer.motion)
- Fonts: [Google Fonts](https://fonts.google.com)
- Framework: [Next.js](https://nextjs.org)
