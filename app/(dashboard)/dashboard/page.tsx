"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Loader2,
  MapPin,
  Plane,
  Plus,
  Sparkles,
} from "lucide-react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { GenerateButton } from "@/components/ui/generate-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LightLines } from "@/components/ui/light-lines";

export default function DashboardPage() {
  const trips = useQuery(api.trips.getMyTrips);

  const loading = trips === undefined;

  const totalTrips = trips?.length ?? 0;

  const countries = trips
    ? new Set(
        trips
          .map((trip) => trip.country)
          .filter((country): country is string => Boolean(country)),
      ).size
    : 0;

  const totalDays =
    trips?.reduce((total, trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);

      const difference =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1;

      return total + Math.max(difference, 0);
    }, 0) ?? 0;

  const recentTrips = trips?.slice(0, 3) ?? [];

  return (
    <main className="min-h-dvh pb-24">
      <LightLines className="fixed inset-0 -z-10">
        <div />
      </LightLines>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Plane className="size-5" />
            </span>

            <span>VoyageAI</span>
          </Link>

          <Avatar className="size-9">
            <AvatarFallback>R</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Greeting */}
        <section>
          <p className="text-sm text-muted-foreground">Welcome back 👋</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Plan your next adventure
          </h1>

          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Create personalized travel plans with the help of VoyageAI.
          </p>
        </section>

        {/* Planner CTA */}
        <Card className="overflow-hidden border-primary/20">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>

                <div>
                  <Badge variant="secondary" className="mb-2">
                    AI Planner
                  </Badge>

                  <h2 className="text-lg font-semibold">Create a new trip</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Tell us where you want to go and we ll help plan it.
                  </p>
                </div>
              </div>

              <Link
                href="/planner"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto"
              >
                Start planning
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Trips</p>

              {loading ? (
                <Loader2 className="mt-2 size-5 animate-spin" />
              ) : (
                <p className="mt-1 text-2xl font-bold">{totalTrips}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Countries</p>

              {loading ? (
                <Loader2 className="mt-2 size-5 animate-spin" />
              ) : (
                <p className="mt-1 text-2xl font-bold">{countries}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Days planned</p>

              {loading ? (
                <Loader2 className="mt-2 size-5 animate-spin" />
              ) : (
                <p className="mt-1 text-2xl font-bold">{totalDays}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Saved</p>
              <p className="mt-1 text-2xl font-bold">0</p>
            </CardContent>
          </Card>
        </section>

        {/* Trips */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Your trips</h2>

              <p className="text-sm text-muted-foreground">
                Your latest adventures
              </p>
            </div>

            <Link
              href="/planner"
              className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
            >
              <Plus className="size-4" />
              New trip
            </Link>
          </div>

          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : recentTrips.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                  <MapPin className="size-6 text-muted-foreground" />
                </div>

                <h3 className="mt-4 font-semibold">No trips yet</h3>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Create your first trip and let VoyageAI build your
                  personalized itinerary.
                </p>

                <Link
                  href="/planner"
                  className="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Sparkles className="mr-2 size-4" />
                  Plan my first trip
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recentTrips.map((trip) => (
                <Card key={trip._id} className="overflow-hidden">
                  <div className="h-32 bg-linear-to-br from-primary/20 via-background to-primary/5" />

                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="line-clamp-1">
                          {trip.title}
                        </CardTitle>

                        <CardDescription className="mt-1 flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {trip.destination}
                        </CardDescription>
                      </div>

                      <Badge variant="secondary">{trip.status}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="size-4" />
                      <span>
                        {trip.startDate} → {trip.endDate}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>

                        <p className="font-semibold">
                          {trip.currency} {trip.budget.toLocaleString()}
                        </p>
                      </div>

                      <Link
                        href={`/trips/${trip._id}`}
                        className="inline-flex items-center rounded-md border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
                      >
                        View trip
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Separator />

        {/* Quick actions */}
        <section>
  <h2 className="font-semibold">Quick actions</h2>

  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <Button
      variant="outline"
      className="h-16 w-full justify-start p-4"
    >
      <CalendarDays className="size-5" />
      <span className="ml-2">My trips</span>
    </Button>

    <Button
      variant="outline"
      className="h-16 w-full justify-start p-4"
    >
      <MapPin className="size-5" />
      <span className="ml-2">Explore destinations</span>
    </Button>

    <div className="flex h-16 w-full items-center">
  <GenerateButton
    type="button"
    text="Ask VoyageAI"
    hue={250}
    className="w-full"
  />
</div>
  </div>
</section>
      </div>

      {/* Mobile navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur md:hidden">
        <div className="grid h-16 grid-cols-4">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center gap-1 text-xs text-primary"
          >
            <Plane className="size-5" />
            Home
          </Link>

          <Link
            href="/planner"
            className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground"
          >
            <Sparkles className="size-5" />
            Planner
          </Link>

          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground"
          >
            <MapPin className="size-5" />
            Trips
          </Link>

          <Link
            href="/profile"
            className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground"
          >
            <Avatar className="size-5">
              <AvatarFallback className="text-[10px]">R</AvatarFallback>
            </Avatar>
            Profile
          </Link>
        </div>
      </nav>
    </main>
  );
}
