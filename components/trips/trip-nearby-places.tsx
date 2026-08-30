"use client";

import {
  Building2,
  Landmark,
  MapPin,
  Utensils,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NearbyPlaces } from "@/components/places/nearby-places";

type TripNearbyPlacesProps = {
  latitude: number | null;
  longitude: number | null;
  destination: string;
};

export function TripNearbyPlaces({
  latitude,
  longitude,
  destination,
}: TripNearbyPlacesProps) {
  const available =
    latitude !== null && longitude !== null;

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Discover
        </p>

        <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
          Nearby places
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Find places worth visiting around {destination}.
        </p>
      </div>

      {!available ? (
        <Card className="rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <CardContent className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            Nearby places are unavailable.
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
            <div className="grid grid-cols-3 gap-2">
              <PlaceType icon={Utensils} label="Food" />
              <PlaceType icon={Building2} label="Stay" />
              <PlaceType icon={Landmark} label="Explore" />
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6">
            <NearbyPlaces
              latitude={latitude}
              longitude={longitude}
            />
          </CardContent>
        </Card>
      )}
    </section>
  );
}

function PlaceType({
  icon: Icon,
  label,
}: {
  icon: typeof MapPin;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2.5 text-xs font-medium">
      <Icon className="size-3.5 text-muted-foreground" />
      {label}
    </div>
  );
}