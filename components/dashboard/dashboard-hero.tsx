"use client";

import { Hero } from "@/components/blocks/hero";

export function DashboardHero() {
  return (
    <Hero
      eyebrow="AI-powered travel planning"
      title={
        <>
          Plan your next{" "}
          <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">adventure.</span>
        </>
      }
      description="Create personalized itineraries, discover places, manage your budget, and get smarter travel recommendations with TripPulse."
      primaryAction={{
        label: "Start planning",
        href: "/planner",
      }}
      secondaryAction={{
        label: "Ask TripPulse",
        href: "/planner",
      }}
      showMeteors={true}
    />
  );
}
