"use client";

import { useMemo } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

type DestinationMapProps = {
  latitude: number;
  longitude: number;
  locationName: string;
};

export function DestinationMap({
  latitude,
  longitude,
  locationName,
}: DestinationMapProps) {
  const initialViewState = useMemo(
    () => ({
      latitude,
      longitude,
      zoom: 11,
    }),
    [latitude, longitude],
  );

  return (
    <div className="h-[250px] w-full overflow-hidden rounded-xl border sm:h-[300px] lg:h-[350px]">
      <Map
        initialViewState={initialViewState}
        mapStyle="https://demotiles.maplibre.org/style.json"
        attributionControl={{}}
      >
        <Marker
          latitude={latitude}
          longitude={longitude}
          anchor="bottom"
        >
          <div
            title={locationName}
            className="flex size-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg"
          >
            📍
          </div>
        </Marker>
      </Map>
    </div>
  );
}