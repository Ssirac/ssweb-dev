"use client";

// Particle text morph (adapted from KAINXU's 21st.dev component).
// Brand adaptations: transparent canvas with destination-out trails (no black
// box), colors cycle through the brand palette instead of random RGB, text is
// set in the site's display font, and the rAF loop pauses off-screen.

import { useEffect, useRef } from "react";

interface Vector2D {
  x: number;
  y: number;
}

// Brand palette, cycled per word (deterministic, no random rainbow).
const BRAND_COLORS = [
  { r: 69, g: 80, b: 245 }, // primary indigo
  { r: 110, g: 118, b: 255 }, // secondary periwinkle
  { r: 165, g: 172, b: 255 }, // light indigo
  { r: 231, g: 233, b: 255 }, // near-ink
];

class Particle {
  pos: Vector2D = { x: 0, y: 0 };
  vel: Vector2D = { x: 0, y: 0 };
  acc: Vector2D = { x: 0, y: 0 };
  target: Vector2D = { x: 0, y: 0 };

  closeEnoughTarget = 100;
  maxSpeed = 1.0;
  maxForce = 0.1;
  particleSize = 10;
  isKilled = false;

  startColor = { r: 0, g: 0, b: 0 };
  targetColor = { r: 0, g: 0, b: 0 };
  colorWeight = 0;
  colorBlendRate = 0.01;

  move() {
    let proximityMult = 1;
    const distance = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y);
    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = { x: this.target.x - this.pos.x, y: this.target.y - this.pos.y };
    const magnitude = Math.hypot(towardsTarget.x, towardsTarget.y);
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = { x: towardsTarget.x - this.vel.x, y: towardsTarget.y - this.vel.y };
    const steerMagnitude = Math.hypot(steer.x, steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }
    const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight);
    const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight);
    const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const randomPos = randomPosFrom(width / 2, height / 2, (width + height) / 2);
      this.target.x = randomPos.x;
      this.target.y = randomPos.y;
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;
      this.isKilled = true;
    }
  }
}

function randomPosFrom(x: number, y: number, mag: number): Vector2D {
  const direction = { x: Math.random() * 1000 - x, y: Math.random() * 500 - y };
  const magnitude = Math.hypot(direction.x, direction.y);
  if (magnitude > 0) {
    direction.x = (direction.x / magnitude) * mag;
    direction.y = (direction.y / magnitude) * mag;
  }
  return { x: x + direction.x, y: y + direction.y };
}

interface ParticleTextEffectProps {
  words: string[];
  className?: string;
}

export function ParticleTextEffect({ words, className }: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef(0);
  const wordIndexRef = useRef(0);
  const colorIndexRef = useRef(0);
  const runningRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false });

  const pixelSteps = 6;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 1000;
    canvas.height = 500;
    const ctx = canvas.getContext("2d")!;

    const displayFont =
      getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() ||
      "system-ui, sans-serif";

    const nextWord = (word: string) => {
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const offCtx = off.getContext("2d")!;

      offCtx.fillStyle = "white";
      offCtx.font = `bold 110px ${displayFont}`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(word, canvas.width / 2, canvas.height / 2);

      const pixels = offCtx.getImageData(0, 0, canvas.width, canvas.height).data;
      const newColor = BRAND_COLORS[colorIndexRef.current % BRAND_COLORS.length];
      colorIndexRef.current++;

      const particles = particlesRef.current;
      let particleIndex = 0;

      const coordsIndexes: number[] = [];
      for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
        coordsIndexes.push(i);
      }
      for (let i = coordsIndexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
      }

      for (const pixelIndex of coordsIndexes) {
        if (pixels[pixelIndex + 3] > 0) {
          const x = (pixelIndex / 4) % canvas.width;
          const y = Math.floor(pixelIndex / 4 / canvas.width);
          let particle: Particle;

          if (particleIndex < particles.length) {
            particle = particles[particleIndex];
            particle.isKilled = false;
            particleIndex++;
          } else {
            particle = new Particle();
            const randomPos = randomPosFrom(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2);
            particle.pos.x = randomPos.x;
            particle.pos.y = randomPos.y;
            particle.maxSpeed = Math.random() * 6 + 4;
            particle.maxForce = particle.maxSpeed * 0.05;
            particle.particleSize = Math.random() * 6 + 6;
            particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;
            particles.push(particle);
          }

          particle.startColor = {
            r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
            g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
            b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
          };
          particle.targetColor = newColor;
          particle.colorWeight = 0;
          particle.target.x = x;
          particle.target.y = y;
        }
      }

      for (let i = particleIndex; i < particles.length; i++) {
        particles[i].kill(canvas.width, canvas.height);
      }
    };

    const animate = () => {
      const particles = particlesRef.current;

      // Fade existing pixels toward transparent (motion-blur trails without
      // painting a solid background box).
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.move();
        particle.draw(ctx);
        if (
          particle.isKilled &&
          (particle.pos.x < 0 || particle.pos.x > canvas.width || particle.pos.y < 0 || particle.pos.y > canvas.height)
        ) {
          particles.splice(i, 1);
        }
      }

      // Right-click hold destroys nearby particles (small easter egg).
      if (mouseRef.current.isPressed && mouseRef.current.isRightClick) {
        for (const particle of particles) {
          if (Math.hypot(particle.pos.x - mouseRef.current.x, particle.pos.y - mouseRef.current.y) < 50) {
            particle.kill(canvas.width, canvas.height);
          }
        }
      }

      frameCountRef.current++;
      if (frameCountRef.current % 240 === 0) {
        wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
        nextWord(words[wordIndexRef.current]);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Pause the loop entirely while the canvas is off-screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !runningRef.current) {
        runningRef.current = true;
        animationRef.current = requestAnimationFrame(animate);
      } else if (!entry.isIntersecting && runningRef.current) {
        runningRef.current = false;
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      }
    });
    io.observe(canvas);

    nextWord(words[0]);

    const scaleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    };
    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true;
      mouseRef.current.isRightClick = e.button === 2;
      scaleMouse(e);
    };
    const handleMouseUp = () => {
      mouseRef.current.isPressed = false;
      mouseRef.current.isRightClick = false;
    };
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", scaleMouse);
    canvas.addEventListener("contextmenu", handleContextMenu);

    return () => {
      runningRef.current = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      io.disconnect();
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", scaleMouse);
      canvas.removeEventListener("contextmenu", handleContextMenu);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ maxWidth: "100%", height: "auto" }} />;
}
