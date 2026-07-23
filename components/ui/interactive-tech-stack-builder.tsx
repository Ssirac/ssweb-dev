"use client";

// LEGO tech-stack builder (adapted from the 21st.dev interactive onboarding).
// Site adaptations: icons come from react-icons/lucide instead of hand-rolled
// SVGs, the modules are our real stack, the base block is brand indigo with an
// "SS Developer" profile, copy is AZ/EN and completing the stack fires
// confetti. No canvas or rAF loops: everything animates only on click (WAAPI),
// so this section costs nothing while idle.

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  useAnimation,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  MotionValue,
} from "framer-motion";
import { User } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiThreedotjs,
  SiJavascript,
  SiHtml5,
  SiNodedotjs,
  SiGit,
  SiFigma,
} from "react-icons/si";
import { fireConfetti } from "@/lib/confetti";
import { useLang } from "@/lib/i18n";
import { LiquidGlow } from "@/components/ui/liquid-glow";

const GRID_CONSTANTS = {
  STUD_WIDTH: 65,
  ROW_HEIGHT: 80,
  MAX_ROWS: 20,
  COLS: 6,
  APEX_HEIGHT: 150,
};

const STUD_THEMES = {
  green: {
    wall: "linear-gradient(90deg, #087028 0%, #10923b 20%, #1ab84d 38%, #20cc55 50%, #1ab84d 62%, #10923b 80%, #087028 100%)",
    cap: "linear-gradient(135deg, #42f585 0%, #25dd62 40%, #18c04e 70%, #10a040 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,40,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  dark: {
    wall: "linear-gradient(90deg, #09090b 0%, #18181b 20%, #27272a 38%, #3f3f46 50%, #27272a 62%, #18181b 80%, #09090b 100%)",
    cap: "linear-gradient(135deg, #52525b 0%, #3f3f46 40%, #27272a 70%, #18181b 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.2)",
  },
  blue: {
    wall: "linear-gradient(90deg, #1e3a8a 0%, #1d4ed8 20%, #2563eb 38%, #3b82f6 50%, #2563eb 62%, #1d4ed8 80%, #1e3a8a 100%)",
    cap: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 40%, #3b82f6 70%, #2563eb 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,0,80,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  red: {
    wall: "linear-gradient(90deg, #7f1d1d 0%, #b91c1c 20%, #dc2626 38%, #ef4444 50%, #dc2626 62%, #b91c1c 80%, #7f1d1d 100%)",
    cap: "linear-gradient(135deg, #fca5a5 0%, #f87171 40%, #ef4444 70%, #dc2626 100%)",
    shadow: "radial-gradient(ellipse, rgba(80,0,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  indigo: {
    wall: "linear-gradient(90deg, #2b34b8 0%, #3743d6 20%, #4550f5 38%, #5a64ff 50%, #4550f5 62%, #3743d6 80%, #2b34b8 100%)",
    cap: "linear-gradient(135deg, #aab1ff 0%, #7c85ff 40%, #4550f5 70%, #3743d6 100%)",
    shadow: "radial-gradient(ellipse, rgba(10,10,60,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  yellow: {
    wall: "linear-gradient(90deg, #a16207 0%, #ca8a04 20%, #eab308 38%, #facc15 50%, #eab308 62%, #ca8a04 80%, #a16207 100%)",
    cap: "linear-gradient(135deg, #fef08a 0%, #fde047 40%, #eab308 70%, #ca8a04 100%)",
    shadow: "radial-gradient(ellipse, rgba(80,50,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
};

type StudColor = keyof typeof STUD_THEMES;

const LegoStud = ({ color = "green", yOffset = 0 }: { color?: StudColor; yOffset?: number }) => {
  const t = STUD_THEMES[color];
  const studHeight = 16;
  const studWidth = 72;
  const studCapHeight = 16;

  return (
    <div className="relative flex flex-1 items-end justify-center" style={{ transform: `translateY(${yOffset}px)` }}>
      <div
        className="absolute bottom-[-3px] left-1/2 z-0 w-[75%] -translate-x-1/2 rounded-[50%]"
        style={{ height: "10px", background: t.shadow }}
      />

      <div className="relative z-10" style={{ width: `${studWidth}%`, maxWidth: "42px", marginBottom: "-1px" }}>
        <div
          className="relative w-full overflow-hidden"
          style={{ height: `${studHeight}px`, borderRadius: "50% / 20%", background: t.wall }}
        >
          <div
            className="absolute top-0 left-[20%] h-full w-[25%]"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)" }}
          />
        </div>

        <div
          className="absolute left-0 flex w-full items-center justify-center overflow-hidden rounded-[50%]"
          style={{
            top: `-${studCapHeight / 2}px`,
            height: `${studCapHeight}px`,
            background: t.cap,
            boxShadow:
              "inset 0px 2px 4px rgba(255,255,255,0.6), inset 0px -2px 4px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.4)",
            borderTop: `1px solid ${t.rim}`,
          }}
        >
          <span
            className="pointer-events-none select-none text-[10px] font-black tracking-widest opacity-80"
            style={{
              color: "rgba(0,0,0,0.15)",
              textShadow: "0px 1px 0px rgba(255,255,255,0.6)",
              transform: "scaleY(0.55) translateY(-1px)",
            }}
          >
            SS
          </span>
        </div>
      </div>
    </div>
  );
};

