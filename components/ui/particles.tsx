"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  /** How many particles to draw. */
  quantity?: number;
  /** Colour of the particles. Any CSS colour, or `currentColor`. */
  color?: string;
  /** How far they drift, as a fraction of the frame per second. */
  speed?: number;
  /** Largest particle radius, in pixels. */
  size?: number;
  /** Radius around the pointer that pushes particles away, in pixels. */
  repel?: number;
  className?: string;
}

interface Particle {
  nx: number;
  ny: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  ox: number;
  oy: number;
}

function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Particles({
  quantity = 60,
  color = "currentColor",
  speed = 0.03,
  size = 2,
  repel = 90,
  className = "",
}: ParticlesProps) {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  const liveRef = useRef({ color, speed, repel });

  useEffect(() => {
    liveRef.current = { color, speed, repel };
  }, [color, speed, repel]);

  /* eslint-disable react-hooks/set-state-in-effect -- SSR hydration mount detection */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!mounted) return;

    const random = createRandom(0x5eed);

    particlesRef.current = Array.from({ length: quantity }, () => ({
      nx: random(),
      ny: random(),
      vx: random() - 0.5,
      vy: random() - 0.5,
      radius: 0.35 * size + random() * 0.65 * size,
      alpha: 0.25 + random() * 0.55,
      ox: 0,
      oy: 0,
    }));
  }, [quantity, size, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const pointer = { x: -Infinity, y: -Infinity };
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (delta: number) => {
      const live = liveRef.current;
      context.clearRect(0, 0, width, height);

      const paint =
        live.color === "currentColor"
          ? getComputedStyle(canvas).color
          : live.color;

      for (const particle of particlesRef.current) {
        if (delta > 0) {
          particle.nx += particle.vx * live.speed * delta;
          particle.ny += particle.vy * live.speed * delta;

          if (particle.nx < 0) particle.nx += 1;
          if (particle.nx > 1) particle.nx -= 1;
          if (particle.ny < 0) particle.ny += 1;
          if (particle.ny > 1) particle.ny -= 1;
        }

        const x = particle.nx * width;
        const y = particle.ny * height;

        if (live.repel > 0 && delta > 0) {
          const toX = x - pointer.x;
          const toY = y - pointer.y;
          const distance = Math.hypot(toX, toY);

          if (distance < live.repel && distance > 0.01) {
            const push = (1 - distance / live.repel) * live.repel * 0.6;
            particle.ox += ((toX / distance) * push - particle.ox) * 0.2;
            particle.oy += ((toY / distance) * push - particle.oy) * 0.2;
          } else {
            particle.ox *= 0.92;
            particle.oy *= 0.92;
          }
        }

        context.globalAlpha = particle.alpha;
        context.fillStyle = paint;
        context.beginPath();
        context.arc(
          x + particle.ox,
          y + particle.oy,
          particle.radius,
          0,
          Math.PI * 2,
        );
        context.fill();
      }

      context.globalAlpha = 1;
    };

    resize();

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            resize();
            draw(0);
          });
    observer?.observe(canvas);

    if (prefersReducedMotion) {
      draw(0);
      return () => observer?.disconnect();
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };

    const handlePointerLeave = () => {
      pointer.x = -Infinity;
      pointer.y = -Infinity;
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    let frame = 0;
    let previous = 0;

    const tick = (time: number) => {
      const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      draw(delta);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [prefersReducedMotion, mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      suppressHydrationWarning
      className={cn("absolute inset-0 size-full", className)}
    />
  );
}
