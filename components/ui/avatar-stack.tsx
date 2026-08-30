"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AvatarStackItem {
  name: string;
  src?: string;
}

interface AvatarStackProps {
  avatars: AvatarStackItem[];
  max?: number;
  size?: number;
  overlap?: number;
  ring?: boolean;
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";

  const first = parts[0]?.charAt(0) ?? "";
  const last =
    parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? "") : "";
  return (first + last).toUpperCase();
}

export function AvatarStack({
  avatars,
  max = 5,
  size = 40,
  overlap = 12,
  ring = true,
  className = "",
}: AvatarStackProps) {
  const prefersReducedMotion = useReducedMotion();

  const visible = avatars.slice(0, Math.max(0, Math.floor(max)));
  const overflow = avatars.length - visible.length;

  const disc = {
    width: size,
    height: size,
    fontSize: Math.max(10, Math.round(size * 0.32)),
  };

  return (
    <div className={cn("flex items-center", className)}>
      {visible.map((avatar, index) => (
        <motion.div
          key={`${avatar.name}-${index}`}
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground select-none hover:z-10",
            ring && "ring-2 ring-background",
          )}
          style={{ ...disc, marginLeft: index === 0 ? 0 : -overlap }}
          whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          {avatar.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar.src}
              alt={avatar.name}
              className="size-full object-cover"
            />
          ) : (
            <>
              <span aria-hidden="true">{initials(avatar.name)}</span>
              <span className="sr-only">{avatar.name}</span>
            </>
          )}
        </motion.div>
      ))}

      {overflow > 0 && (
        <div
          className={cn(
            "relative flex shrink-0 items-center justify-center rounded-full bg-foreground font-medium text-background select-none",
            ring && "ring-2 ring-background",
          )}
          style={{ ...disc, marginLeft: -overlap }}
        >
          <span aria-hidden="true">+{overflow}</span>
          <span className="sr-only">{overflow} more</span>
        </div>
      )}
    </div>
  );
}

export default AvatarStack;
