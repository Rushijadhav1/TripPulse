"use client";

import { MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DestinationMap } from "@/components/maps/destination-map";

type TripMapProps = {
  latitude: number | null;
  longitude: number | null;
  locationName: string;
};

export function TripMap({
  latitude,
  longitude,
  locationName,
}: TripMapProps) {
  const available =
    latitude !== null && longitude !== null;

  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Destination</CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Explore {locationName} on the map.
            </p>
          </div>

          <div className="flex size-10 items-center justify-center rounded-2xl bg-muted">
            <MapPin className="size-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {available ? (
          <DestinationMap
            latitude={latitude}
            longitude={longitude}
            locationName={locationName}
          />
        ) : (
          <div className="flex h-[250px] items-center justify-center rounded-2xl border text-sm text-muted-foreground sm:h-[300px] lg:h-[350px]">
            Map unavailable.
          </div>
        )}
      </CardContent>
    </Card>
  );
}