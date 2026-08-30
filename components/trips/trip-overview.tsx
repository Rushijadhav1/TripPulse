import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type TripOverviewProps = {
  summary: string;
};

export function TripOverview({
  summary,
}: TripOverviewProps) {
  return (
    <Card className="rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
      <CardContent className="p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted">
            <Sparkles className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              AI overview
            </p>

            <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
              {summary ||
                "Your AI-generated trip summary will appear here."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}