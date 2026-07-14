import {
  Code2, Layout, Server, Plug, Palette, Gauge,
} from "lucide-react";

export const PROFILE = {
  name: "SS Developer",
  role: "Junior Frontend Developer",
  github: "ssweb-dev",             // <-- your real GitHub username
  email: "infosswebdev@gmail.com",
  // WhatsApp — international format (Azerbaijan +994), no leading 0.
  whatsapp: [
    { display: "+994 99 745 70 80", number: "994997457080" },
    { display: "+994 77 745 70 80", number: "994777457080" },
  ],
  socials: {
    github: "https://github.com/ssweb-dev",
    linkedin: "https://www.linkedin.com/in/sirac-cavadov-530b89334",
    instagram: "https://www.instagram.com/ssweb.dev/",
    discord: "https://discord.com/users/ssdeveloper",
  },
};

// Multi-page navigation. Labels are resolved per-language from
// lib/i18n.tsx via `id`; `href` is the route each item points to.
export const NAV_LINKS = [
  { id: "hero", href: "/" },
  { id: "about", href: "/about" },
  { id: "services", href: "/services" },
  { id: "projects", href: "/projects" },
  { id: "contact", href: "/contact" },
] as const;

// Öz həqiqi səviyyənə görə faizləri dəyişdir (0–100).
export const SKILLS = [
  { name: "HTML/CSS", level: 80 },
  { name: "JavaScript", level: 72 },
  { name: "React", level: 68 },
  { name: "Next.js", level: 60 },
  { name: "TypeScript", level: 55 },
  { name: "Tailwind", level: 75 },
  { name: "Git", level: 65 },
  { name: "Figma", level: 50 },
];

// `key` maps each item to its translations in lib/i18n.tsx.
export const SERVICES = [
  { key: "web", icon: Code2 },
  { key: "frontend", icon: Layout },
  { key: "backend", icon: Server },
  { key: "api", icon: Plug },
  { key: "design", icon: Palette },
  { key: "perf", icon: Gauge },
] as const;

// `year` also acts as the translation key (see about.timeline in i18n.tsx).
export const TIMELINE = ["2025", "2024"] as const;

export const HIGHLIGHT_KEYS = ["years", "projects", "design"] as const;

// ─────────────────────────────────────────────────────────────────────────
// YENİ LAYİHƏ ƏLAVƏ ETMƏK ÜÇÜN: aşağıdakı siyahıya bu şablonu kopyala.
// Bütün mətn (təsvir də daxil) buradadır — başqa fayla toxunmaq LAZIM DEYİL.
//
//   {
//     title: "Layihənin adı",
//     category: "Web App",          // yalnız PROJECT_CATEGORIES-dəki biri
//     image: "https://.../sekil.jpg",// və ya "/mening-seklim.jpg" (public/ qovluğu)
//     tech: ["Next.js", "TypeScript"],
//     demo: "https://canli-link.com",
//     repo: "https://github.com/ssweb-dev/repo",
//     desc: {
//       az: "Azərbaycanca qısa təsvir.",
//       en: "Short English description.",
//     },
//   },
// ─────────────────────────────────────────────────────────────────────────
export const PROJECTS = [
  {
    title: "MZ Personalvermittlung",
    category: "Web App",
    image: "/projects/mz.png",
    tech: ["Next.js", "React", "Tailwind"],
    demo: "https://mz-personalvermittlung.de/",
    repo: "",
    desc: {
      az: "Almaniyaya beynəlxalq ixtisaslı işçi və təcrübəçi qəbulu üçün çoxdilli landing sayt — xidmət kartları, addım-addım proses və əlaqə forması.",
      en: "Multilingual landing site for placing international skilled workers and apprentices in Germany — service cards, a step-by-step process and a contact form.",
    },
  },
  {
    title: "Original Brands Baku",
    category: "E-commerce",
    image: "/projects/ob.png",
    tech: ["Next.js", "React", "Tailwind"],
    demo: "https://orginalbrands.vercel.app/",
    repo: "",
    desc: {
      az: "Orijinal brend geyim, ayaqqabı və aksesuar kataloqu — kateqoriyalar, seçilmiş məhsullar və birbaşa WhatsApp sifarişi.",
      en: "Catalog storefront for original branded clothing, shoes and accessories — categories, featured products and direct WhatsApp ordering.",
    },
  },
] as const;

export const PROJECT_CATEGORIES = ["All", "Web App", "E-commerce"] as const;
