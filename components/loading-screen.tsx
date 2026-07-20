"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./logo";

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      v += Math.random() * 18;
      if (v >= 100) { v = 100; clearInterval(t); setTimeout(() => setDone(true), 450); }
      setPct(Math.floor(v));
    }, 130);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
        >
          <div className="relative flex items-center justify-center" style={{ perspective: 700 }}>
            {/* 3D gyroscope rings */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute rounded-full border-2 border-primary/40"
              style={{ width: 168, height: 168, transformStyle: "preserve-3d" }}
              animate={{ rotateX: 360, rotateY: 360 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute rounded-full border-2 border-primary/20"
              style={{ width: 134, height: 134, transformStyle: "preserve-3d" }}
              animate={{ rotateY: -360, rotateZ: 360 }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Logo size={96} showSymbols />
            </motion.div>
          </div>
          <div className="mt-10 w-56 h-[3px] rounded-full bg-ink/10 overflow-hidden">
            <motion.div className="h-full bg-brand-gradient" style={{ width: `${pct}%` }} />
          </div>
          <span className="mt-3 font-mono text-xs text-muted tracking-widest">{pct}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
