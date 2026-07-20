"use client";

// Autonomous AI mascot: an on-brand character that roams freely across the whole
// viewport and, when clicked, stops and says something useful in a speech bubble
// (bilingual). Fully responsive; skipped for reduced-motion / no-WebGL.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

const AiMascotScene = dynamic(
  () => import("./ai-mascot-scene").then((m) => m.AiMascotScene),
  { ssr: false },
);

const MESSAGES: Record<"az" | "en", string[]> = {
  az: [
    "Salam! 👋 Mən bu saytın AI köməkçisiyəm.",
    "SS — React, Next.js və TypeScript ilə frontend developer.",
    "İpucu: ⌘K (Ctrl+K) ilə komanda paletini aç.",
    "Layihələr bölməsinə bax — real işlər var 👀",
    "Yuxarıdan qaranlıq/işıqlı temanı dəyiş 🌙",
    "Navbar-dakı 🎨 ilə saytın aksent rəngini dəyiş.",
    "Terminal bölməsində `help` yaz — gizli əmrlər var 🕹️",
    "/play-də Snake oyunu var, bir dövr vur 🐍",
    "İş təklifin var? Əlaqə bölməsindən yaz!",
    "Bu personaj Rodin AI ilə yaradılıb 🤖",
  ],
  en: [
    "Hi! 👋 I'm this site's AI helper.",
    "SS — a frontend developer with React, Next.js & TypeScript.",
    "Tip: press ⌘K (Ctrl+K) for the command palette.",
    "Check the projects section — real work in there 👀",
    "Toggle dark/light theme up top 🌙",
    "Change the site's accent color from the 🎨 in the navbar.",
    "Type `help` in the terminal — there are hidden commands 🕹️",
    "There's a Snake game at /play, give it a spin 🐍",
    "Got a job offer? Reach out via the contact section!",
    "This character was generated with Rodin AI 🤖",
  ],
};

export function AiMascot() {
  const { lang } = useLang();
  const [enabled, setEnabled] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dir = useRef(1);
  const paused = useRef(false);
  const idx = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Desktop-only, like every other WebGL piece on the site. A roaming 3D
    // canvas rendering every frame competes with scrolling on phones and made
    // the page stutter, so mobile skips it entirely.
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      ok = false;
    }
    setEnabled(!reduce && ok && desktop);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const box = boxRef.current;
    if (!box) return;

    let raf = 0;
    let last = performance.now();
    const w = () => box.offsetWidth || 130;
    const h = () => box.offsetHeight || 170;
    let x = (window.innerWidth - w()) / 2;
    let y = (window.innerHeight - h()) / 2;
    let tx = x;
    let ty = y;
    const speed = 95;

    const pickTarget = () => {
      tx = Math.random() * Math.max(0, window.innerWidth - w());
      ty = Math.random() * Math.max(0, window.innerHeight - h());
    };
    pickTarget();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused.current) {
        const dx = tx - x;
        const dy = ty - y;
        const dist = Math.hypot(dx, dy);
        if (dist < 4) {
          pickTarget();
        } else {
          const step = Math.min(speed * dt, dist);
          x += (dx / dist) * step;
          y += (dy / dist) * step;
          if (Math.abs(dx) > 1) dir.current = dx >= 0 ? 1 : -1;
        }
      }
      box.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [enabled]);

  const speak = () => {
    const list = MESSAGES[lang === "en" ? "en" : "az"];
    setMsg(list[idx.current % list.length]);
    idx.current += 1;
    paused.current = true; // stand still while talking
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setMsg(null);
      paused.current = false;
    }, 4500);
  };

  if (!enabled) return null;
  return (
    <div
      ref={boxRef}
      onClick={speak}
      role="button"
      aria-label="AI mascot — kliklə"
      className="fixed left-0 top-0 z-40 h-[130px] w-[100px] cursor-pointer sm:h-[170px] sm:w-[130px]"
    >
      {msg && (
        <div className="absolute bottom-full left-1/2 mb-1 w-max max-w-[200px] -translate-x-1/2 rounded-2xl glass-strong px-3 py-2 text-center text-xs leading-snug text-ink shadow-premium">
          {msg}
        </div>
      )}
      <AiMascotScene dir={dir} />
    </div>
  );
}
