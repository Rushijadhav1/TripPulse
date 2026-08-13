"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, Minus, Plus, Sparkles } from "lucide-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const travelStyles = [
  "Adventure",
  "Culture",
  "Food",
  "Relaxation",
  "Nature",
  "Shopping",
];

export default function PlannerPage() {
  const router = useRouter();

  const createTrip = useMutation(api.trips.createTrip);
  const updateTripWithAI = useMutation(api.trips.updateTripWithAI);
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [travelStyle, setTravelStyle] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleTravelStyle = (style: string) => {
    setTravelStyle((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style],
    );
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    setLoading(false);
  }
};

  return (
    <main className="min-h-dvh bg-muted/30 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/dashboard" />}
            nativeButton={false}
            className="-ml-3"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Button>

          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Sparkles className="size-5" />
              <span className="text-sm font-medium">VoyageAI Planner</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Plan your next adventure
            </h1>

            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Tell us a little about your trip. We ll use this information to
              create your personalized itinerary.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trip details</CardTitle>
            <CardDescription>
              Start with the basics of your journey.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">Where are you going?</Label>

                <Input
                  id="destination"
                  placeholder="e.g. Paris"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">
                  Country
                  <span className="ml-1 text-muted-foreground">(optional)</span>
                </Label>

                <Input
                  id="country"
                  placeholder="e.g. France"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <Label>Travel dates</Label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="startDate"
                      className="text-xs text-muted-foreground"
                    >
                      Start date
                    </Label>

                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="endDate"
                      className="text-xs text-muted-foreground"
                    >
                      End date
                    </Label>

                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Travelers */}
              <div className="space-y-2">
                <Label>Travelers</Label>

                <div className="flex h-11 items-center justify-between rounded-md border px-3">
                  <span className="text-sm text-muted-foreground">
                    Number of travelers
                  </span>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={travelers <= 1}
                      onClick={() =>
                        setTravelers((value) => Math.max(1, value - 1))
                      }
                    >
                      <Minus className="size-4" />
                    </Button>

                    <span className="w-5 text-center font-medium">
                      {travelers}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={travelers >= 20}
                      onClick={() =>
                        setTravelers((value) => Math.min(20, value + 1))
                      }
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>

                <div className="flex gap-2">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="INR">INR ₹</option>
                    <option value="USD">USD $</option>
                    <option value="EUR">EUR €</option>
                    <option value="GBP">GBP £</option>
                  </select>

                  <Input
                    id="budget"
                    type="number"
                    min="1"
                    placeholder="100000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Travel style */}
              <div className="space-y-3">
                <div>
                  <Label>Travel style</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Choose everything that matches your trip.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {travelStyles.map((style) => {
                    const checked = travelStyle.includes(style);

                    return (
                      <label
                        key={style}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleTravelStyle(style)}
                        />

                        <span className="text-sm">{style}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button type="submit" disabled={loading} className="h-11 w-full">
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                     AI is planning your trip...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Create trip
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
