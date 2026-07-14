"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

const W = 640;
const H = 180;
const GROUND = H - 28;
const PLAYER = { x: 60, size: 32 };
const GRAVITY = 0.6;
const JUMP = -11;
const BASE_SPEED = 3.1;

const rgb = (name: string) =>
  `rgb(${getComputedStyle(document.documentElement).getPropertyValue(name).trim()})`;

type Obs = { x: number; w: number; h: number };

export function RunnerGame() {
  const { lang } = useLang();
  const az = lang === "az";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);

  const y = useRef(GROUND - PLAYER.size);
  const vy = useRef(0);
  const obstacles = useRef<Obs[]>([]);
  const speed = useRef(BASE_SPEED);
  const spawn = useRef(0);
  const dist = useRef(0);
  const running = useRef(false);
  const last = useRef(0);

  const [status, setStatus] = useState<"idle" | "running" | "over">("idle");
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(0);

  useEffect(() => { setHigh(Number(localStorage.getItem("runner-high") || 0)); }, []);

  const draw = useCallback((frameScore: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // ground line
    ctx.strokeStyle = rgb("--c-muted");
    ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();
    // moving ground dashes
    ctx.globalAlpha = 0.25;
    const off = dist.current % 40;
    for (let x = -off; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, GROUND + 8); ctx.lineTo(x + 16, GROUND + 8); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // player — a little branded creature
    const py = y.current;
    ctx.fillStyle = rgb("--c-primary");
    ctx.beginPath();
    (ctx as CanvasRenderingContext2D).roundRect(PLAYER.x, py, PLAYER.size, PLAYER.size, 7);
    ctx.fill();
    // eyes
    ctx.fillStyle = rgb("--c-background");
    ctx.beginPath(); ctx.arc(PLAYER.x + 22, py + 12, 3, 0, Math.PI * 2); ctx.fill();

    // obstacles
    ctx.fillStyle = rgb("--c-secondary");
    obstacles.current.forEach((o) => {
      ctx.beginPath();
      (ctx as CanvasRenderingContext2D).roundRect(o.x, GROUND - o.h, o.w, o.h, 4);
      ctx.fill();
    });

    // score
    ctx.fillStyle = rgb("--c-muted");
    ctx.font = "600 14px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillText(String(frameScore).padStart(5, "0"), W - 14, 22);
  }, []);

  const loop = useCallback((now: number) => {
    if (!running.current) return;
    // delta time normalised to 60fps → same speed on 60/120/144Hz screens
    if (!last.current) last.current = now;
    let dt = (now - last.current) / 16.6667;
    last.current = now;
    if (dt > 3) dt = 3; // clamp after tab switch / stutter

    // physics
    vy.current += GRAVITY * dt;
    y.current = Math.min(GROUND - PLAYER.size, y.current + vy.current * dt);
    dist.current += speed.current * dt;
    speed.current = BASE_SPEED + dist.current / 4500; // gentle ramp
    const sc = Math.floor(dist.current / 22);
    setScore(sc);

    // spawn obstacles
    spawn.current -= speed.current * dt;
    if (spawn.current <= 0) {
      const h = 22 + Math.random() * 24;
      obstacles.current.push({ x: W + 10, w: 16 + Math.random() * 14, h });
      spawn.current = 300 + Math.random() * 260;
    }
    obstacles.current.forEach((o) => (o.x -= speed.current * dt));
    obstacles.current = obstacles.current.filter((o) => o.x + o.w > -10);

    // collision (AABB with small forgiveness)
    const pad = 4;
    const px1 = PLAYER.x + pad, px2 = PLAYER.x + PLAYER.size - pad;
    const py1 = y.current + pad, py2 = y.current + PLAYER.size;
    const hit = obstacles.current.some((o) =>
      px2 > o.x && px1 < o.x + o.w && py2 > GROUND - o.h && py1 < GROUND
    );
    if (hit) {
      running.current = false;
      setStatus("over");
      setHigh((h) => {
        const nh = Math.max(h, sc);
        localStorage.setItem("runner-high", String(nh));
        return nh;
      });
      draw(sc);
      return;
    }

    draw(sc);
    raf.current = requestAnimationFrame(loop);
  }, [draw]);

  const jump = useCallback(() => {
    if (y.current >= GROUND - PLAYER.size - 0.5) vy.current = JUMP;
  }, []);

  const start = useCallback(() => {
    y.current = GROUND - PLAYER.size;
    vy.current = 0;
    obstacles.current = [];
    speed.current = BASE_SPEED;
    spawn.current = 120;
    dist.current = 0;
    last.current = 0;
    setScore(0);
    running.current = true;
    setStatus("running");
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(loop);
  }, [loop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault();
        if (running.current) jump();
        else start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); cancelAnimationFrame(raf.current); };
  }, [jump, start]);

  useEffect(() => { draw(0); }, [draw]);

  const tap = () => { if (running.current) jump(); else start(); };

  return (
    <section className="relative mx-auto max-w-2xl px-6 py-16">
      <div className="mb-5 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {az ? "Fasilə" : "Coffee break"}
        </span>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">
          {az ? "Tullan və maneələrdən qaç 🎮" : "Jump the obstacles 🎮"}
        </h2>
      </div>

      <div
        onClick={tap}
        onTouchStart={(e) => { e.preventDefault(); tap(); }}
        className="relative cursor-pointer overflow-hidden rounded-2xl glass p-3 shadow-premium select-none"
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block w-full"
          style={{ aspectRatio: `${W} / ${H}` }}
        />
        {status !== "running" && (
          <div className="absolute inset-3 flex flex-col items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm">
            {status === "over" && (
              <p className="mb-1 font-display text-xl font-bold text-ink">
                {az ? "Oyun bitdi" : "Game over"} · {score}
              </p>
            )}
            <p className="font-mono text-sm text-primary">
              {status === "over"
                ? (az ? "Yenidən üçün klik / Space" : "Click / Space to retry")
                : (az ? "Klik və ya Space ilə başla" : "Click or press Space to start")}
            </p>
            <p className="mt-2 font-mono text-xs text-muted">{az ? "Rekord" : "Best"}: {high}</p>
          </div>
        )}
      </div>
    </section>
  );
}
