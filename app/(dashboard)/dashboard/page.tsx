import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Plane,
  Plus,
  Sparkles,
} from "lucide-react";

import { isAuthenticated } from "@/lib/auth-server";
import { redirect } from "next/navigation";

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

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-dvh bg-muted/30 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Plane className="size-5" />
            </div>

            <span className="font-semibold">VoyageAI</span>
          </div>

          <Avatar className="size-9">
            <AvatarFallback>R</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Greeting */}
        <section>
          <p className="text-sm text-muted-foreground">
            Welcome back 👋
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Plan your next adventure
          </h1>

          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Tell VoyageAI where you want to go and let AI create your
            personalized travel plan.
          </p>
        </section>

        {/* AI Planner */}
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

                  <h2 className="text-lg font-semibold">
                    Create a new trip
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Get an itinerary, budget, activities and packing list.
                  </p>
                </div>
              </div>

              <Button className="w-full sm:w-auto">
                Start planning
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Trips</p>
              <p className="mt-1 text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Countries</p>
              <p className="mt-1 text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Saved</p>
              <p className="mt-1 text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Days planned</p>
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
                Your upcoming adventures
              </p>
            </div>

            <Button variant="outline" size="sm">
              <Plus className="size-4" />
              New trip
            </Button>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                <MapPin className="size-6 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">
                No trips yet
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Your adventures will appear here once you create your first
                trip.
              </p>

              <Button className="mt-5">
                <Sparkles className="size-4" />
                Plan my first trip
              </Button>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Quick actions */}
        <section>
          <h2 className="font-semibold">Quick actions</h2>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto justify-start p-4"
            >
              <CalendarDays className="size-5" />
              <span className="ml-2">Explore itinerary</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto justify-start p-4"
            >
              <MapPin className="size-5" />
              <span className="ml-2">Explore destinations</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto justify-start p-4"
            >
              <Sparkles className="size-5" />
              <span className="ml-2">Ask VoyageAI</span>
            </Button>
          </div>
        </section>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur md:hidden">
        <div className="grid h-16 grid-cols-4">
          <button className="flex flex-col items-center justify-center gap-1 text-xs text-primary">
            <Plane className="size-5" />
            Home
          </button>

          <button className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="size-5" />
            Planner
          </button>

          <button className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-5" />
            Trips
          </button>

          <button className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
            <Avatar className="size-5">
              <AvatarFallback className="text-[10px]">
                R
              </AvatarFallback>
            </Avatar>
            Profile
          </button>
        </div>
      </nav>
    </main>
  );
}