interface LegoBlockProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  topColor: string;
  faceGradient: string;
  bottomColor: string;
  topHeight?: number;
  bottomHeight?: number;
  roundedTop?: boolean;
  roundedBottom?: boolean;
  className?: string;
  children: React.ReactNode;
  studs?: number;
  studColor?: StudColor;
  hideStuds?: boolean | number[];
  studYOffset?: number;
}

const LegoBlock = ({
  mouseX,
  mouseY,
  topColor,
  faceGradient,
  bottomColor,
  topHeight = 19,
  bottomHeight = 15,
  roundedTop = false,
  roundedBottom = false,
  className = "",
  children,
  studs = 0,
  studColor = "green",
  hideStuds = false,
  studYOffset = 12,
}: LegoBlockProps) => {
  const highlightBg = useMotionTemplate`radial-gradient(circle 120px at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.25), transparent)`;

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="relative w-full"
        style={{
          height: `${topHeight}px`,
          background: `linear-gradient(to bottom, ${topColor}, color-mix(in srgb, ${topColor} 100%, black))`,
          boxShadow: "inset 0px 0px 4px rgba(0,0,0,0.28)",
          borderRadius: roundedTop ? "4px 4px 0 0" : "0",
        }}
      >
        {studs > 0 && (
          <div className="absolute bottom-full left-0 flex w-full">
            {[...Array(studs)].map((_, i) => {
              const isHidden = Array.isArray(hideStuds) ? hideStuds.includes(i) : hideStuds;
              return isHidden ? (
                <div key={i} className="flex-1" />
              ) : (
                <LegoStud key={i} color={studColor} yOffset={studYOffset} />
              );
            })}
          </div>
        )}
      </div>
      <div
        className="relative w-full overflow-hidden border-x border-black/5"
        style={{ background: faceGradient, boxShadow: "inset 0px 2px 6px rgba(255,255,255,0.47)" }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 opacity-60"
          style={{ background: highlightBg }}
        />
        <div className="relative z-30">{children}</div>
      </div>
      <div
        className="relative w-full"
        style={{
          height: `${bottomHeight}px`,
          background: bottomColor,
          boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.15)",
          borderRadius: roundedBottom ? "0 0 4px 4px" : "0",
        }}
      />
    </div>
  );
};

