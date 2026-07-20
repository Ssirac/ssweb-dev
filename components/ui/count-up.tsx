"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Animates the leading integer of `text` from 0 to its value when scrolled
 * into view, preserving any suffix (e.g. "10+ layihə" → counts 0→10, keeps
 * "+ layihə"). Non-numeric text is rendered unchanged.
 */
export function CountUp({
  text,
  duration = 1.3,
  className,
}: {
  text: string | number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const raw = String(text);
  const match = raw.match(/^(\d+)([\s\S]*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (target === null || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  if (target === null) return <span ref={ref} className={className}>{raw}</span>;
  // Reserve the final width so the digit count growing (e.g. 0 → 10) doesn't
  // reflow the text and cause a layout shift. tabular-nums keeps every digit
  // the same width; min-width pins the box to the final number's length.
  return (
    <span ref={ref} className={className}>
      <span className="inline-block text-left tabular-nums" style={{ minWidth: `${String(target).length}ch` }}>{val}</span>
      {suffix}
    </span>
  );
}
