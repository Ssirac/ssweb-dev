"use client";

// Runtime accent switcher: overrides the --c-primary / --c-secondary channels
// on :root and persists the choice. Restored before paint by a small script in
// the root layout (so there's no flash of the default accent).

import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";

export const ACCENTS = [
  { name: "Indigo", p: "69 80 245", s: "110 118 255" },
  { name: "Violet", p: "139 92 246", s: "167 139 250" },
  { name: "Cyan", p: "34 211 238", s: "103 232 249" },
  { name: "Emerald", p: "16 185 129", s: "52 211 153" },
  { name: "Rose", p: "244 63 94", s: "251 113 133" },
] as const;

function apply(p: string, s: string) {
  const root = document.documentElement;
  root.style.setProperty("--c-primary", p);
  root.style.setProperty("--c-secondary", s);
}

export function AccentPicker() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const choose = (a: (typeof ACCENTS)[number]) => {
    apply(a.p, a.s);
    try {
      localStorage.setItem("accent", JSON.stringify([a.p, a.s]));
    } catch {}
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Aksent rəngini dəyiş"
        aria-expanded={open}
        data-cursor
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/10 bg-ink/5 text-muted transition hover:text-ink"
      >
        <Palette size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-50 flex gap-2 rounded-xl glass-strong p-2.5 shadow-premium">
          {ACCENTS.map((a) => (
            <button
              key={a.name}
              onClick={() => choose(a)}
              title={a.name}
              aria-label={a.name}
              data-cursor
              className="h-6 w-6 rounded-full ring-1 ring-white/25 transition hover:scale-110"
              style={{ background: `rgb(${a.p})` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
