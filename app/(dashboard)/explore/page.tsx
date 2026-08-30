"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Loader2,
  MapPin,
  Search,
  Utensils,
  Landmark,
} from "lucide-react";

import { Input } from "@/components/ui/input";

type PlaceType = "restaurants" | "hotels" | "attractions";

type Place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
};

type LocationData = {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
};

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

async function fetchPlaces(
  type: PlaceType,
  latitude: number,
  longitude: number,
  setPlaces: (places: Place[]) => void,
  setLoadingPlaces: (loading: boolean) => void,
  setError: (error: string) => void,
) {
  try {
    setLoadingPlaces(true);
    setError("");

    const response = await fetch(
      `/api/places/${type}?latitude=${latitude}&longitude=${longitude}`,
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || `Unable to load ${type}.`,
      );
    }

    setPlaces(result.data);
  } catch (err) {
    console.error(`${type} fetch failed:`, err);
    setPlaces([]);
    setError(
      err instanceof Error
        ? err.message
        : `Unable to load ${type}.`,
    );
  } finally {
    setLoadingPlaces(false);
  }
}

export default function ExplorePage() {
  const [destination, setDestination] =
    useState("Paris");

  const [searchInput, setSearchInput] =
    useState("Paris");

  const [location, setLocation] =
    useState<LocationData | null>(null);

  const [activeType, setActiveType] =
    useState<PlaceType>("attractions");

  const [places, setPlaces] =
    useState<Place[]>([]);

  const [loadingLocation, setLoadingLocation] =
    useState(false);

  const [loadingPlaces, setLoadingPlaces] =
    useState(false);

  const [error, setError] = useState("");

  const searchDestination = async (
    value: string,
  ) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setError("Enter a destination.");
      return;
    }

    try {
      setLoadingLocation(true);
      setError("");
      setPlaces([]);

      const response = await fetch(
        `/api/weather?destination=${encodeURIComponent(
          trimmed,
        )}`,
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to find this destination.",
        );
      }

      setLocation({
        location: {
          name: result.data.location.name,
          country:
            result.data.location.country,
          latitude:
            result.data.location.latitude,
          longitude:
            result.data.location.longitude,
        },
      });

      setDestination(trimmed);

      await fetchPlaces(
        activeType,
        result.data.location.latitude,
        result.data.location.longitude,
        setPlaces,
        setLoadingPlaces,
        setError,
      );
    } catch (err) {
      console.error(
        "Destination search failed:",
        err,
      );

      setLocation(null);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to find this destination.",
      );
    } finally {
      setLoadingLocation(false);
    }
  };


  useEffect(() => {
    const loadInitialDestination =
      async () => {
        await searchDestination("Paris");
      };

    loadInitialDestination();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!location) return;

    fetchPlaces(
      activeType,
      location.location.latitude,
      location.location.longitude,
      setPlaces,
      setLoadingPlaces,
      setError,
    );
  }, [activeType, location]);


  const handleSearch = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    await searchDestination(searchInput);
  };

  return (
    <main className="min-h-dvh px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-10">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground rounded-lg px-2 py-1 -ml-2"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Discover
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Explore destinations
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            Discover restaurants, hotels, and attractions
            around the places you want to visit.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mt-6 max-w-3xl"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={searchInput}
              onChange={(e) =>
                setSearchInput(e.target.value)
              }
              placeholder="Search a destination..."
              className="h-11 rounded-xl pl-11 pr-24"
            />

            <button
              type="submit"
              disabled={loadingLocation}
              className="absolute right-1.5 top-1/2 inline-flex h-11 -translate-y-1/2 items-center gap-2 rounded-xl bg-foreground px-4 text-xs font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingLocation ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>

        {/* Destination */}
        {location && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <MapPin className="size-5" />
            </div>

            <div>
              <p className="font-semibold">
                {location.location.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {location.location.country}
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-5 max-w-3xl rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mt-8 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active =
                activeType === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() =>
                    setActiveType(tab.value)
                  }
                  className={[
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">
              {tabs.find(
                (tab) =>
                  tab.value === activeType,
              )?.label ?? "Places"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {location
                ? `Around ${location.location.name}`
                : `Explore ${destination}`}
            </p>
          </div>

          {loadingLocation || loadingPlaces ? (
            <div className="flex min-h-48 items-center justify-center rounded-3xl border border-border/60 bg-muted/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Finding places...
              </div>
            </div>
          ) : places.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/10 p-6 text-center">
              <div>
                <MapPin className="mx-auto size-8 text-muted-foreground" />

                <p className="mt-3 font-medium">
                  No places found
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try another destination or category.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {places.map((place) => (
                <article
                  key={place.id}
                  className="group rounded-3xl border border-border/60 bg-background/90 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted">
                      <MapPin className="size-5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 font-semibold">
                        {place.name}
                      </h3>

                      <p className="mt-1 text-xs capitalize text-muted-foreground">
                        {place.category
                          .split(".")
                          .pop()
                          ?.replaceAll(
                            "_",
                            " ",
                          ) ?? "Place"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" />

                    <p className="line-clamp-2">
                      {place.address}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <span className="text-xs text-muted-foreground">
                      {place.latitude.toFixed(4)},{" "}
                      {place.longitude.toFixed(4)}
                    </span>

                    <span className="text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
                      View place
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}