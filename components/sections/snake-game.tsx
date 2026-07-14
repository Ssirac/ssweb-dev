"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Gamepad2 } from "lucide-react";
import { useLang } from "@/lib/i18n";

const CELLS = 18;
const CELL = 20; // px
const SIZE = CELLS * CELL;
const SPEED = 110; // ms per step

type Pt = { x: number; y: number };
const cssVar = (name: string) =>
  `rgb(${getComputedStyle(document.documentElement).getPropertyValue(name).trim()})`;

export function SnakeGame() {
  const { lang } = useLang();
  const az = lang === "az";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snake = useRef<Pt[]>([]);
  const dir = useRef<Pt>({ x: 1, y: 0 });
  const nextDir = useRef<Pt>({ x: 1, y: 0 });
  const food = useRef<Pt>({ x: 10, y: 9 });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [status, setStatus] = useState<"idle" | "running" | "over">("idle");
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(0);

  useEffect(() => {
    const h = Number(localStorage.getItem("snake-high") || 0);
    setHigh(h);
  }, []);

  const placeFood = useCallback(() => {
    let p: Pt;
    do {
      p = { x: Math.floor(Math.random() * CELLS), y: Math.floor(Math.random() * CELLS) };
    } while (snake.current.some((s) => s.x === p.x && s.y === p.y));
    food.current = p;
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    // subtle grid
    const line = getComputedStyle(document.documentElement).getPropertyValue("--c-line").trim();
    ctx.strokeStyle = `rgb(${line} / 0.06)`;
    for (let i = 1; i < CELLS; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(SIZE, i * CELL); ctx.stroke();
    }
    // food
    const f = food.current;
    ctx.fillStyle = "#25D366";
    ctx.beginPath();
    ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    // snake
    const primary = cssVar("--c-primary");
    const secondary = cssVar("--c-secondary");
    snake.current.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? primary : secondary;
      const pad = i === 0 ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 5);
      ctx.fill();
    });
  }, []);

  const gameOver = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setStatus("over");
    setScore((sc) => {
      setHigh((h) => {
        const nh = Math.max(h, sc);
        localStorage.setItem("snake-high", String(nh));
        return nh;
      });
      return sc;
    });
  }, []);

  const step = useCallback(() => {
    dir.current = nextDir.current;
    const head = snake.current[0];
    const nx = head.x + dir.current.x;
    const ny = head.y + dir.current.y;
    // wall or self collision
    if (nx < 0 || ny < 0 || nx >= CELLS || ny >= CELLS ||
        snake.current.some((s) => s.x === nx && s.y === ny)) {
      gameOver();
      return;
    }
    const newSnake = [{ x: nx, y: ny }, ...snake.current];
    if (nx === food.current.x && ny === food.current.y) {
      setScore((s) => s + 1);
      placeFood();
    } else {
      newSnake.pop();
    }
    snake.current = newSnake;
    draw();
  }, [draw, gameOver, placeFood]);

  const start = useCallback(() => {
    snake.current = [{ x: 6, y: 9 }, { x: 5, y: 9 }, { x: 4, y: 9 }];
    dir.current = { x: 1, y: 0 };
    nextDir.current = { x: 1, y: 0 };
    setScore(0);
    placeFood();
    setStatus("running");
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(step, SPEED);
    draw();
  }, [draw, placeFood, step]);

  const turn = useCallback((x: number, y: number) => {
    const d = dir.current;
    if (d.x === -x && d.y === -y) return; // no reverse
    nextDir.current = { x, y };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      const map: Record<string, [number, number]> = {
        ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1],
        ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0],
      };
      if (map[k]) { e.preventDefault(); turn(map[k][0], map[k][1]); }
      if ((k === " " || k === "Enter") && status !== "running") { e.preventDefault(); start(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start, status, turn]);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  useEffect(() => { draw(); }, [draw]);

  // touch swipe
  const touch = useRef<Pt | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0);
    else turn(0, dy > 0 ? 1 : -1);
    touch.current = null;
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center">
      <div className="mb-4 flex w-full items-center justify-between font-mono text-sm">
        <span className="flex items-center gap-2 text-muted">
          <Gamepad2 size={16} className="text-primary" /> {az ? "Xal" : "Score"}: <b className="text-ink">{score}</b>
        </span>
        <span className="text-muted">{az ? "Rekord" : "Best"}: <b className="text-primary">{high}</b></span>
      </div>

      <div className="relative rounded-2xl glass p-3 shadow-premium">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="block h-auto w-full max-w-[360px] touch-none rounded-lg"
          style={{ aspectRatio: "1 / 1" }}
        />
        {status !== "running" && (
          <div className="absolute inset-3 flex flex-col items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm">
            {status === "over" && (
              <p className="mb-3 font-display text-2xl font-bold text-ink">
                {az ? "Oyun bitdi" : "Game over"} · {score}
              </p>
            )}
            <button
              onClick={start}
              className="flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-medium text-background shadow-glow transition hover:shadow-glow-lg"
            >
              {status === "over" ? <RotateCcw size={17} /> : <Play size={17} />}
              {status === "over" ? (az ? "Yenidən" : "Play again") : (az ? "Başla" : "Play")}
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center font-mono text-xs text-muted">
        {az ? "Ox düymələri / WASD · mobil: sürüşdür" : "Arrow keys / WASD · mobile: swipe"}
      </p>
    </div>
  );
}
