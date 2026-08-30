"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Check, Loader2, Package } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { Checkbox } from "@/components/ui/checkbox";

type PackingItem = {
  item: string;
  category: string;
  essential: boolean;
  checked: boolean;
};

type TripPackingProps = {
  tripId: Id<"trips">;
  items: PackingItem[];
};

export function TripPacking({ tripId, items }: TripPackingProps) {
  const toggleItem = useMutation(api.trips.togglePackingItem);

  const [togglingIndex, setTogglingIndex] = useState<number | null>(null);

  const grouped = items.reduce<Record<string, PackingItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  const handleToggle = async (index: number, checked: boolean) => {
    try {
      setTogglingIndex(index);
      await toggleItem({ tripId, index, checked: !checked });
    } catch (error) {
      console.error("Failed to toggle packing item:", error);
      toast.error("Failed to update packing item.");
    } finally {
      setTogglingIndex(null);
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-background/90 shadow-sm backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
          <Package className="size-4" />
        </div>

        <div>
          <h3 className="text-sm font-semibold sm:text-base">
            Packing List
          </h3>

          <p className="text-xs text-muted-foreground">
            {items.filter((i) => i.checked).length}/{items.length} packed
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category}>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {category}
            </p>

            <ul className="space-y-1">
              {categoryItems.map((item) => {
                const globalIndex = items.indexOf(item);

                return (
                  <li
                    key={globalIndex}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-muted/40"
                  >
                    <Checkbox
                      checked={item.checked}
                      disabled={togglingIndex === globalIndex}
                      onCheckedChange={() =>
                        handleToggle(globalIndex, item.checked)
                      }
                    />

                    {togglingIndex === globalIndex ? (
                      <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                    ) : item.essential ? (
                      <Check className="size-3.5 text-primary" />
                    ) : null}

                    <span
                      className={`text-sm ${
                        item.checked ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      {item.item}
                    </span>

                    {item.essential && (
                      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Essential
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
