"use client";

// Interactive 3D "tag cloud" sphere of tech icons. Points are distributed on a
// sphere (Fibonacci), rotated every frame (auto-drift + mouse influence) and
// projected to 2D by hand — so labels always face the viewer, depth reads
// through scale/opacity, and there's no WebGL or font dependency to load.
// Desktop only; mobile / reduced-motion fall back to a static grid.

import { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";

export type SkillItem = { name: string; Icon: IconType };

const RADIUS = 150; // px
const BOX = 380; // px (square stage)

function fibonacciSphere(n: number) {
  const pts: [number, number, number][] = [];
  const inc = Math.PI * (3 - Math.sqrt(5));
  const off = 2 / n;
  for (let i = 0; i < n; i++) {
    const y = i * off - 1 + off / 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * inc;
    pts.push([Math.cos(phi) * r, y, Math.sin(phi) * r]);
  }
  return pts;
}

function Grid({ items }: { items: SkillItem[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {items.map(({ name, Icon }) => (
        <div
          key={name}
          title={name}
          className="flex h-16 w-16 items-center justify-center rounded-2xl glass shadow-premium"
        >
          <Icon className="text-2xl text-muted" />
        </div>
      ))}
    </div>
  );
}

export function SkillsSphere({ items }: { items: SkillItem[] }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const points = useMemo(() => fibonacciSphere(items.length), [items.length]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rot = useRef({ x: -0.25, y: 0 });
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    setEnabled(desktop && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const tick = () => {
      // auto-drift, or steer toward the cursor while hovering
      const dx = mouse.current.active ? mouse.current.y * 0.026 : 0.0016;
      const dy = mouse.current.active ? mouse.current.x * 0.026 : 0.0022;
      rot.current.x += dx;
      rot.current.y += dy;

      const cx = Math.cos(rot.current.x), sx = Math.sin(rot.current.x);
      const cy = Math.cos(rot.current.y), sy = Math.sin(rot.current.y);

      for (let i = 0; i < points.length; i++) {
        const el = tagRefs.current[i];
        if (!el) continue;
        const [x, y, z] = points[i];
        // rotate around Y then X
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const scale = (z2 + 2) / 3; // ~0.33 (back) .. 1 (front)
        el.style.transform = `translate(-50%, -50%) translate3d(${x1 * RADIUS}px, ${y2 * RADIUS}px, 0) scale(${scale})`;
        el.style.opacity = String(0.35 + 0.65 * ((z2 + 1) / 2));
        el.style.zIndex = String(Math.round((z2 + 1) * 100));
        el.style.filter = z2 < -0.2 ? "blur(0.6px)" : "none";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, points]);

  if (enabled === null) {
    // Pre-hydration we don't yet know desktop vs mobile. Render the same grid
    // the mobile fallback resolves to (so phones see no height change), and
    // reserve the sphere's height only at >=md, where we swap to the canvas.
    // Fixing a flat BOX here made the page ~156px taller on load and then
    // snap shorter — the phantom scrollbar you saw on refresh.
    return (
      <div className="md:h-[380px]" aria-hidden>
        <Grid items={items} />
      </div>
    );
  }
  if (!enabled) return <Grid items={items} />;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouse.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    mouse.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    mouse.current.active = true;
  };

  return (
    <div
      className="relative mx-auto"
      style={{ width: BOX, height: BOX }}
      onPointerMove={onMove}
      onPointerLeave={() => (mouse.current.active = false)}
      role="img"
      aria-label={items.map((i) => i.name).join(", ")}
    >
      {items.map(({ name, Icon }, i) => (
        <div
          key={name}
          ref={(el) => { tagRefs.current[i] = el; }}
          title={name}
          className="absolute left-1/2 top-1/2 flex h-14 w-14 items-center justify-center rounded-2xl glass shadow-premium transition-colors will-change-transform hover:!opacity-100 [&:hover_svg]:text-primary"
        >
          <Icon className="text-2xl text-muted transition-colors" />
        </div>
      ))}
    </div>
  );
}
