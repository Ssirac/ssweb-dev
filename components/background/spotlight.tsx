"use client";
import { useEffect, useRef } from "react";

/**
 * Ambient cursor glow. Updates CSS variables via requestAnimationFrame
 * instead of React state, so moving the mouse never re-renders the tree.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return; // skip on touch
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (el) {
          el.style.setProperty("--mx", `${e.clientX}px`);
          el.style.setProperty("--my", `${e.clientY}px`);
        }
      });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(69,80,245,0.08), transparent 40%)",
      }}
    />
  );
}
