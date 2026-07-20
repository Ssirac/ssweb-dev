"use client";

// Autonomous walking mascot: a small canvas fixed to the bottom of the viewport
// that strolls left↔right on its own, turning at the edges. Fully responsive
// (uses live viewport + box width). Skipped for reduced-motion / no-WebGL.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const MinecraftWalkerScene = dynamic(
  () => import("./minecraft-walker-scene").then((m) => m.MinecraftWalkerScene),
  { ssr: false },
);

export function MinecraftWalker() {
  const [enabled, setEnabled] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const dir = useRef(1); // 1 = right, -1 = left

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      ok = false;
    }
    setEnabled(!reduce && ok);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const box = boxRef.current;
    if (!box) return;
    let raf = 0;
    let x = 0;
    let last = performance.now();
    const speed = 55; // px per second
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const maxX = Math.max(0, window.innerWidth - (box.offsetWidth || 120));
      x += dir.current * speed * dt;
      if (x <= 0) {
        x = 0;
        dir.current = 1;
      } else if (x >= maxX) {
        x = maxX;
        dir.current = -1;
      }
      box.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={boxRef}
      aria-hidden
      className="pointer-events-none fixed bottom-0 left-0 z-40 h-[120px] w-[92px] sm:h-[150px] sm:w-[116px]"
    >
      <MinecraftWalkerScene dir={dir} />
    </div>
  );
}
