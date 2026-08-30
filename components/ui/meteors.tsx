"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface MeteorsProps {
  count?: number;
  angle?: number;
  duration?: number;
  trailLength?: number;
  color?: string;
  className?: string;
}

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function Meteors({
  count = 20,
  angle = 20,
  duration = 3,
  trailLength = 90,
  color = "#ffffff",
  className = "",
}: MeteorsProps) {
  const prefersReducedMotion = useReducedMotion();

  const meteors = useMemo(
    () =>
      Array.from({ length: Math.max(0, Math.floor(count)) }, (_, index) => {
        const travel = duration * (0.75 + pseudoRandom(index + 211) * 0.5);
        return {
          left: pseudoRandom(index) * 100,
          delay: -pseudoRandom(index + 101) * travel,
          travel,
          scale: 0.6 + pseudoRandom(index + 307) * 0.8,
        };
      }),
    [count, duration],
  );

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute -inset-1/4"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        {meteors.map((meteor, index) => (
          <motion.span
            key={index}
            className="absolute inset-y-0"
            style={{ left: `${meteor.left}%` }}
            animate={prefersReducedMotion ? undefined : { y: ["-10%", "110%"] }}
            transition={{
              duration: meteor.travel,
              delay: meteor.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span
              className="relative block w-px"
              style={{ height: `${trailLength * meteor.scale}px` }}
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundImage: `linear-gradient(to bottom, transparent, ${color})`,
                }}
              />
              <span
                className="absolute bottom-0 left-1/2 size-[3px] -translate-x-1/2 translate-y-1/2 rounded-full"
                style={{ background: color, boxShadow: `0 0 8px 1px ${color}` }}
              />
            </span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}
