"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { ShareTripButton } from "@/components/share/share-trip-button";
import { ExportTripButton } from "@/components/pdf/export-trip-button";

import type { Id } from "@/convex/_generated/dataModel";

type TripHeaderProps = {
  trip: {
    _id: Id<"trips">;
    title: string;
    destination: string;
    country?: string;
    startDate: string;
    endDate: string;
    travelers: number;
    budget: number;
    currency: string;
    status: string;
    isPublic?: boolean;
    summary: string;
    itinerary: {
      day: number;
      date: string;
      title: string;
      activities: {
        time: string;
        title: string;
        description: string;
        location?: string;
        estimatedCost: number;
        category: string;
      }[];
    }[];
    budgetBreakdown: {
      accommodation: number;
      food: number;
      transportation: number;
      activities: number;
      miscellaneous: number;
      total: number;
    };
    packingList: {
      item: string;
      category: string;
      essential: boolean;
      checked: boolean;
    }[];
  };
  onRegenerate: () => void;
  onDelete: () => void;
  regenerating: boolean;
};

export function TripHeader({
  trip,
  onRegenerate,
  onDelete,
  regenerating,
}: TripHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground rounded-lg px-2 py-1 -ml-2"
      >
        <ArrowLeft className="size-4" />
        Dashboard
      </Link>

      {/* Main header */}
      <Card className="overflow-hidden rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            {/* Title */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="capitalize"
                >
                  {trip.status}
                </Badge>

                {trip.isPublic && (
                  <Badge variant="outline">
                    Shared
                  </Badge>
                )}
              </div>

              <h1 className="mt-4 line-clamp-2 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {trip.title}
              </h1>

              <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground sm:text-base">
                <MapPin className="mt-0.5 size-4 shrink-0" />

                <span className="leading-6">
                  {trip.destination}
                  {trip.country
                    ? `, ${trip.country}`
                    : ""}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <ShareTripButton
                tripId={trip._id}
                isPublic={trip.isPublic ?? false}
              />

              <ExportTripButton trip={trip} />

              <Button
                variant="outline"
                size="default"
                type="button"
                onClick={onRegenerate}
                disabled={regenerating}
                className="rounded-xl w-full sm:w-auto"
              >
                {regenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  "Regenerate"
                )}
              </Button>

              <Button
                variant="destructive"
                size="default"
                type="button"
                onClick={onDelete}
                className="rounded-xl w-full sm:w-auto"
              >
                Delete
              </Button>
            </div>

            {/* Trip meta */}
            <div className="mt-6 grid gap-2 sm:grid-cols-3 sm:gap-3">
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-4" />
                  Dates
                </div>

                <p className="mt-2 text-sm font-semibold leading-6">
                  {trip.startDate} → {trip.endDate}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="size-4" />
                  Travelers
                </div>

                <p className="mt-2 text-sm font-semibold">
                  {trip.travelers}{" "}
                  {trip.travelers === 1
                    ? "traveler"
                    : "travelers"}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Wallet className="size-4" />
                  Budget
                </div>

                <p className="mt-2 text-sm font-semibold">
                  {trip.currency}{" "}
                  {trip.budget.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}