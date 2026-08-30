"use client";

import { useState } from "react";
import { Check, Copy, Loader2, Share2 } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";

type ShareTripButtonProps = {
  tripId: Id<"trips">;
  isPublic?: boolean;
};

export function ShareTripButton({
  tripId,
  isPublic,
}: ShareTripButtonProps) {
  const shareTrip = useMutation(api.trips.shareTrip);
  const unshareTrip = useMutation(api.trips.unshareTrip);

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    try {
      setLoading(true);

      const token = await shareTrip({
        tripId,
      });

      const shareUrl = `${window.location.origin}/share/${token}`;

      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to share trip:", error);
      toast.error("Failed to share trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnshare = async () => {
    try {
      setLoading(true);

      await unshareTrip({
        tripId,
      });
    } catch (error) {
      console.error("Failed to unshare trip:", error);
      toast.error("Failed to stop sharing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="default"
      type="button"
      onClick={
        isPublic ? handleUnshare : handleShare
      }
      disabled={loading}
      className="rounded-xl"
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {isPublic ? "Stopping..." : "Sharing..."}
        </>
      ) : copied ? (
        <>
          <Check className="size-4" />
          Link copied
        </>
      ) : isPublic ? (
        <>
          <Share2 className="size-4" />
          Stop sharing
        </>
      ) : (
        <>
          <Copy className="size-4" />
          Share trip
        </>
      )}
    </Button>
  );
}