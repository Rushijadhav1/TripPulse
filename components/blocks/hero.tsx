"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Meteors } from "@/components/ui/meteors";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

interface HeroAction {
  label: string;
  href: string;
}

interface HeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  showMeteors?: boolean;
  className?: string;
}

export function Hero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  showMeteors = true,
  className = "",
}: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const rise = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-3xl bg-transparent px-6 py-16 sm:py-24",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(120deg,rgba(139,92,246,0.45),rgba(37,99,235,0.18),rgba(34,211,238,0.35),rgba(139,92,246,0.45))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-px rounded-[calc(1.5rem-1px)] bg-card/95"
      />

      {showMeteors ? (
        <Meteors count={16} color="#8B5CF6" trailLength={80} />
      ) : null}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        {eyebrow ? (
          <motion.p
            {...rise}
            transition={{ duration: 0.4 }}
            className="mb-5 rounded-full border border-border/70 bg-card/60 px-4 py-1.5 text-2xl font-medium text-muted-foreground backdrop-blur"
          >
            {eyebrow}
          </motion.p>
        ) : null}

        <motion.h1
          {...rise}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-4xl font-extrabold tracking-tighter text-balance sm:text-6xl"
        >
          {title}
        </motion.h1>

        {description ? (
          <motion.p
            {...rise}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-5 max-w-xl text-lg text-balance text-muted-foreground"
          >
            {description}
          </motion.p>
        ) : null}

        {primaryAction || secondaryAction ? (
          <motion.div
            {...rise}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
          >
            {primaryAction ? (
              <a href={primaryAction.href} className="w-full sm:w-auto">
                <ShimmerButton className="w-full sm:w-auto">
                  {primaryAction.label}
                </ShimmerButton>
              </a>
            ) : null}
            {secondaryAction ? (
              <a
                href={secondaryAction.href}
                className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card/60 px-6 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:bg-accent sm:w-auto"
              >
                {secondaryAction.label}
              </a>
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
