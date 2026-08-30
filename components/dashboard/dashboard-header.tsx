"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane } from "lucide-react";
import { useQuery } from "convex/react";

import { useAuthSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardHeader() {
  const pathname = usePathname();
  const { data: session } = useAuthSession();
  const avatarUrl = useQuery(api.files.getProfileImage);

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
    <header className="relative z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/dashboard" className="group flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Plane className="size-5" />
          </span>

          <div className="leading-none">
            <p className="text-sm font-semibold tracking-tight sm:text-base">
              TripPulse
            </p>

            <p className="mt-1 hidden text-[10px] text-muted-foreground sm:block">
              Your AI travel companion
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Desktop navigation"
          className="hidden items-center gap-6 md:flex"
        >
          <Link
            href="/dashboard"
            className={cn(
              "relative text-sm transition-colors",
              isActive("/dashboard")
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Home
            {isActive("/dashboard") && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
            )}
          </Link>

          <Link
            href="/explore"
            className={cn(
              "relative text-sm transition-colors",
              isActive("/explore")
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Explore
            {isActive("/explore") && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
            )}
          </Link>

          <Link
            href="/planner"
            className={cn(
              "relative text-sm transition-colors",
              isActive("/planner")
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Ask TripPulse
            {isActive("/planner") && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
            )}
          </Link>

          <Link
            href="/trips"
            className={cn(
              "relative text-sm transition-colors",
              isActive("/trips")
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            My Trips
            {isActive("/trips") && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Profile */}
          <Link
            href="/profile"
            aria-label="Open profile"
            className="group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Avatar className="size-10 border transition-transform duration-200 group-hover:scale-105">
              {avatarUrl && (
                <AvatarImage
                  src={avatarUrl}
                  alt="Profile"
                />
              )}
              <AvatarFallback className="bg-muted text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
