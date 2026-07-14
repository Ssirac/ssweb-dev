"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * SS brand mark — the real logo image at `public/sslogo.jpg`.
 * Clipped to a circle so the square JPEG corners never show.
 * `showSymbols` is kept for API compatibility (no longer used).
 */
export function Logo({
  size = 56,
  className,
}: {
  size?: number;
  animated?: boolean;
  showSymbols?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 rounded-full blur-xl opacity-50"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(69,80,245,0.40), transparent 70%)" }}
      />
      <Image
        src="/sslogo.jpg"
        alt="SS Web Developer"
        width={size}
        height={size}
        priority
        className="relative z-10 h-full w-full rounded-full object-contain"
      />
    </span>
  );
}

export function LogoWordmark({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={size} />
      <div className="leading-tight">
        <span className="block font-display text-[15px] font-bold tracking-tight text-ink">SS Developer</span>
        <span className="block font-mono text-[10px] tracking-[0.25em] text-primary">WEB DEVELOPER</span>
      </div>
    </div>
  );
}
