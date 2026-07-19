"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  // Two lagging springs form a soft accent comet-trail behind the cursor.
  const tx1 = useSpring(x, { stiffness: 170, damping: 22, mass: 0.6 });
  const ty1 = useSpring(y, { stiffness: 170, damping: 22, mass: 0.6 });
  const tx2 = useSpring(x, { stiffness: 90, damping: 20, mass: 0.9 });
  const ty2 = useSpring(y, { stiffness: 90, damping: 20, mass: 0.9 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a,button,[data-cursor]"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full"
        style={{
          x: tx2, y: ty2, width: 30, height: 30,
          translateX: "-50%", translateY: "-50%", filter: "blur(3px)",
          background: "radial-gradient(circle, rgba(69,80,245,0.28), transparent 70%)",
        }}
      />
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full"
        style={{
          x: tx1, y: ty1, width: 16, height: 16,
          translateX: "-50%", translateY: "-50%", filter: "blur(1px)",
          background: "radial-gradient(circle, rgba(69,80,245,0.45), transparent 70%)",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-white mix-blend-difference"
        style={{ x: sx, y: sy, width: 8, height: 8, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border border-primary"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: hovering ? 56 : 34, height: hovering ? 56 : 34, opacity: hovering ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </>
  );
}
