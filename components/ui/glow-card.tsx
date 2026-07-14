"use client";
import { useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: 50, y: 50, o: 0 });
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setP({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, o: 1 });
      }}
      onMouseLeave={() => setP((s) => ({ ...s, o: 0 }))}
      className={cn(
        "group relative overflow-hidden rounded-3xl glass p-6 shadow-premium transition-all duration-300 hover:border-primary/30",
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
  );
}
