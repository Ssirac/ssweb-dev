"use client";

// "Let the code talk" — a mini editor that types a syntax-highlighted snippet
// once, the first time it scrolls into view (then stops — no ongoing cost).
// Reduced-motion users see the finished snippet immediately.

import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "../ui/section-header";
import { useLang } from "@/lib/i18n";

type Tok = { t: string; c: string };

const K = "text-[#c792ea]"; // keywords
const F = "text-[#82aaff]"; // identifiers / functions
const S = "text-[#c3e88d]"; // strings
const P = "text-[#ffcb6b]"; // properties
const C = "text-[#546e7a]"; // comments
const T = "text-ink/70";    // punctuation

const TOKENS: Tok[] = [
  { t: "// idea → product\n", c: C },
  { t: "const ", c: K }, { t: "developer", c: F }, { t: " = {\n", c: T },
  { t: "  ad", c: P }, { t: ": ", c: T }, { t: '"SS Developer"', c: S }, { t: ",\n", c: T },
  { t: "  stack", c: P }, { t: ": [", c: T }, { t: '"React"', c: S }, { t: ", ", c: T },
  { t: '"Next.js"', c: S }, { t: ", ", c: T }, { t: '"TypeScript"', c: S }, { t: "],\n", c: T },
  { t: "};\n\n", c: T },
  { t: "async function ", c: K }, { t: "build", c: F }, { t: "(idea) {\n", c: T },
  { t: "  const ", c: K }, { t: "design", c: F }, { t: " = ", c: T },
  { t: "await ", c: K }, { t: "sketch", c: F }, { t: "(idea);\n", c: T },
  { t: "  const ", c: K }, { t: "app", c: F }, { t: " = ", c: T },
  { t: "implement", c: F }, { t: "(design, { ", c: T }, { t: "responsive", c: P },
  { t: ": ", c: T }, { t: "true", c: K }, { t: " });\n", c: T },
  { t: "  return ", c: K }, { t: "ship", c: F }, { t: "(app); ", c: T }, { t: "// 🚀\n", c: C },
  { t: "}", c: T },
];

const TOTAL = TOKENS.reduce((s, x) => s + x.t.length, 0);

export function CodeShowcase() {
  const { lang } = useLang();
  const az = lang === "az";
  const [n, setN] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(TOTAL);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          timer.current = setInterval(() => {
            setN((v) => {
              if (v >= TOTAL) {
                if (timer.current) clearInterval(timer.current);
                return v;
              }
              return v + 2;
            });
          }, 24);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  // Reveal tokens up to n characters.
  let rem = n;
  const parts: React.ReactNode[] = [];
  for (let i = 0; i < TOKENS.length && rem > 0; i++) {
    const take = Math.min(rem, TOKENS[i].t.length);
    parts.push(
      <span key={i} className={TOKENS[i].c}>
        {TOKENS[i].t.slice(0, take)}
      </span>,
    );
    rem -= take;
  }

  return (
    <section className="relative mx-auto max-w-3xl px-6 py-24">
      <SectionHeader
        tag={az ? "NECƏ İŞLƏYİRƏM" : "HOW I WORK"}
        title={az ? "Kod danışsın" : "Let the code talk"}
      />
      <div ref={boxRef} className="overflow-hidden rounded-2xl glass glass-accent shadow-premium">
        <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
          <span className="h-3 w-3 rounded-full bg-green-400/70" />
          <span className="ml-2 font-mono text-xs text-muted">build.ts</span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
          <code>
            {parts}
            {n < TOTAL && <span className="animate-pulse text-primary">▌</span>}
          </code>
        </pre>
      </div>
    </section>
  );
}
