"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  Plane,
  Sparkles,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

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


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSent(false);

    try {
      const { error } =
        await authClient.requestPasswordReset({
          email,
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (error) {
        setError(
          "Unable to send the reset email. Please try again.",
        );
        return;
      }

      setSent(true);
    } catch (error) {
      console.error(
        "Password reset request failed:",
        error,
      );

      setError(
        "Unable to send the reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-8 flex justify-center">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
                <Plane className="size-5" />
              </span>

              <span className="text-xl font-semibold">
                TripPulse
              </span>
            </Link>
          </div>

          <Card className="rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
            <CardHeader className="p-6 text-center sm:p-8">
              <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-2xl bg-muted">
                <Sparkles className="size-5" />
              </div>

              <CardTitle className="text-xl sm:text-2xl">
                Forgot your password?
              </CardTitle>

              <CardDescription className="mt-2 leading-6">
                Enter your email and we&apos;ll send you a secure
                password reset link.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
              {sent ? (
                <div className="text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle2 className="size-7 text-emerald-600" />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold">
                    Check your email
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    If an account exists for{" "}
                    <span className="font-medium text-foreground">
                      {email}
                    </span>
                    , we&apos;ve sent a password reset link.
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Check your spam or promotions folder if
                    you don&apos;t see it.
                  </p>

                  <Link
                    href="/sign-in"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    <ArrowLeft className="size-4" />
                    Back to sign in
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email address
                    </Label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        autoComplete="email"
                        className="h-11 rounded-xl pl-10"
                        required
                      />
                    </div>
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
                    className="h-12 w-full rounded-xl text-sm font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        Send reset link
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>

                  <Link
                    href="/sign-in"
                    className="inline-flex w-full items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="size-4" />
                    Back to sign in
                  </Link>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}