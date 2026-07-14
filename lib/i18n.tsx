"use client";
import {
  createContext, useContext, useEffect, useMemo, useState, ReactNode,
} from "react";

export type Lang = "en" | "az";

// ---------------------------------------------------------------------------
// Dictionary. Structural data (icons, images, levels, links) stays in
// lib/data.ts and is joined to these translations by a stable key.
// ---------------------------------------------------------------------------
const DICT = {
  en: {
    nav: {
      hero: "Home", about: "About", skills: "Skills", services: "Services",
      projects: "Projects", github: "GitHub", contact: "Contact",
    },
    cta: {
      letsTalk: "Let's Talk",
      viewProjects: "View Projects",
      downloadCV: "Download CV",
      contactMe: "Contact Me",
      backToTop: "Back to top",
      liveDemo: "Live Demo",
      code: "Code",
    },
    hero: {
      eyebrow: "Frontend Developer · Azerbaijan",
      headlines: [
        { lead: "I turn ideas into ", mark: "memorable", tail: " websites." },
        { lead: "Every pixel here has a ", mark: "purpose", tail: "." },
        { lead: "I write code, I craft ", mark: "solutions", tail: "." },
        { lead: "Turning simple ideas into ", mark: "living", tail: " products." },
        { lead: "Fast, ", mark: "clean", tail: " and modern interfaces." },
        { lead: "I turn design into ", mark: "code", tail: ", code into results." },
        { lead: "I bring your brand ", mark: "to life", tail: " online." },
      ],
      roles: ["Frontend Developer", "React Developer", "Next.js Developer", "UI Enthusiast"],
      desc: "I'm a junior frontend developer building real, clean web interfaces with React, Next.js and TypeScript.",
    },
    about: {
      tag: "ABOUT",
      title: "Turning ideas into interfaces",
      subtitle: "A junior frontend developer who cares about clean code and thoughtful design.",
      timelineTitle: "EXPERIENCE TIMELINE",
      highlights: {
        years: { title: "1+ Year", desc: "Building real web apps." },
        projects: { title: "10+ Projects", desc: "Personal & practice builds." },
        design: { title: "Design-minded", desc: "Care about craft & detail." },
      },
      timeline: {
        "2025": { title: "Graduated DIV Academy", place: "Junior Frontend Developer", desc: "Finished the program — now building real projects with React, Next.js and TypeScript." },
        "2024": { title: "Started DIV Academy", place: "Frontend track", desc: "Learned HTML, CSS, JavaScript, React and a modern frontend workflow." },
      },
    },
    skills: {
      tag: "SKILLS",
      title: "Tools I build with",
      subtitle: "A modern stack tuned for performance, DX and scale.",
    },
    services: {
      tag: "SERVICES",
      title: "What I can do for you",
      subtitle: "End-to-end product development — from first pixel to production.",
      items: {
        web: { title: "Web Development", desc: "End-to-end web apps built for scale, speed and reliability." },
        frontend: { title: "Frontend", desc: "Pixel-perfect, accessible interfaces with buttery interactions." },
        backend: { title: "Backend", desc: "Robust APIs, auth, databases and real-time systems." },
        api: { title: "API Development", desc: "REST & GraphQL APIs designed for great DX and performance." },
        design: { title: "UI/UX Design", desc: "Design systems and flows that feel premium and effortless." },
        perf: { title: "Performance", desc: "Core Web Vitals, bundle budgets and 100-score optimization." },
      },
    },
    projects: {
      tag: "PROJECTS",
      title: "Selected work",
      subtitle: "A few builds I'm proud of. Hover to explore.",
      categories: {
        All: "All", "Web App": "Web App", "E-commerce": "E-commerce",
        Realtime: "Realtime", Design: "Design",
      },
    },
    github: {
      tag: "GITHUB",
      title: "Open source & activity",
      subtitlePrefix: "Live data from",
      error: "Couldn't load live GitHub data (rate limit or username).",
      noDescription: "No description.",
      stats: { repos: "Repositories", stars: "Total Stars", followers: "Followers", following: "Following" },
    },
    contact: {
      tag: "CONTACT",
      title: "Let's build something",
      subtitle: "Have a project in mind? Drop a message — I usually reply within a day.",
      getInTouch: "Get in touch",
      availability: "Available for freelance & full-time.",
      name: "Your name",
      email: "Your email",
      message: "Tell me about your project…",
      messageLabel: "Your message",
      send: "Send Message",
      sending: "Sending…",
      sent: "Sent!",
      tryAgain: "Try again",
      errName: "Name is required",
      errEmail: "Valid email required",
      errMessage: "Message too short (min 10 chars)",
    },
    footer: {
      crafted: "Crafted with precision.",
      play: "Play Snake",
    },
    cmd: {
      placeholder: "Type a command or search…",
      noResults: "No results.",
      navigate: "Navigate",
      actions: "Actions",
      downloadCV: "Download CV",
      openGithub: "Open GitHub",
    },
  },

  az: {
    nav: {
      hero: "Ana səhifə", about: "Haqqımda", skills: "Bacarıqlar", services: "Xidmətlər",
      projects: "Layihələr", github: "GitHub", contact: "Əlaqə",
    },
    cta: {
      letsTalk: "Danışaq",
      viewProjects: "Layihələrə bax",
      downloadCV: "CV yüklə",
      contactMe: "Əlaqə saxla",
      backToTop: "Yuxarı qayıt",
      liveDemo: "Canlı baxış",
      code: "Kod",
    },
    hero: {
      eyebrow: "Frontend Developer · Azərbaycan",
      headlines: [
        { lead: "Fikirləri ", mark: "yaddaqalan", tail: " saytlara çevirirəm." },
        { lead: "Hər piksel burada bir ", mark: "məqsədə", tail: " xidmət edir." },
        { lead: "Kod yazıram, ", mark: "həll", tail: " yaradıram." },
        { lead: "Adi ideyaları ", mark: "canlı", tail: " məhsullara çevirirəm." },
        { lead: "Sürətli, ", mark: "təmiz", tail: " və müasir interfeyslər." },
        { lead: "Dizaynı ", mark: "koda", tail: ", kodu nəticəyə çevirirəm." },
        { lead: "Brendini onlayn ", mark: "canlandırıram", tail: "." },
      ],
      roles: ["Frontend Developer", "React Developer", "Next.js Developer", "UI Həvəskarı"],
      desc: "Junior frontend developerəm — React, Next.js və TypeScript ilə real, təmiz veb interfeyslər qururam.",
    },
    about: {
      tag: "HAQQIMDA",
      title: "İdeyaları interfeyslərə çevirirəm",
      subtitle: "Təmiz koda və düşünülmüş dizayna önəm verən junior frontend developer.",
      timelineTitle: "TƏCRÜBƏ XRONOLOGİYASI",
      highlights: {
        years: { title: "1+ il", desc: "real veb tətbiqləri qururam." },
        projects: { title: "10+ layihə", desc: "Şəxsi və təcrübə layihələri." },
        design: { title: "Dizayn həssaslığı", desc: "Detala və keyfiyyətə önəm verirəm." },
      },
      timeline: {
        "2025": { title: "DIV Academy-ni bitirdim", place: "Junior Frontend Developer", desc: "Proqramı bitirdim — indi React, Next.js və TypeScript ilə real layihələr qururam." },
        "2024": { title: "DIV Academy-yə başladım", place: "Frontend istiqaməti", desc: "HTML, CSS, JavaScript, React və müasir frontend iş axınını öyrəndim." },
      },
    },
    skills: {
      tag: "BACARIQLAR",
      title: "İşlədiyim alətlər",
      subtitle: "Performans, DX və miqyas üçün tənzimlənmiş müasir stek.",
    },
    services: {
      tag: "XİDMƏTLƏR",
      title: "Sizin üçün nə edə bilərəm",
      subtitle: "Baş-ayaq məhsul inkişafı — ilk pikseldən istehsala qədər.",
      items: {
        web: { title: "Veb İnkişaf", desc: "Miqyas, sürət və etibarlılıq üçün qurulmuş veb tətbiqlər." },
        frontend: { title: "Frontend", desc: "Piksel dəqiqliyində, əlçatan və rəvan interfeyslər." },
        backend: { title: "Backend", desc: "Güclü API-lər, autentifikasiya, verilənlər bazaları və real-time sistemlər." },
        api: { title: "API İnkişafı", desc: "Yaxşı DX və performans üçün REST & GraphQL API-ləri." },
        design: { title: "UI/UX Dizayn", desc: "Premium və rahat hiss olunan dizayn sistemləri və axınlar." },
        perf: { title: "Performans", desc: "Core Web Vitals, bundle büdcələri və 100 bal optimallaşdırma." },
      },
    },
    projects: {
      tag: "LAYİHƏLƏR",
      title: "Seçilmiş işlər",
      subtitle: "Qürur duyduğum bir neçə layihə. Baxmaq üçün üzərinə gəlin.",
      categories: {
        All: "Hamısı", "Web App": "Veb Tətbiq", "E-commerce": "E-ticarət",
        Realtime: "Real-time", Design: "Dizayn",
      },
    },
    github: {
      tag: "GITHUB",
      title: "Açıq mənbə və fəaliyyət",
      subtitlePrefix: "Canlı məlumat:",
      error: "Canlı GitHub məlumatı yüklənmədi (limit və ya istifadəçi adı).",
      noDescription: "Təsvir yoxdur.",
      stats: { repos: "Repozitoriyalar", stars: "Ümumi ulduzlar", followers: "İzləyicilər", following: "İzlənilənlər" },
    },
    contact: {
      tag: "ƏLAQƏ",
      title: "Gəlin birlikdə quraq",
      subtitle: "Layihə fikriniz var? Mesaj yazın — adətən bir gün ərzində cavab verirəm.",
      getInTouch: "Əlaqə saxlayın",
      availability: "Frilans və tam ştat üçün əlçatanam.",
      name: "Adınız",
      email: "E-poçtunuz",
      message: "Layihəniz haqqında danışın…",
      messageLabel: "Mesajınız",
      send: "Mesaj göndər",
      sending: "Göndərilir…",
      sent: "Göndərildi!",
      tryAgain: "Yenidən cəhd et",
      errName: "Ad tələb olunur",
      errEmail: "Düzgün e-poçt tələb olunur",
      errMessage: "Mesaj çox qısadır (ən azı 10 simvol)",
    },
    footer: {
      crafted: "Diqqətlə hazırlanıb.",
      play: "Snake oyna",
    },
    cmd: {
      placeholder: "Əmr yazın və ya axtarın…",
      noResults: "Nəticə yoxdur.",
      navigate: "Naviqasiya",
      actions: "Əməliyyatlar",
      downloadCV: "CV yüklə",
      openGithub: "GitHub-ı aç",
    },
  },
} as const;

export type Dict = (typeof DICT)[Lang];

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("az");

  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "en" || saved === "az") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof localStorage !== "undefined") localStorage.setItem("lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<Ctx>(() => ({ lang, setLang, t: DICT[lang] }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
