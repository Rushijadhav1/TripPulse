"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

type DestinationMapProps = {
  latitude: number;
  longitude: number;
  locationName: string;
};

function FlyToLocation({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([latitude, longitude], 11, {
      duration: 0.7,
    });
  }, [map, latitude, longitude]);

  return null;
}

const markerIcon = L.divIcon({
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  html: `
    <div class="group relative">
      <div class="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-md" aria-hidden="true"></div>
      <div class="relative flex size-9 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-white shadow-xl shadow-violet-900/40">
        <span class="size-2.5 rounded-full bg-white"></span>
      </div>
    </div>
  `,
});

export function DestinationMap({
  latitude,
  longitude,
  locationName,
}: DestinationMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-border/60 bg-muted sm:h-[320px] lg:h-[360px]">
      <MapContainer
        center={[latitude, longitude]}
        zoom={11}
        attributionControl={false}
        zoomControl={false}
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <Marker
          position={[latitude, longitude]}
          icon={markerIcon}
        />

        <FlyToLocation
          latitude={latitude}
          longitude={longitude}
        />

        <ZoomControl position="topright" />
      </MapContainer>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] max-w-[calc(100%-1.5rem)] rounded-xl border border-white/10 bg-[#070A13]/80 px-3 py-2 text-xs text-white backdrop-blur-md">
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
