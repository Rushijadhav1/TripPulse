"use client";

import { useEffect, useMemo, useRef } from "react";
import Map, {
  Marker,
  NavigationControl,
  type MapRef,
} from "react-map-gl/maplibre";

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
  const mapRef = useRef<MapRef | null>(null);

  const apiKey =
    process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  const mapStyle = useMemo(() => {
    if (!apiKey) return undefined;

    return `https://maps.geoapify.com/v1/styles/dark-matter-dark-purple/style.json?apiKey=${apiKey}`;
  }, [apiKey]);

  const initialViewState = useMemo(
    () => ({
      latitude,
      longitude,
      zoom: 11,
      bearing: 0,
      pitch: 0,
    }),
    [latitude, longitude],
  );

  useEffect(() => {
    const map = mapRef.current?.getMap();

    if (!map) return;

    map.resize();
    map.flyTo({
      center: [longitude, latitude],
      zoom: 11,
      duration: 700,
      essential: true,
    });
  }, [latitude, longitude]);

  if (!apiKey || !mapStyle) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-4 text-center text-sm text-destructive sm:h-[320px] lg:h-[360px]">
        Geoapify map configuration is missing.
      </div>
    );
  }

  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-border/60 bg-muted sm:h-[320px] lg:h-[360px]">
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle={mapStyle}
        attributionControl={false}
        reuseMaps
        onLoad={() => {
          requestAnimationFrame(() => {
            mapRef.current?.getMap().resize();
          });
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <NavigationControl
          position="top-right"
          showCompass={false}
        />

        <Marker
          latitude={latitude}
          longitude={longitude}
          anchor="bottom"
        >
          <div className="group relative">
            <div
              className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-md"
              aria-hidden="true"
            />

            <div
              title={locationName}
              className="relative flex size-9 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-white shadow-xl shadow-violet-900/40"
            >
              <span className="size-2.5 rounded-full bg-white" />
            </div>
          </div>
        </Marker>
      </Map>

      <div className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-xl border border-white/10 bg-[#070A13]/80 px-3 py-2 text-xs text-white backdrop-blur-md">
        <p className="truncate font-medium">
          {locationName}
        </p>

        <p className="mt-0.5 text-white/60">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
      </div>
    </div>
  );
}