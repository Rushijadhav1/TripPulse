"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Particles } from "@/components/ui/particles";

export function AuroraBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR hydration mount detection
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? theme === "dark" : true;

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background">
      {/* Purple particles */}
      <Particles
        quantity={140}
        color={isDark ? "#8B5CF6" : "#1e1b4b"}
        speed={0.08}
        size={2.4}
        repel={120}
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
      />

      {/* Cyan particles */}
      <Particles
        quantity={55}
        color={isDark ? "#38BDF8" : "#0c4a6e"}
        speed={0.06}
        size={1.8}
        repel={100}
        className="pointer-events-none fixed inset-0 z-0 opacity-50"
      />

      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
      >
        <div className="absolute left-[10%] top-[10%] size-[420px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute right-[5%] top-[25%] size-[380px] rounded-full bg-cyan-500/8 blur-[140px]" />
        <div className="absolute bottom-[5%] left-[35%] size-[420px] rounded-full bg-blue-600/8 blur-[160px]" />
      </div>

      {/* App */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
