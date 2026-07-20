"use client";

// Scroll-driven model block: a tall section with a sticky, centered canvas.
// As you scroll through the section the model spins a full turn. Desktop +
// WebGL + motion only; otherwise a soft gradient-sphere fallback.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const ScrollModelScene = dynamic(
  () => import("./scroll-model-scene").then((m) => m.ScrollModelScene),
  { ssr: false },
);

export function ScrollModel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
  });

  const [webgl, setWebgl] = useState(false);
  const [hint, setHint] = useState(true);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      ok = false;
    }
    setWebgl(desktop && !reduce && ok);
    const t = setTimeout(() => setHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={sectionRef} className="relative mx-auto w-full max-w-4xl px-6" style={{ height: "130vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div className="relative h-[72vh] w-full">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(circle at 50% 50%, rgba(69,80,245,0.14), transparent 65%)" }}
          />
          {webgl ? (
            <ScrollModelScene progress={progress} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-float h-48 w-48 rounded-full bg-brand-gradient opacity-70 blur-[2px]" />
            </div>
          )}
          {webgl && hint && (
            <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/25 px-3 py-1 font-mono text-xs text-white/70 backdrop-blur-sm">
              ↕ scroll et
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
