"use client";

import { useEffect, useState } from "react";
import { Building2, Loader2, MapPin, Utensils, Landmark } from "lucide-react";

type Place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
};

type NearbyPlacesProps = {
  latitude: number;
  longitude: number;
};

type PlaceType = "restaurants" | "hotels" | "attractions";

const tabs: {
  value: PlaceType;
  label: string;
  icon: typeof Utensils;
}[] = [
  {
    value: "restaurants",
    label: "Restaurants",
    icon: Utensils,
  },
  {
    value: "hotels",
    label: "Hotels",
    icon: Building2,
  },
  {
    value: "attractions",
    label: "Attractions",
    icon: Landmark,
  },
];

export function NearbyPlaces({
  latitude,
  longitude,
}: NearbyPlacesProps) {
  const [activeType, setActiveType] =
    useState<PlaceType>("restaurants");

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/places/${activeType}?latitude=${latitude}&longitude=${longitude}`,
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || `Unable to fetch ${activeType}.`,
          );
        }

        if (!cancelled) {
          setPlaces(result.data);
        }
      } catch (error) {
        console.error(`${activeType} fetch failed:`, error);

        if (!cancelled) {
          setPlaces([]);
          setError(
            `Unable to load nearby ${activeType}.`,
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPlaces();

    return () => {
      cancelled = true;
    };
  }, [activeType, latitude, longitude]);

  const getCategoryLabel = (category: string) => {
    const lastPart = category.split(".").pop();

    return (
      lastPart?.replaceAll("_", " ") ?? "place"
    );
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeType === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveType(tab.value)}
              className={[
                "inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted",
              ].join(" ")}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Finding nearby {activeType}...
        </div>
      ) : error ? (
        <p className="py-6 text-sm text-destructive">
          {error}
        </p>
      ) : places.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">
          No nearby {activeType} found.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {places.map((place) => (
            <div
              key={place.id}
              className="rounded-lg border p-4"
            >
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="size-4" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-medium">
                    {place.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {place.address}
                  </p>

                  <p className="mt-2 text-xs capitalize text-muted-foreground">
                    {getCategoryLabel(place.category)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}