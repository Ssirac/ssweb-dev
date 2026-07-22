"use client";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Perf notes: the conic border spins only while hovered (.card-spin-layer),
// and the cursor highlight is driven by CSS variables written straight to the
// DOM — no React state, so mousemove never re-renders the card subtree.
export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="group relative h-full rounded-3xl">
      {/* rotating conic glow border — appears (and spins) on hover only */}
      <div className="pointer-events-none absolute -inset-px overflow-hidden rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className="card-spin-layer absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(69,80,245,0.9) 60deg, transparent 130deg, transparent 360deg)",
          }}
        />
      </div>

      <div
        ref={ref}
        onMouseMove={(e) => {
          const el = ref.current;
          if (!el) return;
          const r = el.getBoundingClientRect();
          el.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
          el.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
          el.style.setProperty("--go", "1");
        }}
        onMouseLeave={() => ref.current?.style.setProperty("--go", "0")}
        className={cn(
          "relative overflow-hidden rounded-3xl glass p-6 shadow-premium transition-all duration-300",
          className
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: "var(--go, 0)",
            background:
              "radial-gradient(400px circle at var(--gx, 50%) var(--gy, 50%), rgba(69,80,245,0.14), transparent 45%)",
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
