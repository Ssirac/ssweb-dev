"use client";
import { useEffect, useRef } from "react";

// Depth-layered particle network with mouse parallax: each dot carries a `z`
// depth that drives its size, brightness and how far it slides against the
// cursor — so the field reads as a shallow 3D space instead of a flat plane.
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    // Respect users who prefer reduced motion — skip the animation entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const N = Math.min(70, Math.floor((w * h) / 26000));
    const dots = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      z: Math.random() * 0.8 + 0.2, // depth 0.2 (far) .. 1 (near)
      r: Math.random() * 1.6 + 0.4,
    }));

    // Smoothed pointer offset from screen centre (−1..1).
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / w - 0.5) * 2;
      target.y = (e.clientY / h - 0.5) * 2;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);

    const PARALLAX = 26; // px at full depth
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      ctx.clearRect(0, 0, w, h);

      // pre-compute the parallax-shifted screen position for each dot
      const sx: number[] = new Array(dots.length);
      const sy: number[] = new Array(dots.length);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        sx[i] = d.x - cur.x * PARALLAX * d.z;
        sy[i] = d.y - cur.y * PARALLAX * d.z;
      }

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        ctx.beginPath();
        ctx.arc(sx[i], sy[i], d.r * (0.5 + d.z), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,107,255,${0.25 + 0.5 * d.z})`;
        ctx.fill();
        for (let j = i + 1; j < dots.length; j++) {
          const dist = Math.hypot(sx[i] - sx[j], sy[i] - sy[j]);
          if (dist < 130) {
            const depth = (d.z + dots[j].z) / 2;
            ctx.beginPath();
            ctx.moveTo(sx[i], sy[i]);
            ctx.lineTo(sx[j], sy[j]);
            ctx.strokeStyle = `rgba(123,77,255,${0.14 * (1 - dist / 130) * depth})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 z-0 opacity-70 pointer-events-none" />;
}
