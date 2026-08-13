export type TripPlanningInput = {
  destination: string;
  country?: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  travelStyle: string[];
};

export function buildItineraryPrompt(input: TripPlanningInput) {
  return `
You are VoyageAI, an expert travel planner.

Create a realistic personalized travel itinerary using:

Destination: ${input.destination}
Country: ${input.country ?? "Unknown"}
Start date: ${input.startDate}
End date: ${input.endDate}
Travelers: ${input.travelers}
Budget: ${input.budget} ${input.currency}
Travel styles: ${input.travelStyle.join(", ")}

Return ONLY a valid JSON object.

Do NOT use markdown.
Do NOT use \`\`\`.
Do NOT include any explanation before or after the JSON.

The JSON MUST follow this exact structure:

{
  "summary": "Short trip summary",
  "itinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day title",
      "activities": [
        {
          "time": "10:00 AM",
          "title": "Activity title",
          "description": "Short activity description",
          "location": "Location name",
          "estimatedCost": 100,
          "category": "culture"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": 0,
    "food": 0,
    "transportation": 0,
    "activities": 0,
    "miscellaneous": 0,
    "total": 0
  },
  "packingList": [
    {
      "item": "Passport",
      "category": "documents",
      "essential": true
    }
  ]
}

Rules:

- Create one itinerary entry for every day.
- Keep activities realistic and geographically sensible.
- Do not schedule impossible travel times.
- Estimated costs must use ${input.currency}.
- Keep the estimated total reasonably close to the user's budget.
- Tailor activities to the selected travel styles.
- Include practical packing items.
- Use valid JSON only.
`;
}