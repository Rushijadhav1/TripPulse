import { WalletCards } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BudgetChart } from "@/components/budget/budget-chart";

type TripBudgetProps = {
  currency: string;
  budgetBreakdown: {
    accommodation: number;
    food: number;
    transportation: number;
    activities: number;
    miscellaneous: number;
    total: number;
  };
};

export function TripBudget({
  currency,
  budgetBreakdown,
}: TripBudgetProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
      <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-muted">
            <WalletCards className="size-5" />
          </div>

          <div>
            <CardTitle>Budget</CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Estimated spending for your trip.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6">
        <BudgetChart
          currency={currency}
          budgetBreakdown={budgetBreakdown}
        />
      </CardContent>
    </Card>
  );
}