// Our actual toolbelt. Stud counts sum to 30 = five full 6-stud rows.
const MODULES = [
  {
    id: "react",
    name: "React",
    icon: SiReact,
    studs: 4,
    colors: {
      topColor: "#38bdf8",
      faceGradient: "linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
      bottomColor: "#075985",
      studColor: "blue" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "next",
    name: "Next.js",
    icon: SiNextdotjs,
    studs: 4,
    colors: {
      topColor: "#27272a",
      faceGradient: "linear-gradient(180deg, #3f3f46 0%, #27272a 50%, #18181b 100%)",
      bottomColor: "#09090b",
      studColor: "dark" as StudColor,
      iconBg: "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: SiTypescript,
    studs: 2,
    colors: {
      topColor: "#60a5fa",
      faceGradient: "linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
      bottomColor: "#1e3a8a",
      studColor: "blue" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "tailwind",
    name: "Tailwind",
    icon: SiTailwindcss,
    studs: 2,
    colors: {
      topColor: "#2dd4bf",
      faceGradient: "linear-gradient(180deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)",
      bottomColor: "#115e59",
      studColor: "green" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: SiJavascript,
    studs: 4,
    colors: {
      topColor: "#fde047",
      faceGradient: "linear-gradient(180deg, #facc15 0%, #eab308 50%, #ca8a04 100%)",
      bottomColor: "#854d0e",
      studColor: "yellow" as StudColor,
      iconBg: "bg-black/25 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "html",
    name: "HTML/CSS",
    icon: SiHtml5,
    studs: 2,
    colors: {
      topColor: "#fb923c",
      faceGradient: "linear-gradient(180deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
      bottomColor: "#9a3412",
      studColor: "red" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "framer",
    name: "Framer",
    icon: SiFramer,
    studs: 2,
    colors: {
      topColor: "#d946ef",
      faceGradient: "linear-gradient(180deg, #c026d3 0%, #a21caf 50%, #86198f 100%)",
      bottomColor: "#701a75",
      studColor: "red" as StudColor,
      iconBg: "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "three",
    name: "Three.js",
    icon: SiThreedotjs,
    studs: 4,
    colors: {
      topColor: "#9ca3af",
      faceGradient: "linear-gradient(180deg, #6b7280 0%, #4b5563 50%, #374151 100%)",
      bottomColor: "#1f2937",
      studColor: "dark" as StudColor,
      iconBg: "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "node",
    name: "Node.js",
    icon: SiNodedotjs,
    studs: 2,
    colors: {
      topColor: "#4ade80",
      faceGradient: "linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
      bottomColor: "#14532d",
      studColor: "green" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "git",
    name: "Git",
    icon: SiGit,
    studs: 2,
    colors: {
      topColor: "#f87171",
      faceGradient: "linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
      bottomColor: "#7f1d1d",
      studColor: "red" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "figma",
    name: "Figma",
    icon: SiFigma,
    studs: 2,
    colors: {
      topColor: "#c084fc",
      faceGradient: "linear-gradient(180deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)",
      bottomColor: "#581c87",
      studColor: "indigo" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    },
  },
];

type Module = (typeof MODULES)[0];

const ModuleBlock = ({
  module,
  hiddenStuds = [],
  onClick,
  isAnimating,
  startRect,
  mouseX,
  mouseY,
  onAnimationComplete,
}: {
  module: Module;
  hiddenStuds?: number[];
  onClick: (e: React.MouseEvent) => void;
  isAnimating?: boolean;
  startRect?: DOMRect | null;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  onAnimationComplete?: () => void;
}) => {
  const widthPx = module.studs * GRID_CONSTANTS.STUD_WIDTH;
  const isCompact = module.studs <= 2;
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAnimating && startRect && wrapperRef.current) {
      const endRect = wrapperRef.current.getBoundingClientRect();
      const dx = startRect.left - endRect.left;
      const dy = startRect.top - endRect.top;

      // Arc apex: guarantees the block jumps higher than both its start and end point
      const apexY = Math.min(dy, 0) - GRID_CONSTANTS.APEX_HEIGHT;

      const animation = wrapperRef.current.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(1, 1)`, filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.2))", offset: 0 },
          { transform: `translate(${dx}px, ${dy}px) scale(1.1, 0.85)`, filter: "drop-shadow(0px 5px 5px rgba(0,0,0,0.3))", offset: 0.15 },
          { transform: `translate(${dx * 0.75}px, ${dy + (apexY - dy) * 0.5}px) scale(0.9, 1.15)`, filter: "drop-shadow(0px 30px 20px rgba(0,0,0,0.05))", offset: 0.35 },
          { transform: `translate(${dx * 0.5}px, ${apexY}px) scale(1, 1)`, filter: "drop-shadow(0px 40px 20px rgba(0,0,0,0))", offset: 0.55 },
          { transform: `translate(${dx * 0.25}px, ${apexY * 0.5}px) scale(0.9, 1.15)`, filter: "drop-shadow(0px 30px 20px rgba(0,0,0,0.05))", offset: 0.75 },
          { transform: "translate(0px, 0px) scale(1.15, 0.85)", filter: "drop-shadow(0px 5px 5px rgba(0,0,0,0.3))", offset: 0.9 },
          { transform: "translate(0px, 0px) scale(1, 1)", filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.2))", offset: 1 },
        ],
        { duration: 1200, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "both" },
      );

      animation.onfinish = () => onAnimationComplete?.();

      return () => animation.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating, startRect]);

  return (
    <div ref={wrapperRef} className="lego-block-wrapper relative z-50" style={{ width: widthPx }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={module.name}
        className="group relative w-full shrink-0 cursor-pointer touch-none rounded-lg text-left transition-all duration-200 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary active:scale-95"
      >
        <div className="pointer-events-none absolute inset-0 z-30 rounded-lg bg-white/0 transition-colors group-hover:bg-white/10" />
        <LegoBlock
          mouseX={mouseX}
          mouseY={mouseY}
          topColor={module.colors.topColor}
          faceGradient={module.colors.faceGradient}
          bottomColor={module.colors.bottomColor}
          roundedTop
          roundedBottom
          studs={module.studs}
          studColor={module.colors.studColor}
          hideStuds={hiddenStuds}
        >
          <div className={`flex h-[60px] w-full items-center ${isCompact ? "gap-2.5 px-3" : "gap-3 px-4"}`}>
            <div
              className={`${isCompact ? "h-7 w-7 rounded-md" : "h-9 w-9 rounded-lg"} ${module.colors.iconBg} flex shrink-0 items-center justify-center`}
            >
              <module.icon className={module.colors.iconColor} size={isCompact ? 18 : 24} />
            </div>
            <h4 className={`truncate font-sans font-bold tracking-wide text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] ${isCompact ? "text-[14px]" : "text-[17px]"}`}>
              {module.name}
            </h4>
          </div>
        </LegoBlock>
      </button>
    </div>
  );
};

export default function StackBuilder({ className = "" }: { className?: string }) {
  const { lang } = useLang();
  const az = lang === "az";

  const [equippedIds, setEquippedIds] = useState<string[]>([]);
  const [animatingBlocks, setAnimatingBlocks] = useState<Record<string, DOMRect>>({});

  const controls = useAnimation();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const handlePointerMove = (e: React.PointerEvent) => {
    mouseX.set((e.clientX / window.innerWidth) * 100);
    mouseY.set((e.clientY / window.innerHeight) * 100);
  };

  const handleToggleEquip = (id: string, e: React.MouseEvent) => {
    // Prevent interrupting an ongoing animation
    if (animatingBlocks[id]) return;

    const el = (e.currentTarget as HTMLElement).closest(".lego-block-wrapper");
    if (!el) return;
    const startRect = el.getBoundingClientRect();

    setAnimatingBlocks((prev) => ({ ...prev, [id]: startRect }));

    setEquippedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });

    // Simulate heavy impact when the block lands (at 90% of 1200ms)
    setTimeout(() => {
      controls.start({
        y: [0, 10, -3, 0],
        transition: { duration: 0.4, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
      });
    }, 1080);
  };

  const equippedModules = equippedIds.map((id) => MODULES.find((m) => m.id === id)!);
  const unequippedModules = MODULES.filter((m) => !equippedIds.includes(m.id));

  // Compute the 2D packing grid
  const { grid, positionedModules } = useMemo(() => {
    const calculatedGrid: (string | null)[][] = [];
    const positioned = equippedModules.map((m) => {
      let placedRow = -1;
      let placedCol = -1;
      for (let r = 0; r < GRID_CONSTANTS.MAX_ROWS; r++) {
        if (!calculatedGrid[r]) calculatedGrid[r] = Array(GRID_CONSTANTS.COLS).fill(null);
        let contiguous = 0;
        for (let c = 0; c < GRID_CONSTANTS.COLS; c++) {
          if (!calculatedGrid[r][c]) {
            contiguous++;
            if (contiguous === m.studs) {
              placedRow = r;
              placedCol = c - m.studs + 1;
              break;
            }
          } else {
            contiguous = 0;
          }
        }
        if (placedRow !== -1) break;
      }
      if (placedRow !== -1) {
        for (let i = 0; i < m.studs; i++) {
          calculatedGrid[placedRow][placedCol + i] = m.id;
        }
      } else {
        placedRow = 0;
        placedCol = 0;
      }
      return { module: m, rowIndex: placedRow, colIndex: placedCol };
    });
    return { grid: calculatedGrid, positionedModules: positioned };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equippedIds]);

  const hiddenBaseStuds: number[] = [];
  if (grid[0]) {
    grid[0].forEach((occupantId, idx) => {
      if (occupantId && !animatingBlocks[occupantId]) hiddenBaseStuds.push(idx);
    });
  }

  const towerHeight =
    equippedModules.length > 0
      ? (Math.max(...positionedModules.map((m) => m.rowIndex)) + 1) * GRID_CONSTANTS.ROW_HEIGHT
      : 0;

  const clearAnimating = (id: string) => {
    setAnimatingBlocks((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className={`relative flex w-full select-none flex-col overflow-hidden font-sans ${className}`}
    >
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-12 px-6 pt-6 pb-4 lg:flex-row lg:gap-20">
        {/* LEFT: the parts bin */}
        <div className="flex w-full max-w-[500px] flex-1 flex-col justify-center">
          <div className="relative z-20 flex min-h-[200px] flex-wrap justify-center gap-5 lg:justify-start">
            {unequippedModules.map((module) => {
              const startRect = animatingBlocks[module.id];
              return (
                <ModuleBlock
                  key={module.id}
                  module={module}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isAnimating={!!startRect}
                  startRect={startRect || null}
                  onAnimationComplete={() => clearAnimating(module.id)}
                  onClick={(e) => handleToggleEquip(module.id, e)}
                />
              );
            })}
          </div>
        </div>

        {/* RIGHT: the profile tower */}
        <div className="mt-10 flex w-full flex-col items-center gap-8 lg:mt-0 lg:w-auto">
          <div className="flex shrink-0 origin-bottom scale-[0.72] flex-col items-center sm:scale-[0.8] lg:scale-100">
            <motion.div
              animate={controls}
              className="relative w-[390px] rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.35)] transition-all duration-700 ease-out"
              style={{ marginTop: `${towerHeight}px` }}
            >
              {/* stacked equipped modules */}
              <div className="absolute left-0 z-20 h-0 w-full" style={{ bottom: "calc(100% - 14px)" }}>
                {positionedModules.map(({ module, rowIndex, colIndex }) => {
                  const hiddenLocalStuds: number[] = [];
                  if (grid[rowIndex + 1]) {
                    for (let i = 0; i < module.studs; i++) {
                      const occupantId = grid[rowIndex + 1][colIndex + i];
                      if (occupantId && !animatingBlocks[occupantId]) {
                        hiddenLocalStuds.push(i);
                      }
                    }
                  }

                  const startRect = animatingBlocks[module.id];

                  return (
                    <div
                      key={module.id}
                      className="absolute"
                      style={{
                        bottom: rowIndex * GRID_CONSTANTS.ROW_HEIGHT,
                        left: colIndex * GRID_CONSTANTS.STUD_WIDTH,
                        zIndex: rowIndex * 10,
                      }}
                    >
                      <ModuleBlock
                        module={module}
                        hiddenStuds={hiddenLocalStuds}
                        mouseX={mouseX}
                        mouseY={mouseY}
                        isAnimating={!!startRect}
                        startRect={startRect || null}
                        onAnimationComplete={() => clearAnimating(module.id)}
                        onClick={(e) => handleToggleEquip(module.id, e)}
                      />
                    </div>
                  );
                })}
              </div>

              {/* base profile block (brand indigo) */}
              <LegoBlock
                mouseX={mouseX}
                mouseY={mouseY}
                topColor="#6e76ff"
                faceGradient="linear-gradient(180deg, #5a64ff 0%, #4550f5 50%, #3743d6 100%)"
                bottomColor="#2b34b8"
                roundedTop
                roundedBottom
                studs={6}
                studColor="indigo"
                hideStuds={hiddenBaseStuds}
                className="relative z-10"
              >
                <div className="flex items-center justify-between px-5 py-4 pt-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/20 shadow-inner">
                      <User className="h-6 w-6 text-white drop-shadow-md" size={24} />
                    </div>
                    <div className="text-white drop-shadow-md">
                      <h3 className="truncate font-sans text-[17px] font-bold tracking-wide drop-shadow-md">
                        SS Developer
                      </h3>
                      <p className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100/90 drop-shadow-sm">
                        {equippedModules.length === 0
                          ? az
                            ? "Texnologiyaları seç"
                            : "Select technologies"
                          : `${az ? "Səviyyə" : "Level"}: ${equippedModules.length * 10} XP`}
                      </p>
                    </div>
                  </div>
                </div>
              </LegoBlock>
            </motion.div>
          </div>

          {/* completion button */}
          <div className="flex h-16 w-full flex-col items-center justify-start gap-3">
            <AnimatePresence>
              {equippedModules.length === MODULES.length && (
                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden rounded-full px-8 py-3.5 font-medium tracking-wide text-white shadow-glow transition hover:shadow-glow-lg"
                  onClick={() => fireConfetti()}
                >
                  <LiquidGlow />
                  <span className="relative z-10">{az ? "Stek tamamlandı!" : "Stack complete!"} 🎉</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export { StackBuilder as Component };
