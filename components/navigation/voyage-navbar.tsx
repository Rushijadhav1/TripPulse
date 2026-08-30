"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Luggage, Sparkles } from "lucide-react";
import { useQuery } from "convex/react";

import { useAuthSession } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    label: "Ask",
    href: "/planner",
    icon: Sparkles,
  },
  {
    label: "My Trips",
    href: "/trips",
    icon: Luggage,
  },
  {
    label: "Profile",
    href: "/profile",
  },
];

export function VoyageNavbar() {
  const pathname = usePathname();
  const { data: session } = useAuthSession();
  const avatarUrl = useQuery(
    api.files.getProfileImage,
  );

  const initials =
    session?.user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "T";

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div
        className={cn(
          "flex w-full max-w-md items-center justify-between",
          "rounded-t-[22px] border border-b-0 border-border/60",
          "bg-background/90 backdrop-blur-xl",
          "shadow-[0_18px_50px_rgba(0,0,0,0.12)]",
          "px-1.5 py-1.5",
          "md:w-auto md:min-w-[430px] md:px-2.5 md:py-2",
        )}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isProfile = item.href === "/profile";

          return (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex flex-1 flex-col items-center justify-center",
                "rounded-xl px-1.5 py-1.5",
                "transition-all duration-300 ease-out",
                "focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* Active background */}
              <span
                className={cn(
                  "absolute inset-1 rounded-2xl transition-all duration-300",
                  active
                    ? "bg-muted opacity-100"
                    : "bg-transparent opacity-0 group-hover:bg-muted/60 group-hover:opacity-100",
                )}
              />

              {/* Icon */}
              <span
                className={cn(
                  "relative z-10 flex size-7 items-center justify-center",
                  "transition-transform duration-200 ease-out",
                  active
                    ? "scale-105"
                    : "group-hover:-translate-y-1 group-hover:scale-105",
                )}
              >
                {isProfile ? (
                  <Avatar className="size-5">
                    {avatarUrl && (
                      <AvatarImage
                        src={avatarUrl}
                        alt="Profile"
                      />
                    )}
                    <AvatarFallback
                      className={cn(
                        "text-[9px] font-bold",
                        active
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                ) : Icon ? (
                  <Icon
                    className={cn(
                      "size-4 transition-all duration-300",
                      active ? "stroke-[2.5]" : "stroke-[1.8]",
                    )}
                  />
                ) : null}
              </span>

              {/* Mobile label */}
              <span
                className={cn(
                  "relative z-10 mt-0.5 text-[10px] font-bold",
                  "md:hidden",
                  active ? "opacity-100" : "opacity-70 group-hover:opacity-100",
                )}
              >
                {item.label}
              </span>

              {/* Active indicator */}
              <span
                className={cn(
                  "absolute inset-1 rounded-2xl",
                  "transition-all duration-300 ease-out",
                  active ? "bg-muted opacity-100" : "bg-transparent opacity-0",
                  !active && "group-hover:bg-muted/70 group-hover:opacity-100",
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
