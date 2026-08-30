import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type TripPdfProps = {
  trip: {
    title: string;
    destination: string;
    country?: string;
    startDate: string;
    endDate: string;
    travelers: number;
    currency: string;
    summary: string;

    itinerary: {
      day: number;
      date: string;
      title: string;
      activities: {
        time: string;
        title: string;
        description: string;
        location?: string;
        estimatedCost: number;
        category: string;
      }[];
    }[];

    budgetBreakdown: {
      accommodation: number;
      food: number;
      transportation: number;
      activities: number;
      miscellaneous: number;
      total: number;
    };

    packingList: {
      item: string;
      category: string;
      essential: boolean;
      checked: boolean;
    }[];
  };
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#111827",
  },

  header: {
    marginBottom: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  brand: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 9,
    color: "#6b7280",
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
  },

  location: {
    fontSize: 11,
    color: "#4b5563",
    marginBottom: 4,
  },

  meta: {
    fontSize: 9,
    color: "#6b7280",
  },

  section: {
    marginTop: 22,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 9,
  },

  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#4b5563",
  },

  day: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
  },

  dayTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 3,
  },

  dayDate: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 10,
  },

  activity: {
    marginBottom: 9,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  activityTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 3,
  },

  activityDescription: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.4,
    marginBottom: 3,
  },

  activityMeta: {
    fontSize: 8,
    color: "#6b7280",
  },

  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  budgetLabel: {
    fontSize: 9,
    color: "#4b5563",
  },

  budgetValue: {
    fontSize: 9,
    fontWeight: 700,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },

  totalLabel: {
    fontSize: 11,
    fontWeight: 700,
  },

  totalValue: {
    fontSize: 11,
    fontWeight: 700,
  },

  packingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#9ca3af",
    marginRight: 8,
  },

  checkboxChecked: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  packingText: {
    fontSize: 9,
  },

  packingCategory: {
    fontSize: 8,
    color: "#6b7280",
    marginLeft: 5,
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#9ca3af",
  },
});

export function TripPdf({ trip }: TripPdfProps) {
  const itinerary = trip.itinerary ?? [];
  const packingList = trip.packingList ?? [];
  const budgetBreakdown = trip.budgetBreakdown ?? {
    accommodation: 0,
    food: 0,
    transportation: 0,
    activities: 0,
    miscellaneous: 0,
    total: 0,
  };

  return (
    <Document title={trip.title} author="TripPulse">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>TripPulse</Text>
          <Text style={styles.subtitle}>AI Travel Planner</Text>
        </View>

        <View>
          <Text style={styles.title}>{trip.title}</Text>

          <Text style={styles.location}>
            {trip.destination}
            {trip.country ? `, ${trip.country}` : ""}
          </Text>

          <Text style={styles.meta}>
            {trip.startDate} → {trip.endDate} ·{" "}
            {trip.travelers}{" "}
            {trip.travelers === 1 ? "traveler" : "travelers"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Trip Summary
          </Text>

          <Text style={styles.paragraph}>
            {trip.summary || "No trip summary available."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Itinerary
          </Text>

          {itinerary.length === 0 ? (
            <Text style={styles.paragraph}>
              No itinerary available.
            </Text>
          ) : (
            itinerary.map((day) => (
              <View
                key={`${day.day}-${day.date}`}
                style={styles.day}
                wrap={false}
              >
                <Text style={styles.dayTitle}>
                  Day {day.day} · {day.title}
                </Text>

                <Text style={styles.dayDate}>
                  {day.date}
                </Text>

                {(day.activities ?? []).map((activity, index) => (
                  <View
                    key={`${activity.title}-${index}`}
                    style={styles.activity}
                  >
                    <Text style={styles.activityTitle}>
                      {activity.title}
                    </Text>

                    <Text style={styles.activityDescription}>
                      {activity.description}
                    </Text>

                    <Text style={styles.activityMeta}>
                      {activity.time}{activity.location ? ` · ${activity.location} · ` : " · "}{trip.currency}{" "}
                      {activity.estimatedCost.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Budget Breakdown
          </Text>

          <BudgetRow
            label="Accommodation"
            value={budgetBreakdown.accommodation}
            currency={trip.currency}
          />

          <BudgetRow
            label="Food"
            value={budgetBreakdown.food}
            currency={trip.currency}
          />

          <BudgetRow
            label="Transportation"
            value={budgetBreakdown.transportation}
            currency={trip.currency}
          />

          <BudgetRow
            label="Activities"
            value={budgetBreakdown.activities}
            currency={trip.currency}
          />

          <BudgetRow
            label="Miscellaneous"
            value={budgetBreakdown.miscellaneous}
            currency={trip.currency}
          />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>

            <Text style={styles.totalValue}>
              {trip.currency}{" "}
              {budgetBreakdown.total.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Packing List
          </Text>

          {packingList.length === 0 ? (
            <Text style={styles.paragraph}>
              No packing list available.
            </Text>
          ) : (
            packingList.map((item, index) => (
              <View
                key={`${item.item}-${index}`}
                style={styles.packingItem}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.checked ? styles.checkboxChecked : undefined,
                  ]}
                />

                <Text style={styles.packingText}>
                  {item.item}
                </Text>

                <Text style={styles.packingCategory}>
                  ({item.category})
                </Text>
              </View>
            ))
          )}
        </View>

        <View fixed style={styles.footer}>
          <Text>Generated by TripPulse</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

function BudgetRow({
  label,
  value,
  currency,
}: {
  label: string;
  value: number;
  currency: string;
}) {
  return (
    <View style={styles.budgetRow}>
      <Text style={styles.budgetLabel}>{label}</Text>

      <Text style={styles.budgetValue}>
        {currency} {value.toLocaleString()}
      </Text>
    </View>
  );
}