"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type PackingItem = {
  item: string;
  category: string;
  essential: boolean;
  checked: boolean;
};

type PackingChecklistProps = {
  tripId: Id<"trips">;
  items: PackingItem[];
};

export function PackingChecklist({
  tripId,
  items,
}: PackingChecklistProps) {
  const togglePackingItem = useMutation(
    api.trips.togglePackingItem,
  );

  const [togglingIndex, setTogglingIndex] = useState<number | null>(null);

  const checkedCount = items.filter(
    (item) => item.checked,
  ).length;

  const handleToggle = async (
    index: number,
    checked: boolean,
  ) => {
    try {
      setTogglingIndex(index);
      await togglePackingItem({
        tripId,
        index,
        checked,
      });
    } catch (error) {
      console.error("Failed to update packing item:", error);
      toast.error("Failed to update packing item.");
    } finally {
      setTogglingIndex(null);
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Your packing list hasn&apos;t been generated yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {checkedCount} of {items.length} packed
        </p>

        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${
                (checkedCount / items.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
        {items.map((item, index) => {
          const isToggling = togglingIndex === index;

          return (
            <button
              key={`${item.item}-${index}`}
              type="button"
              onClick={() =>
                handleToggle(index, !item.checked)
              }
              disabled={isToggling}
              className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted disabled:opacity-60"
            >
              <span
                className={[
                  "flex size-5 shrink-0 items-center justify-center rounded-md border",
                  item.checked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background",
                ].join(" ")}
              >
                {isToggling ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : item.checked ? (
                  <Check className="size-3.5" />
                ) : null}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={[
                    "block text-sm font-medium",
                    item.checked &&
                      "text-muted-foreground line-through",
                  ].join(" ")}
                >
                  {item.item}
                </span>

                <span className="block text-xs capitalize text-muted-foreground">
                  {item.category}
                </span>
              </span>

              {item.essential && (
                <span className="shrink-0 text-xs font-medium text-primary">
                  Essential
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}