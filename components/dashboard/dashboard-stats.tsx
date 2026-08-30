"use client";

import {
  CalendarDays,
  Globe2,
  Heart,
  Map,
} from "lucide-react";

import GlowingCard from "@/components/ui/glowing-card";

type DashboardStatsProps = {
  trips: number;
  countries: number;
  daysPlanned: number;
  saved: number;
  loading?: boolean;
};

const stats = [
  {
    key: "trips",
    label: "Trips",
    icon: Map,
  },
  {
    key: "countries",
    label: "Countries",
    icon: Globe2,
  },
  {
    key: "days",
    label: "Days planned",
    icon: CalendarDays,
  },
  {
    key: "saved",
    label: "Saved",
    icon: Heart,
  },
] as const;

export function DashboardStats({
  trips,
  countries,
  daysPlanned,
  saved,
  loading = false,
}: DashboardStatsProps) {
  const values = {
    trips,
    countries,
    days: daysPlanned,
    saved,
  };

  return (
    <section className="pt-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <GlowingCard key={stat.key} variant="subtle">
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-muted transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>

                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {stat.label}
                  </span>
                </div>

                {loading ? (
                  <div className="mt-4 h-7 w-16 animate-pulse rounded bg-muted sm:h-8" />
                ) : (
                  <p className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {values[stat.key]}
                  </p>
                )}

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.key === "trips" &&
                    "Adventures planned"}

                  {stat.key === "countries" &&
                    "Destinations explored"}

                  {stat.key === "days" &&
                    "Across your trips"}

                  {stat.key === "saved" &&
                    "Saved experiences"}
                </p>
              </div>
            </GlowingCard>
          );
        })}
      </div>
    </section>
  );
}