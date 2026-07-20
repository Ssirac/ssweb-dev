"use client";

// Scrambles into its text once, the first time it scrolls into view: each
// character resolves left-to-right out of random glyphs. No-op for reduced
// motion (renders the plain text).

import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let interval: ReturnType<typeof setInterval> | null = null;
    const run = () => {
      const total = 20;
      let frame = 0;
      interval = setInterval(() => {
        frame++;
        const revealed = Math.floor((frame / total) * text.length);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          if (i < revealed || text[i] === " ") s += text[i];
          else s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setOut(s);
        if (frame >= total) {
          if (interval) clearInterval(interval);
          setOut(text);
        }
      }, 32);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [text]);

  return <span ref={ref} className={className}>{out}</span>;
}
