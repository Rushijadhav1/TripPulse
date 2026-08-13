"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TripDetailsProps = {
  tripId: string;
};

export default function TripDetails({ tripId }: TripDetailsProps) {
  const [regenerating, setRegenerating] = useState(false);

  const tripIdTyped = tripId as Id<"trips">;

  const trip = useQuery(api.trips.getTrip, {
    tripId: tripIdTyped,
  });

  const deleteTrip = useMutation(api.trips.deleteTrip);

  const updateTripWithAI = useMutation(
    api.trips.updateTripWithAI,
  );

  const handleDeleteTrip = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      await deleteTrip({
        tripId: tripIdTyped,
      });

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  const handleRegenerate = async () => {
    if (!trip) return;

    try {
      setRegenerating(true);

      const response = await fetch("/api/ai/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: trip.destination,
          country: trip.country,
          startDate: trip.startDate,
          endDate: trip.endDate,
          travelers: trip.travelers,
          budget: trip.budget,
          currency: trip.currency,
          travelStyle: trip.travelStyle,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to regenerate itinerary.",
        );
      }

      await updateTripWithAI({
        tripId: trip._id,
        summary: result.data.summary,
        itinerary: result.data.itinerary,
        budgetBreakdown: result.data.budgetBreakdown,
        packingList: result.data.packingList,
      });
    } catch (error) {
      console.error("Failed to regenerate trip:", error);
    } finally {
      setRegenerating(false);
    }
  };

  if (trip === undefined) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </main>
    );
  }

  if (trip === null) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <MapPin className="size-10 text-muted-foreground" />

        <h1 className="text-2xl font-bold">Trip not found</h1>

        <p className="text-sm text-muted-foreground">
          This trip doesn't exist or is no longer available.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-muted/30 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {trip.title}
                </CardTitle>

                <CardDescription className="mt-2 flex items-center gap-1">
                  <MapPin className="size-4" />
                  {trip.destination}
                  {trip.country ? `, ${trip.country}` : ""}
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {trip.status}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                >
                  <RefreshCw
                    className={cn(
                      "size-4",
                      regenerating && "animate-spin",
                    )}
                  />

                  {regenerating
                    ? "Regenerating..."
                    : "Regenerate"}
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  onClick={handleDeleteTrip}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Dates
              </p>

              <p className="mt-1 font-medium">
                {trip.startDate} → {trip.endDate}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Travelers
              </p>

              <p className="mt-1 font-medium">
                {trip.travelers}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Budget
              </p>

              <p className="mt-1 font-medium">
                {trip.currency}{" "}
                {trip.budget.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Trip summary</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              {trip.summary ||
                "Your AI-generated trip summary will appear here."}
            </p>
          </CardContent>
        </Card>

        {/* Travel styles */}
        <Card>
          <CardHeader>
            <CardTitle>Travel style</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-2">
            {trip.travelStyle.map((style) => (
              <Badge key={style} variant="outline">
                {style}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* Itinerary */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">
              Itinerary
            </h2>

            <p className="text-sm text-muted-foreground">
              Your day-by-day travel plan.
            </p>
          </div>

          {trip.itinerary.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Your itinerary hasn't been generated yet.
              </CardContent>
            </Card>
          ) : (
            trip.itinerary.map((day) => (
              <Card key={`${day.day}-${day.date}`}>
                <CardHeader>
                  <CardTitle>
                    Day {day.day} · {day.title}
                  </CardTitle>

                  <CardDescription>
                    {day.date}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {day.activities.map((activity, index) => (
                    <div
                      key={`${activity.title}-${index}`}
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-medium">
                            {activity.title}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {activity.time} ·{" "}
                            {activity.location}
                          </p>
                        </div>

                        <p className="text-sm font-medium">
                          {trip.currency}{" "}
                          {activity.estimatedCost.toLocaleString()}
                        </p>
                      </div>

                      {index <
                        day.activities.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </section>

        {/* Budget */}
        <Card>
          <CardHeader>
            <CardTitle>Budget breakdown</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {[
              [
                "Accommodation",
                trip.budgetBreakdown.accommodation,
              ],
              ["Food", trip.budgetBreakdown.food],
              [
                "Transportation",
                trip.budgetBreakdown.transportation,
              ],
              [
                "Activities",
                trip.budgetBreakdown.activities,
              ],
              [
                "Miscellaneous",
                trip.budgetBreakdown.miscellaneous,
              ],
            ].map(([label, amount]) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {label}
                </span>

                <span className="font-medium">
                  {trip.currency}{" "}
                  {Number(amount).toLocaleString()}
                </span>
              </div>
            ))}

            <Separator />

            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>

              <span>
                {trip.currency}{" "}
                {trip.budgetBreakdown.total.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Packing */}
        <Card>
          <CardHeader>
            <CardTitle>Packing list</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {trip.packingList.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Your packing list hasn't been generated yet.
              </p>
            ) : (
              trip.packingList.map((item, index) => (
                <div
                  key={`${item.item}-${index}`}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.item}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </div>

                  {item.essential && (
                    <Badge variant="secondary">
                      Essential
                    </Badge>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}