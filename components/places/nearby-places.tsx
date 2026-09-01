"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Compass,
  Landmark,
  Loader2,
  MapPin,
  TreePine,
  Utensils,
  Castle,
  Church,
} from "lucide-react";

type Place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
  distance: number;
  website?: string;
  phone?: string;
  openingHours?: string;
};

type NearbyPlacesProps = {
  latitude: number;
  longitude: number;
};

type PlaceType =
  | "all"
  | "attractions"
  | "temples"
  | "nature"
  | "historical"
  | "hotels"
  | "restaurants";

const tabs: {
  value: PlaceType;
  label: string;
  icon: typeof Utensils;
}[] = [
  { value: "all", label: "All", icon: Compass },
  {
    value: "attractions",
    label: "Attractions",
    icon: Landmark,
  },
  { value: "temples", label: "Temples", icon: Church },
  { value: "nature", label: "Nature", icon: TreePine },
  {
    value: "historical",
    label: "Historical",
    icon: Castle,
  },
  {
    value: "hotels",
    label: "Hotels",
    icon: Building2,
  },
  {
    value: "restaurants",
    label: "Restaurants",
    icon: Utensils,
  },
];

function getCategoryLabel(category: string): string {
  const labelMap: Record<string, string> = {
    "heritage.unesco": "UNESCO Heritage",
    "tourism.attraction": "Attraction",
    "tourism.sights": "Sight",
    "natural.mountain": "Mountain",
    "natural.water": "Water",
    "natural.forest": "Forest",
    "natural.protected_area": "Nature Reserve",
    national_park: "National Park",
    "leisure.park": "Park",
    "leisure.park.garden": "Garden",
    "leisure.park.nature_reserve": "Nature Reserve",
    "leisure.picnic": "Picnic Spot",
    "entertainment.museum": "Museum",
    "entertainment.culture": "Culture",
    "religion.place_of_worship": "Temple",
    "catering.restaurant": "Restaurant",
    "catering.cafe": "Cafe",
    "accommodation.hotel": "Hotel",
    "accommodation.guest_house": "Guest House",
  };

  if (labelMap[category]) return labelMap[category];

  // Fallback: extract last segment
  const parts = category.split(".");
  const last = parts[parts.length - 1];

  return last?.replaceAll("_", " ") ?? "Place";
}

function getDistanceLabel(meters: number): string {
  const km = meters / 1000;

  if (km < 1) return `${Math.round(meters)} m`;

  return `${km.toFixed(1)} km`;
}

export function NearbyPlaces({
  latitude,
  longitude,
}: NearbyPlacesProps) {
  const [activeType, setActiveType] =
    useState<PlaceType>("all");

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          latitude: String(latitude),
          longitude: String(longitude),
          category: activeType,
          limit: "12",
        });

        const response = await fetch(
          `/api/places?${params.toString()}`,
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
      } catch (err) {
        console.error(`${activeType} fetch failed:`, err);

        if (!cancelled) {
          setPlaces([]);
          setError(
            `Unable to load ${activeType} for this destination.`,
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
          Finding {activeType === "all" ? "places" : activeType}...
        </div>
      ) : error ? (
        <p className="py-6 text-sm text-destructive">
          {error}
        </p>
      ) : places.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">
          No popular places found for this destination.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {places.map((place) => (
            <div
              key={place.id}
              className="rounded-lg border p-4 transition-colors hover:bg-muted/30"
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

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                      {getCategoryLabel(place.category)}
                    </span>

                    {place.distance > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {getDistanceLabel(place.distance)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
