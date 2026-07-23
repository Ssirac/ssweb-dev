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
    tiktok: "https://www.tiktok.com/@ssweb.dev",
    discord: "https://discord.com/users/ssdeveloper",
  },
};

// REAL müştəri rəyləri. Boş qaldıqca bölmə saytda GÖRÜNMÜR.
// Uydurma rəy YAZMA — yalnız müştərinin öz sözləri, öz icazəsi ilə.
export type Testimonial = {
  quote: { az: string; en: string };
  name: string; // real ad
  role: { az: string; en: string }; // vəzifə + şirkət
};
export const TESTIMONIALS: Testimonial[] = [
  // ⏳ TƏSDİQ GÖZLƏYİR — müştəri "təsdiq edirəm" deyən kimi şərhdən çıxar,
  // ad/vəzifəni real məlumatla doldur. Bölmə avtomatik görünəcək.
  //
  // {
  //   quote: {
  //     az: "Kataloq saytımızı qısa müddətdə çox səliqəli hazırladı. Sifarişlər indi birbaşa WhatsApp-ımıza gəlir, həm bizim, həm müştərilərimiz üçün çox rahatdır.",
  //     en: "He built our catalog site quickly and cleanly. Orders now come straight to our WhatsApp, which is convenient for us and our customers.",
  //   },
  //   name: "Süleyman Ağazadə",
  //   role: { az: "Original Brands Baku, təsisçi", en: "Original Brands Baku, founder" },
  // },
  // {
  //   quote: {
  //     az: "Əvvəllər CV-lərin emalı və müraciətlərin göndərilməsi günlərlə vaxt alırdı. İndi sistem bunu avtomatik edir, biz yalnız təsdiqləyirik. Ciddi texniki iş görülüb.",
  //     en: "Processing CVs and sending applications used to take days. Now the system does it automatically and we only approve. Serious technical work.",
  //   },
  //   name: "MZ Personalvermittlung",
  //   role: { az: "Rekrutinq agentliyi, Almaniya", en: "Recruitment agency, Germany" },
  // },
];

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
export const TIMELINE = ["2025", "2024", "UNEC"] as const;

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
    slug: "mz-talent-intelligence",
    title: "MZ Talent Intelligence",
    category: "Web App",
    year: "2026",
    image: "/projects/mzcvai.png",
    fit: "contain", // wide dashboard screenshot — show it whole, don't crop
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Claude AI", "Firecrawl", "Puppeteer", "Resend/IMAP", "next-intl", "Tailwind", "Railway"],
    demo: "",
    repo: "",
    role: { az: "Full-stack Developer", en: "Full-stack Developer" },
    market: { az: "Almaniya bazarı üçün", en: "Built for the German market" },
    desc: {
      az: "Azərbaycanlı hospitality/ticarət namizədlərini Alman işəgötürənlərlə birləşdirən, viza-sponsorluğuna meyilli şirkətləri önə çıxaran AI-əsaslı işə-qəbul avtomatlaşdırma platforması.",
      en: "AI-powered recruitment automation platform connecting Azerbaijani hospitality/trade candidates with German employers, surfacing visa-sponsorship-friendly companies.",
    },
    about: {
      az: "Sistem açıq iş mənbələrindən canlı vakansiyaları toplayır, işəgötürənləri sponsorluq ehtimalına görə qiymətləndirir, namizəd CV-lərini Claude ilə avtomatik parse edib uyğun işlərlə tutuşdurur və insan-təsdiqli avtomatik müraciətlər (email + forma) göndərir. Hamısı GDPR/UWG uyğunluğu ilə, üç dildə (AZ/DE/EN).",
      en: "The system collects live vacancies from open job sources, scores employers by sponsorship likelihood, auto-parses candidate CVs with Claude, matches them to suitable jobs and sends human-approved automated applications (email + forms). All GDPR/UWG compliant, in three languages (AZ/DE/EN).",
    },
    // REAL nəticə faktları gələndə bu sahəni aç — detal səhifəsində
    // "Nəticələr" bloku avtomatik görünəcək:
    // results: {
    //   az: ["CV emalı əl işindən tam avtomatikaya keçdi", "..."],
    //   en: ["CV processing went from manual to fully automated", "..."],
    // },
    features: {
      az: [
        "Çoxmənbəli vakansiya toplama (API-lər + Firecrawl web-scraping)",
        "Semantik uyğunlaşma (embedding) + sponsorluq-yönümlü skorlama",
        "Claude ilə CV parse + alman dilində fərdi müraciət məktubları",
        "Avtomatik forma doldurma (headless brauzer) + email göndərmə",
        "IMAP ilə işəgötürən cavablarının izlənməsi",
        "Admin autentifikasiya, CSP, CSRF, audit log",
      ],
      en: [
        "Multi-source vacancy collection (APIs + Firecrawl web scraping)",
        "Semantic matching (embeddings) + sponsorship-oriented scoring",
        "CV parsing with Claude + personalized German cover letters",
        "Automated form filling (headless browser) + email sending",
        "Employer reply tracking via IMAP",
        "Admin authentication, CSP, CSRF, audit log",
      ],
    },
  },
  {
    slug: "mz-personalvermittlung",
    title: "MZ Personalvermittlung",
    category: "Web App",
    year: "2025",
    image: "/projects/mz.png",
    tech: ["Next.js", "React", "Tailwind", "Framer Motion"],
    demo: "https://mz-personalvermittlung.de/",
    repo: "",
    role: { az: "Frontend Developer", en: "Frontend Developer" },
    market: { az: "Almaniya bazarı üçün", en: "Built for the German market" },
    desc: {
      az: "Almaniyaya beynəlxalq ixtisaslı işçi və təcrübəçi qəbulu üçün çoxdilli landing sayt: xidmət kartları, addım-addım proses və əlaqə forması.",
      en: "Multilingual landing site for placing international skilled workers and apprentices in Germany: service cards, a step-by-step process and a contact form.",
    },
    about: {
      az: "Almaniyadakı şirkətləri xaricdən ixtisaslı işçilərlə əlaqələndirən agentlik üçün qurulmuş marketinq saytı. Məqsəd güvən yaratmaq və müraciəti asanlaşdırmaq idi.",
      en: "A marketing site for an agency connecting German companies with skilled workers from abroad. The goal was to build trust and make it easy to get in touch.",
    },
    features: {
      az: ["Alman/İngilis dil dəstəyi", "İşıq/qaranlıq tema", "Xidmət kartları və addım-addım proses", "Responsiv dizayn və əlaqə forması"],
      en: ["German/English language support", "Light/dark theme", "Service cards and step-by-step process", "Responsive design and contact form"],
    },
  },
  {
    slug: "original-brands-baku",
    title: "Original Brands Baku",
    category: "E-commerce",
    year: "2025",
    image: "/projects/ob.png",
    tech: ["Next.js", "React", "Tailwind"],
    demo: "https://orginalbrands.vercel.app/",
    repo: "",
    role: { az: "Frontend Developer", en: "Frontend Developer" },
    desc: {
      az: "Orijinal brend geyim, ayaqqabı və aksesuar kataloqu: kateqoriyalar, seçilmiş məhsullar və birbaşa WhatsApp sifarişi.",
      en: "Catalog storefront for original branded clothing, shoes and accessories: categories, featured products and direct WhatsApp ordering.",
    },
    about: {
      az: "Bakıda orijinal brend məhsullar satan mağaza üçün məhsul kataloqu. Ödəniş sistemi əvəzinə birbaşa WhatsApp sifarişi ilə sadə axın seçildi.",
      en: "A product catalog for a Baku store selling original branded goods. Instead of a payment gateway, a simple flow via direct WhatsApp ordering was chosen.",
    },
    features: {
      az: ["Kateqoriyalar üzrə məhsul kataloqu", "Brend filtri və seçilmiş məhsullar", "Birbaşa WhatsApp sifarişi", "Sürətli, mobil-uyğun görünüş"],
      en: ["Category-based product catalog", "Brand filter and featured products", "Direct WhatsApp ordering", "Fast, mobile-friendly layout"],
    },
  },
] as const;

export const PROJECT_CATEGORIES = ["All", "Web App", "E-commerce"] as const;
