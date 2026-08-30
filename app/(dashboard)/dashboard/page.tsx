"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { Separator } from "@/components/ui/separator";

import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardTripCta } from "@/components/dashboard/dashboard-trip-cta";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentTrips } from "@/components/dashboard/recent-trips";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  const trips = useQuery(api.trips.getMyTrips);

  const loading = trips === undefined;

  const totalTrips = trips?.length ?? 0;

  const countries = trips
    ? new Set(
        trips
          .map((trip) => trip.country)
          .filter(
            (country): country is string =>
              Boolean(country),
          ),
      ).size
    : 0;

  const totalDays =
    trips?.reduce((total, trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);

      const difference =
        Math.ceil(
          (end.getTime() - start.getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1;

      return total + Math.max(difference, 0);
    }, 0) ?? 0;

  return (
    <main className="min-h-dvh overflow-x-hidden px-4 pb-28 pt-6 sm:px-6 sm:py-8 md:pb-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero */}
        <DashboardHero />

        {/* Create Trip */}
        <DashboardTripCta />

        {/* Stats */}
        <DashboardStats
          trips={totalTrips}
          countries={countries}
          daysPlanned={totalDays}
          saved={0}
          loading={loading}
        />

        {/* Recent Trips */}
        <RecentTrips
          trips={trips ?? []}
          loading={loading}
        />

        <Separator className="mt-8" />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </main>
  );
}