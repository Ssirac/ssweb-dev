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
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Logo size={110} showSymbols />
          </motion.div>
          <div className="mt-10 w-56 h-[3px] rounded-full bg-ink/10 overflow-hidden">
            <motion.div className="h-full bg-brand-gradient" style={{ width: `${pct}%` }} />
          </div>
          <span className="mt-3 font-mono text-xs text-muted tracking-widest">{pct}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
