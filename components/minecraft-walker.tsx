"use client";

// Autonomous roaming mascot: a small canvas that wanders freely across the whole
// viewport — it strolls to a random point, then picks a new one, turning to face
// its direction of travel. Fully responsive (live viewport + box size). Skipped
// for reduced-motion / no-WebGL.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const MinecraftWalkerScene = dynamic(
  () => import("./minecraft-walker-scene").then((m) => m.MinecraftWalkerScene),
  { ssr: false },
);

export function MinecraftWalker() {
  const [enabled, setEnabled] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const dir = useRef(1); // 1 = facing right, -1 = facing left

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
    let last = performance.now();
    const w = () => box.offsetWidth || 130;
    const h = () => box.offsetHeight || 170;
    let x = (window.innerWidth - w()) / 2;
    let y = (window.innerHeight - h()) / 2;
    let tx = x;
    let ty = y;
    const speed = 95; // px per second

    const pickTarget = () => {
      tx = Math.random() * Math.max(0, window.innerWidth - w());
      ty = Math.random() * Math.max(0, window.innerHeight - h());
    };
    pickTarget();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const dx = tx - x;
      const dy = ty - y;
      const dist = Math.hypot(dx, dy);
      if (dist < 4) {
        pickTarget();
      } else {
        const step = Math.min(speed * dt, dist);
        x += (dx / dist) * step;
        y += (dy / dist) * step;
        if (Math.abs(dx) > 1) dir.current = dx >= 0 ? 1 : -1;
      }
      box.style.transform = `translate(${x}px, ${y}px)`;
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
      className="pointer-events-none fixed left-0 top-0 z-40 h-[130px] w-[100px] sm:h-[170px] sm:w-[130px]"
    >
      <MinecraftWalkerScene dir={dir} />
    </div>
  );
}
