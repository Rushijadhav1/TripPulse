"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { ArrowRight, Loader2, Plane, Sparkles } from "lucide-react";
import { FlipWords } from "@/components/ui/flip-words";
import { useRouter, useSearchParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SignInPageContent />
    </Suspense>
  );
}

function SignInPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
    } catch {
      setError(
        "Unable to sign in. Please check your connection and try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[rgba(139,92,246,0.18)] bg-[#0D1220]/80 shadow-2xl backdrop-blur-xl">
      <div className="grid lg:grid-cols-2">
        {/* Brand panel — desktop only */}
        <section className="relative hidden overflow-hidden p-8 text-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
                <Plane className="size-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                TripPulse
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              AI-powered travel planning
            </div>

            <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">
              Your next{" "}
              <span className="text-[#8B5CF6]">
                <FlipWords
                  words={["adventure", "journey", "escape", "story", "destination"]}
                  interval={2.2}
                  duration={0.6}
                />
              </span>{" "}
              awaits you.
            </h1>

            <p className="mt-5 text-sm leading-7 text-muted-foreground xl:text-base">
              Build personalized itineraries, discover places,
              manage your budget, and travel smarter with TripPulse.
            </p>

            <div className="mt-8 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                AI itinerary
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Weather
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Places
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Budget
              </span>
            </div>
          </div>

          <p className="relative z-10 text-xs text-muted-foreground">
            Plan less. Experience more.
          </p>
        </section>

        {/* Sign in form */}
        <section className="flex items-center border-l border-white/10">
          <div className="w-full p-6 sm:p-8 lg:p-10">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Let&apos;s continue your journey.
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="h-12 rounded-xl border-white/10 bg-white/5 focus-visible:border-[#8B5CF6] focus-visible:ring-[#8B5CF6]/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="h-12 rounded-xl border-white/10 bg-white/5 focus-visible:border-[#8B5CF6] focus-visible:ring-[#8B5CF6]/20"
                    required
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-[#8B5CF6] text-sm font-semibold hover:bg-[#7C3AED]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
