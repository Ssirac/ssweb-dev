"use client";

// Scrambles into its text once, the first time it scrolls into view: each
// character resolves left-to-right out of random glyphs. Writes straight to
// the DOM (textContent) so the animation never re-renders the motion-wrapped
// heading around it. No-op for reduced motion.

import { useEffect, useRef } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = text;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let interval: ReturnType<typeof setInterval> | null = null;
    const run = () => {
      const total = 16;
      let frame = 0;
      interval = setInterval(() => {
        frame++;
        if (frame >= total) {
          el.textContent = text;
          if (interval) clearInterval(interval);
          return;
        }
        const revealed = Math.floor((frame / total) * text.length);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          if (i < revealed || text[i] === " ") s += text[i];
          else s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = s;
      }, 40);
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

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
