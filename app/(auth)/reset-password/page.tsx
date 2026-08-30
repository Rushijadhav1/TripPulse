"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Plane,
  Sparkles,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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


export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </main>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(
    () => searchParams.get("token"),
    [searchParams],
  );

  const initialError = useMemo(() => {
    if (token) return "";
    const errorFromUrl = searchParams.get("error");
    return errorFromUrl
      ? "This password reset link is invalid or has expired."
      : "Password reset token is missing.";
  }, [token, searchParams]);

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setError(
        "This password reset link is invalid or has expired.",
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await authClient.resetPassword({
          newPassword,
          token,
        });

      if (error) {
        setError(
          "Unable to reset your password. Please request a new reset link.",
        );
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error(
        "Password reset failed:",
        error,
      );

      setError(
        "Unable to reset your password. Please request a new reset link.",
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
                {success ? (
                  <CheckCircle2 className="size-5 text-emerald-600" />
                ) : (
                  <LockKeyhole className="size-5" />
                )}
              </div>

              <CardTitle className="text-xl sm:text-2xl">
                {success
                  ? "Password updated"
                  : "Create a new password"}
              </CardTitle>

              <CardDescription className="mt-2 leading-6">
                {success
                  ? "Your password has been changed successfully."
                  : "Choose a new password for your TripPulse account."}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
              {success ? (
                <div className="text-center">
                  <p className="text-sm leading-6 text-muted-foreground">
                    You can now sign in with your new password.
                  </p>

                  <Button
                    type="button"
                    className="mt-6 h-12 w-full rounded-xl text-sm font-semibold"
                    onClick={() =>
                      router.push("/sign-in")
                    }
                  >
                    Go to sign in
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="new-password">
                      New password
                    </Label>

                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(
                          event.target.value,
                        )
                      }
                      autoComplete="new-password"
                      className="h-11 rounded-xl"
                      placeholder="At least 8 characters"
                      disabled={!token}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm password
                    </Label>

                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value,
                        )
                      }
                      autoComplete="new-password"
                      className="h-11 rounded-xl"
                      placeholder="Repeat your new password"
                      disabled={!token}
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
                    className="h-12 w-full rounded-xl text-sm font-semibold"
                    disabled={
                      loading || !token
                    }
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Update password
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