"use client";

import {
  Cloud,
  Droplets,
  Gauge,
  Loader2,
  Thermometer,
  Wind,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type WeatherData = {
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
  }[];
};

type TripWeatherProps = {
  weather: WeatherData | null;
  loading: boolean;
  error: string;
  destination: string;
};

export function TripWeather({
  weather,
  loading,
  error,
  destination,
}: TripWeatherProps) {
  if (loading) {
    return (
      <Card className="rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading weather for {destination}...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="py-6 text-sm text-muted-foreground">
            {error || "Weather information is unavailable."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
      <CardHeader className="pb-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Weather</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Current conditions in {destination}
            </p>
          </div>

          <div className="flex size-10 items-center justify-center rounded-2xl bg-muted">
            <Cloud className="size-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {weather.current.temperature}°C
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Feels like{" "}
              {weather.current.apparentTemperature}°C
            </p>
          </div>

          <div className="rounded-2xl bg-muted/60 px-3 py-2 text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Rain
            </p>
            <p className="mt-0.5 text-sm font-semibold">
              {weather.current.precipitation} mm
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <WeatherMetric
            icon={Droplets}
            label="Humidity"
            value={`${weather.current.humidity}%`}
          />

          <WeatherMetric
            icon={Wind}
            label="Wind"
            value={`${weather.current.windSpeed} km/h`}
          />

          <WeatherMetric
            icon={Gauge}
            label="Rain"
            value={`${weather.current.precipitation} mm`}
          />
        </div>

        <Separator />

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Thermometer className="size-4 text-muted-foreground" />

            <h3 className="text-sm font-semibold">
              Forecast
            </h3>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {weather.daily.slice(0, 7).map((day) => (
              <div
                key={day.date}
                className="min-w-[92px] rounded-2xl border bg-muted/20 p-3"
              >
                <p className="text-xs font-medium">
                  {new Date(day.date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                    },
                  )}
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  {new Date(day.date).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </p>

                <p className="mt-3 text-sm font-semibold">
                  {day.temperatureMax}° /{" "}
                  {day.temperatureMin}°
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  Rain{" "}
                  {day.precipitationProbability ?? "--"}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeatherMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Droplets;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-3">
      <Icon className="size-4 text-muted-foreground" />

      <p className="mt-2 text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}