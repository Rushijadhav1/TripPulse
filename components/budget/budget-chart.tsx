"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type BudgetChartProps = {
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

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
];

export function BudgetChart({
  currency,
  budgetBreakdown,
}: BudgetChartProps) {
  const data = [
    {
      name: "Accommodation",
      value: budgetBreakdown.accommodation,
    },
    {
      name: "Food",
      value: budgetBreakdown.food,
    },
    {
      name: "Transportation",
      value: budgetBreakdown.transportation,
    },
    {
      name: "Activities",
      value: budgetBreakdown.activities,
    },
    {
      name: "Miscellaneous",
      value: budgetBreakdown.miscellaneous,
    },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex h-[280px] w-full items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground">
          No budget data yet.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={75}
              outerRadius={105}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) =>
                `${currency} ${Number(value).toLocaleString()}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="size-3 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[index % COLORS.length],
                }}
              />

              <span className="text-sm">
                {item.name}
              </span>
            </div>

            <span className="text-sm font-medium">
              {currency}{" "}
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4 font-semibold">
        <span>Total</span>

        <span>
          {currency}{" "}
          {budgetBreakdown.total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}