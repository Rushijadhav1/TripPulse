"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin } from "lucide-react";

type Restaurant = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
};

type RestaurantListProps = {
  latitude: number;
  longitude: number;
};

export function RestaurantList({
  latitude,
  longitude,
}: RestaurantListProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/places/restaurants?latitude=${latitude}&longitude=${longitude}`,
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Unable to fetch restaurants.",
          );
        }

        setRestaurants(result.data);
      } catch (error) {
        console.error(
          "Restaurant fetch failed:",
          error,
        );

        setError("Unable to load nearby restaurants.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Finding nearby restaurants...
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-6 text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (restaurants.length === 0) {
    return (
      <p className="py-6 text-sm text-muted-foreground">
        No nearby restaurants found.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          className="rounded-lg border p-3 sm:p-4"
        >
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0" />

            <div className="min-w-0">
              <h3 className="font-medium">
                {restaurant.name}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {restaurant.address}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {restaurant.category}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}