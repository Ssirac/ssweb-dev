"use client";

// Press "?" anywhere (outside inputs) → a small glass panel listing the site's
// keyboard shortcuts and easter eggs. Esc or backdrop click closes it.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function ShortcutsOverlay() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "?") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  const az = lang === "az";
  const rows: Array<[string, string]> = [
    ["Ctrl / ⌘ + K", az ? "Komanda paleti" : "Command palette"],
    ["?", az ? "Bu panel" : "This panel"],
    ["Esc", az ? "Bağla" : "Close"],
    ["↑↑↓↓←→←→ B A", az ? "Konami sürprizi" : "Konami surprise"],
    ["/play", az ? "Snake oyunu 🐍" : "Snake game 🐍"],
    ["Terminal → help", az ? "Gizli əmrlər" : "Hidden commands"],
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9500] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl glass-strong p-6 shadow-premium"
          >
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Keyboard size={18} className="text-primary" /> {az ? "Qısayollar" : "Shortcuts"}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {rows.map(([k, d]) => (
                <li key={k} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">{d}</span>
                  <kbd className="whitespace-nowrap rounded-md border border-ink/15 bg-ink/5 px-2 py-0.5 font-mono text-[11px] text-ink">
                    {k}
                  </kbd>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
