"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

import { useAuthSession } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { TripHeader } from "@/components/trips/trip-header";
import { TripOverview } from "@/components/trips/trip-overview";
import { TripWeather } from "@/components/trips/trip-weather";
import { TripMap } from "@/components/trips/trip-map";
import { TripItinerary } from "@/components/trips/trip-itinerary";
import { TripNearbyPlaces } from "@/components/trips/trip-nearby-places";
import { TripTravelStyle } from "@/components/trips/trip-travel-style";
import { TripBudget } from "@/components/trips/trip-budget";
import { TripPacking } from "@/components/trips/trip-packing";

type TripDetailsProps = {
  tripId: string;
};

type WeatherData = {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };

  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    precipitation: number;
    weatherCode: number | null;
    windSpeed: number;
  };

  daily: {
    date: string;
    weatherCode: number | null;
    temperatureMax: number;
    temperatureMin: number;
    precipitationProbability: number | null;
    sunrise: string;
    sunset: string;
  }[];
};

export default function TripDetails({
  tripId,
}: TripDetailsProps) {
  const router = useRouter();

  const { data: session, isPending: sessionPending } =
    useAuthSession();

  const [regenerating, setRegenerating] =
    useState(false);

  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [weatherLoading, setWeatherLoading] =
    useState(true);

  const [weatherError, setWeatherError] =
    useState("");

  const tripIdTyped = tripId as Id<"trips">;

  const trip = useQuery(api.trips.getTrip, {
    tripId: tripIdTyped,
  });

  const deleteTrip = useMutation(
    api.trips.deleteTrip,
  );

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

      router.push("/dashboard");
    } catch (error) {
      console.error(
        "Failed to delete trip:",
        error,
      );
      toast.error("Failed to delete trip. Please try again.");
    }
  };

  const handleRegenerate = async () => {
    if (!trip) return;

    try {
      setRegenerating(true);

      const response = await fetch(
        "/api/ai/itinerary",
        {
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
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Failed to regenerate itinerary.",
        );
      }

      await updateTripWithAI({
        tripId: trip._id,
        summary: result.data.summary,
        itinerary: result.data.itinerary,
        budgetBreakdown:
          result.data.budgetBreakdown,
        packingList: result.data.packingList,
      });
    } catch (error) {
      console.error(
        "Failed to regenerate trip:",
        error,
      );
      toast.error("Failed to regenerate itinerary. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  useEffect(() => {
    if (!trip?.destination) return;

    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        setWeatherError("");

        const response = await fetch(
          `/api/weather?destination=${encodeURIComponent(
            trip.destination,
          )}`,
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Unable to fetch weather.",
          );
        }

        setWeather(result.data);
      } catch (error) {
        console.error(
          "Weather fetch failed:",
          error,
        );

        setWeather(null);
        setWeatherError(
          "Unable to load weather.",
        );
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [trip?.destination]);

  if (sessionPending) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!session?.user) {
    router.push("/sign-in?callbackUrl=/trips");
    return null;
  }

  if (trip === undefined) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (trip === null) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <MapPin className="size-10 text-muted-foreground" />

        <h1 className="text-2xl font-semibold">
          Trip unavailable
        </h1>

        <p className="max-w-md text-sm text-muted-foreground">
          This trip doesn&apos;t exist or you don&apos;t
          have permission to view it.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-dvh px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Trip Header */}
        <TripHeader
          trip={trip}
          onRegenerate={handleRegenerate}
          onDelete={handleDeleteTrip}
          regenerating={regenerating}
        />

        {/* AI Overview */}
        <TripOverview summary={trip.summary} />

        {/* Weather + Map */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TripWeather
            weather={weather}
            loading={weatherLoading}
            error={weatherError}
            destination={trip.destination}
          />

          <TripMap
            latitude={
              weather?.location.latitude ?? null
            }
            longitude={
              weather?.location.longitude ?? null
            }
            locationName={
              weather?.location.name ??
              trip.destination
            }
          />
        </div>

        {/* Nearby Places */}
        <TripNearbyPlaces
          latitude={
            weather?.location.latitude ?? null
          }
          longitude={
            weather?.location.longitude ?? null
          }
          destination={trip.destination}
        />

        {/* Travel Style */}
        <TripTravelStyle
          styles={trip.travelStyle}
        />

        {/* Itinerary */}
        <TripItinerary
          itinerary={trip.itinerary}
          currency={trip.currency}
        />

        {/* Budget + Packing */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TripBudget
            currency={trip.currency}
            budgetBreakdown={
              trip.budgetBreakdown
            }
          />

          <TripPacking
            tripId={trip._id}
            items={trip.packingList}
          />
        </div>
      </div>
    </main>
  );
}