"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];
const GLYPHS = ["</>", "{ }", "01", "()", "=>", "#", "$", "[]", "::", "npm"];

export function Konami() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = key === SEQUENCE[idx] ? idx + 1 : (key === SEQUENCE[0] ? 1 : 0);
      if (idx === SEQUENCE.length) {
        idx = 0;
        setActive(true);
        setTimeout(() => setActive(false), 4500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const drops = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    dur: 2.5 + Math.random() * 2,
    glyph: GLYPHS[i % GLYPHS.length],
    size: 14 + Math.random() * 22,
  }));

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[9500] overflow-hidden"
        >
          {drops.map((d) => (
            <motion.span
              key={d.id}
              initial={{ y: "-10vh", opacity: 0 }}
              animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
              transition={{ duration: d.dur, delay: d.delay, ease: "linear" }}
              style={{ left: `${d.left}%`, fontSize: d.size }}
              className="absolute font-mono font-bold text-primary"
            >
              {d.glyph}
            </motion.span>
          ))}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl glass-strong px-8 py-6 text-center shadow-glow-lg"
          >
            <div className="font-display text-3xl font-bold text-ink">🎉 Dev mode unlocked</div>
            <div className="mt-2 font-mono text-sm text-primary">You found the secret. Nice one.</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
