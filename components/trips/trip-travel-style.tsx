import { Badge } from "@/components/ui/badge";

type TripTravelStyleProps = {
  styles: string[];
};

export function TripTravelStyle({
  styles,
}: TripTravelStyleProps) {
  if (styles.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Preferences
        </p>

        <h2 className="mt-1 text-lg font-semibold tracking-tight">
          Travel style
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {styles.map((style) => (
          <Badge
            key={style}
            variant="outline"
            className="rounded-full px-3 py-1.5 text-xs"
          >
            {style}
          </Badge>
        ))}
      </div>
    </section>
  );
}