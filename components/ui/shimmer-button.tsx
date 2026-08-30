"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type NativeButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  | "ref"
  | "style"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
>;

interface ShimmerButtonProps extends NativeButtonProps {
  children: ReactNode;
  shimmerColor?: string;
  shimmerWidth?: number;
  duration?: number;
  repeatDelay?: number;
  className?: string;
}

export function ShimmerButton({
  children,
  shimmerColor = "#ffffff",
  shimmerWidth = 40,
  duration = 1.4,
  repeatDelay = 1,
  className = "",
  ...props
}: ShimmerButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  const half = shimmerWidth / 2;
  const band = `linear-gradient(100deg, transparent ${Math.max(0, 50 - half)}%, ${shimmerColor} 50%, transparent ${Math.min(100, 50 + half)}%)`;

  return (
    <motion.button
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none ${className}`}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-full w-full opacity-60"
        style={{ backgroundImage: band }}
        animate={prefersReducedMotion ? undefined : { x: ["0%", "200%"] }}
        transition={{
          duration,
          repeat: Infinity,
          repeatDelay,
          ease: "easeInOut",
        }}
      />
      <span className="relative">{children}</span>
    </motion.button>
  );
}

export default ShimmerButton;
