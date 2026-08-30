"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  Loader2,
  LogOut,
  Mail,
  Moon,
  Pencil,
  Save,
  Sun,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { authClient, useAuthSession } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
import { ThemeToggle } from "@/components/ui/theme-toggle";


export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(
    api.files.generateUploadUrl,
  );
  const setProfileImage = useMutation(
    api.files.setProfileImage,
  );

  const { data: session, isPending } =
    useAuthSession();

  const avatarUrl = useQuery(
    api.files.getProfileImage,
  );

  const [editingName, setEditingName] =
    useState(false);

  const [name, setName] = useState("");

  const [savingName, setSavingName] =
    useState(false);

  const [nameMessage, setNameMessage] =
    useState("");

  const [nameError, setNameError] =
    useState("");

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [signingOut, setSigningOut] =
    useState(false);

  const handleStartEditingName = () => {
    setName(session?.user.name ?? "");
    setNameMessage("");
    setNameError("");
    setEditingName(true);
  };

  const handleCancelEditingName = () => {
    setName(session?.user.name ?? "");
    setNameMessage("");
    setNameError("");
    setEditingName(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      toast.error("Image must be 5MB or less.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image.");
      return;
    }

    try {
      setUploadingImage(true);

      const uploadUrl = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("File upload failed.");
      }

      const { storageId } = await result.json();

      await setProfileImage({
        storageId: storageId as string,
      });

      await authClient.updateUser({
        image: storageId as string,
      });

      await authClient.getSession();
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar. Please try again.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveName = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError("Name cannot be empty.");
      return;
    }

    if (trimmedName.length > 100) {
      setNameError("Name must be 100 characters or less.");
      return;
    }

    try {
      setSavingName(true);
      setNameMessage("");
      setNameError("");

      const { error } =
        await authClient.updateUser({
          name: trimmedName,
        });

      if (error) {
        setNameError(
          "Unable to update your name. Please try again.",
        );
        return;
      }

      setNameMessage("Name updated successfully.");
      setEditingName(false);

      // Refresh the session so the new name appears everywhere.
      await authClient.getSession();
    } catch (error) {
      console.error(
        "Failed to update name:",
        error,
      );

      setNameError(
        "Unable to update your name.",
      );
    } finally {
      setSavingName(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);

      const { error } =
        await authClient.signOut();

      if (error) {
        console.error(
          "Failed to sign out:",
          error,
        );
        toast.error("Failed to sign out. Please try again.");
        return;
      }

      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error(
        "Failed to sign out:",
        error,
      );
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold">
            You&apos;re not signed in
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to view your profile.
          </p>

          <Link
            href="/sign-in"
            className="mt-5 inline-flex items-center rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const displayName =
    session.user.name?.trim() || "Traveler";

  const email =
    session.user.email || "No email available";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part[0]?.toUpperCase(),
      )
      .join("") || "T";

  return (
    <main className="min-h-dvh px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground rounded-lg px-2 py-1 -ml-2"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        {/* Page heading */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Manage your TripPulse account.
          </p>
        </div>

        {/* Profile */}
        <Card className="overflow-hidden rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
          <CardHeader className="border-b bg-muted/20 p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={uploadingImage}
                  className="group relative block cursor-pointer"
                >
                  <Avatar className="size-20 border-4 border-background shadow-sm">
                    {avatarUrl && (
                      <AvatarImage
                        src={avatarUrl}
                        alt={displayName}
                      />
                    )}
                    <AvatarFallback className="bg-foreground text-xl font-semibold text-background">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    {uploadingImage ? (
                      <Loader2 className="size-5 animate-spin text-white" />
                    ) : (
                      <Camera className="size-5 text-white" />
                    )}
                  </span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div className="min-w-0">
                <CardTitle className="text-2xl">
                  {displayName}
                </CardTitle>

                <CardDescription className="mt-1 flex items-center gap-2">
                  <Mail className="size-3.5" />
                  {email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-7 p-5 sm:p-7">
            {/* Name */}
            <section>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold">
                    Personal information
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Update the name shown across TripPulse.
                  </p>
                </div>

                {!editingName && (
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={handleStartEditingName}
                    className="rounded-xl"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="mt-4 rounded-2xl border bg-muted/20 p-4">
                {editingName ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">
                        Name
                      </Label>

                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(event) =>
                          setName(event.target.value)
                        }
                        autoFocus
                        className="h-11 rounded-xl"
                      />
                    </div>

                    {nameError && (
                      <div
                        role="alert"
                        className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
                      >
                        {nameError}
                      </div>
                    )}

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        type="button"
                        onClick={handleSaveName}
                        disabled={savingName}
                      >
                        {savingName ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="size-4" />
                            Save changes
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEditingName}
                        disabled={savingName}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-background">
                      <UserRound className="size-4" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Name
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {displayName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {nameMessage && (
                <p className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                  <Check className="size-4" />
                  {nameMessage}
                </p>
              )}
            </section>

            

            {/* Email */}
            <section>
              <div>
                <h2 className="text-sm font-semibold">
                  Email address
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your email is used for sign-in and
                  notifications.
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border bg-muted/20 p-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-background">
                  <Mail className="size-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Current email
                  </p>

                  <p className="mt-1 truncate text-sm font-medium">
                    {email}
                  </p>
                </div>
              </div>
            </section>

            {/* Appearance */}
            <section>
              <div>
                <h2 className="text-sm font-semibold">
                  Appearance
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Switch between light and dark mode.
                </p>
              </div>

              <div className="mt-4 rounded-2xl border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-background">
                      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Theme
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        Dark / Light
                      </p>
                    </div>
                  </div>

                  <ThemeToggle />
                </div>
              </div>
            </section>

            {/* Sign out */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Sign out
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Sign out from your TripPulse account on this
                  device.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={signingOut}
                onClick={handleSignOut}
                className="rounded-xl w-full sm:w-auto"
              >
                {signingOut ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut className="size-4" />
                    Sign out
                  </>
                )}
              </Button>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}