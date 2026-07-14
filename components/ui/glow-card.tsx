"use client";
import { useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: 50, y: 50, o: 0 });
  return (
    <div className="group relative rounded-3xl">
      {/* rotating conic glow border — appears on hover */}
      <div className="pointer-events-none absolute -inset-px overflow-hidden rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(69,80,245,0.9) 60deg, transparent 130deg, transparent 360deg)",
            animation: "card-spin 4.5s linear infinite",
          }}
        />
      </div>

      <div
        ref={ref}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          setP({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, o: 1 });
        }}
        onMouseLeave={() => setP((s) => ({ ...s, o: 0 }))}
        className={cn(
          "relative overflow-hidden rounded-3xl glass p-6 shadow-premium transition-all duration-300",
          className
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: p.o,
            background: `radial-gradient(400px circle at ${p.x}% ${p.y}%, rgba(69,80,245,0.14), transparent 45%)`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
