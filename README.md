# SS Developer — Premium Portfolio

Dark, futuristic, cyber-themed personal portfolio. Built to feel handcrafted (Apple / Vercel / Stripe / Linear energy) with a custom metallic **SS** brand mark, glassmorphism, soft blue glow, particle field, custom cursor, command palette and live GitHub data.

## Tech
Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · GSAP · Three.js (r3f) · Lucide · React Icons · cmdk · EmailJS · Geist font.

## Quick start
```bash
npm install
cp .env.example .env.local   # add EmailJS keys (optional)
npm run dev
```
Open http://localhost:3000

## Make it yours (3 steps)
1. **`lib/data.ts`** → set your `github` username, `email`, socials, projects, skills, timeline.
2. **`public/cv.pdf`** → drop your real CV (replace the README placeholder).
3. **`.env.local`** → add EmailJS `SERVICE_ID`, `TEMPLATE_ID`, `PUBLIC_KEY` so the contact form sends real mail. Without them, the form runs in demo mode (validates + fake success).

## Features included
- Metallic **SS** logo (silver + matte black, glowing diagonal slash, code symbols) — used in navbar, hero, loading screen, footer, favicon.
- Animated loading screen, custom cursor, scroll-progress bar.
- Glass navbar with active-section indicator + magnetic CTA.
- Command palette — **Ctrl/⌘ + K**.
- Hero: big animated logo, typing roles, mouse parallax, magnetic buttons.
- Sections: About (timeline), Skills (animated bars + floating icons), Services, Projects (category filter + hover reveal), **live GitHub stats** (repos/stars/followers + contribution chart + top repos), Contact (validated glass form + EmailJS), Footer (animated logo + back to top).
- Background: particle network, animated grid, spotlight, noise texture, brand glows.
- Fully responsive + accessible + SEO metadata.

## Structure
```
app/            layout, page, globals
components/      logo, navbar, cursor, loading, palette, scroll-progress
  sections/     hero, about, skills, services, projects, github, contact, footer
  background/   particles, grid, spotlight
  ui/           magnetic, glow-card, section-header
lib/            data, utils, hooks (use-mouse, use-active-section)
```

## Roadmap (easy next additions)
Testimonials · Certificates · Experience detail · Music toggle · Theme settings panel · Three.js floating 3D objects · Interactive blob · Page transitions.
The design system (tokens, glass, glow, GlowCard, SectionHeader) makes these drop-in.
