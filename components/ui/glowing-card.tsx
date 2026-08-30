"use client";

import React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

interface GlowingCardProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: "strong" | "subtle";
  children?: React.ReactNode;
}

const GlowingCard: React.FC<GlowingCardProps> = ({
  className = "",
  width = "100%",
  height = "auto",
  variant = "strong",
  children,
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top } =
      currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  /*
   * TripPulse resting glow:
   * subtle violet → blue → cyan
   */
  const RESTING = `
    linear-gradient(
      120deg,
      rgba(139, 92, 246, 0.32),
      rgba(37, 99, 235, 0.16),
      rgba(56, 189, 248, 0.24)
    )
  `;

  /*
   * Pointer spotlight:
   * keeps the glow soft and premium rather than neon.
   */
  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `
      radial-gradient(
        180px circle at ${x}px ${y}px,
        rgba(139, 92, 246, 0.24),
        rgba(56, 189, 248, 0.10) 35%,
        transparent 72%
      ),
      ${RESTING}
    `,
  );

  const surface = prefersReducedMotion
    ? RESTING
    : background;

  const isSubtle = variant === "subtle";

  return (
    <div
      className={cn(
        "w-full",
        className,
      )}
    >
      <motion.div
        className={cn(
          "relative w-full overflow-hidden rounded-[var(--radius)]",
          "transition-shadow duration-300",
          isSubtle
            ? "shadow-[0_0_0_1px_rgba(139,92,246,0.04)] hover:shadow-[0_0_20px_rgba(139,92,246,0.05)]"
            : "shadow-[0_0_0_1px_rgba(139,92,246,0.08)] hover:shadow-[0_0_30px_rgba(139,92,246,0.10)]",
        )}
        style={{
          width,
          height,
          background: surface,
        }}
        onMouseMove={
          prefersReducedMotion
            ? undefined
            : handleMouseMove
        }
        initial={{
          background: RESTING,
        }}
      >
        {/* Inner surface */}
        <motion.div
          className={cn(
            "relative m-px flex min-h-full flex-col",
            "rounded-[calc(var(--radius)-1px)]",
            "bg-card/95 text-card-foreground",
            "p-5 backdrop-blur-xl sm:p-6",
          )}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GlowingCard;
