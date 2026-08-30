"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Globe2,
  Loader2,
  Minus,
  MapPin,
  Plus,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

import { useAuthSession } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const travelStyles = [
  "Adventure",
  "Culture",
  "Food",
  "Relaxation",
  "Nature",
  "Shopping",
];

const currencyOptions = [
  { value: "INR", label: "INR ₹" },
  { value: "USD", label: "USD $" },
  { value: "EUR", label: "EUR €" },
  { value: "GBP", label: "GBP £" },
];

const plannerFeatures = [
  "Personalized itinerary",
  "Smart budget breakdown",
  "Weather information",
  "Nearby places",
  "Packing checklist",
];

export default function PlannerForm() {
  const router = useRouter();

  const { data: session, isPending } =
    useAuthSession();

  const createTrip = useMutation(api.trips.createTrip);
  const updateTripWithAI = useMutation(
    api.trips.updateTripWithAI,
  );

  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [travelStyle, setTravelStyle] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleTravelStyle = (style: string) => {
    setTravelStyle((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style],
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError("");

    if (!destination.trim()) {
      setError("Please enter a destination.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select your travel dates.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    if (!budget || Number(budget) <= 0) {
      setError("Please enter a valid budget.");
      return;
    }

    if (travelStyle.length === 0) {
      setError("Choose at least one travel style.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create the initial trip
      const tripId = await createTrip({
        title: `${destination} Adventure`,
        destination: destination.trim(),
        country: country.trim() || undefined,
        startDate,
        endDate,
        travelers,
        budget: Number(budget),
        currency,
        travelStyle,
      });

      // 2. Ask Groq to generate the itinerary
      const response = await fetch("/api/ai/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: destination.trim(),
          country: country.trim() || undefined,
          startDate,
          endDate,
          travelers,
          budget: Number(budget),
          currency,
          travelStyle,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to generate itinerary.",
        );
      }

      // 3. Save the AI result into Convex
      await updateTripWithAI({
        tripId,
        summary: result.data.summary,
        itinerary: result.data.itinerary,
        budgetBreakdown: result.data.budgetBreakdown,
        packingList: result.data.packingList,
      });

      // 4. Open the trip
      router.push(`/trips/${tripId}`);
    } catch (err) {
      console.error("Trip generation failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your trip. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!session?.user) {
    router.push("/sign-in?callbackUrl=/planner");
    return null;
  }

  return (
    <main className="min-h-dvh overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-10">
        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/dashboard"
            className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>

          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1.5 text-xs font-medium">
              <Sparkles className="size-3.5" />
              TripPulse Planner
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Plan your next adventure.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Tell us a little about your trip and TripPulse
              will build a personalized itinerary for you.
            </p>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          {/* Form */}
          <Card className="overflow-hidden rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
            <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
                  <Sparkles className="size-5" />
                </div>

                <div>
                  <CardTitle className="text-xl sm:text-2xl">
                    Tell us about your trip
                  </CardTitle>

                  <CardDescription className="mt-1.5">
                    Start with the basics. You can explore
                    and regenerate everything later.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-5 py-6 sm:px-7 sm:py-7">
              <form
                onSubmit={handleSubmit}
                className="space-y-7"
              >
                {/* Destination */}
                <section className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Destination
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Where would you like to go?
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="destination">
                        Where are you going?
                      </Label>

                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          id="destination"
                          placeholder="e.g. Paris"
                          value={destination}
                          onChange={(e) =>
                            setDestination(e.target.value)
                          }
                          className="h-11 rounded-xl pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="country">
                        Country
                        <span className="ml-1 text-muted-foreground">
                          (optional)
                        </span>
                      </Label>

                      <div className="relative">
                        <Globe2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          id="country"
                          placeholder="e.g. France"
                          value={country}
                          onChange={(e) =>
                            setCountry(e.target.value)
                          }
                          className="h-11 rounded-xl pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Dates */}
                <section className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Travel dates
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      When does your adventure start and end?
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">
                        Start date
                      </Label>

                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) =>
                            setStartDate(e.target.value)
                          }
                          className="h-11 rounded-xl pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">
                        End date
                      </Label>

                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) =>
                            setEndDate(e.target.value)
                          }
                          className="h-11 rounded-xl pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Travelers */}
                <section className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Travelers
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      How many people are going?
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border bg-muted/20 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-background">
                        <Users className="size-4 text-muted-foreground" />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Number of travelers
                        </p>

                        <p className="text-xs text-muted-foreground">
                          1–20 people
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-11 rounded-xl"
                        disabled={travelers <= 1}
                        onClick={() =>
                          setTravelers((value) =>
                            Math.max(1, value - 1),
                          )
                        }
                      >
                        <Minus className="size-4" />
                      </Button>

                      <span className="w-6 text-center text-base font-semibold">
                        {travelers}
                      </span>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-11 rounded-xl"
                        disabled={travelers >= 20}
                        onClick={() =>
                          setTravelers((value) =>
                            Math.min(20, value + 1),
                          )
                        }
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Budget */}
                <section className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Budget
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Set your estimated total trip budget.
                    </p>
                  </div>

                  <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-2">
                    <div className="relative">
                      <Wallet className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                      <select
                        aria-label="Currency"
                        value={currency}
                        onChange={(e) =>
                          setCurrency(e.target.value)
                        }
                        className="h-11 w-full appearance-none rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                      >
                        {currencyOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      id="budget"
                      type="number"
                      min="1"
                      placeholder="100000"
                      value={budget}
                      onChange={(e) =>
                        setBudget(e.target.value)
                      }
                      className="h-11 rounded-xl"
                      required
                    />
                  </div>
                </section>

                {/* Travel style */}
                <section className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Travel style
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Choose everything that matches your trip.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {travelStyles.map((style) => {
                      const checked =
                        travelStyle.includes(style);

                      return (
                        <label
                          key={style}
                          className={[
                            "flex cursor-pointer items-center gap-2.5 rounded-xl border p-3.5",
                            "transition-all duration-200",
                            checked
                              ? "border-foreground bg-muted/70"
                              : "border-border/70 bg-background hover:bg-muted/40",
                          ].join(" ")}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() =>
                              toggleTravelStyle(style)
                            }
                          />

                          <span className="text-sm font-medium">
                            {style}
                          </span>

                          {checked && (
                            <Check className="ml-auto size-4" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </section>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <div className="border-t pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl text-sm font-semibold sm:text-base"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        AI is planning your trip...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Create my trip
                      </>
                    )}
                  </Button>

                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    TripPulse will generate your itinerary using
                    the details above.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Desktop info panel */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <Card className="overflow-hidden rounded-3xl border-border/60 bg-muted/30">
                <CardHeader>
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-foreground text-background">
                    <Sparkles className="size-5" />
                  </div>

                  <CardTitle className="mt-4">
                    What TripPulse creates
                  </CardTitle>

                  <CardDescription>
                    Everything you need for a smarter trip.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {plannerFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-xl border bg-background/70 p-3"
                    >
                      <div className="flex size-7 items-center justify-center rounded-full bg-muted">
                        <Check className="size-3.5" />
                      </div>

                      <span className="text-sm font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
                <CardContent className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Pro tip
                  </p>

                  <p className="mt-2 text-sm leading-6">
                    Add more than one travel style so the AI
                    can make your itinerary feel more personal.
                  </p>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}