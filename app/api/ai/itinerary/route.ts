import { NextResponse } from "next/server";
import { z } from "zod";

import { groq } from "@/lib/ai/groq";
import { buildItineraryPrompt } from "@/lib/ai/prompts/itinerary";
import { itinerarySchema } from "@/lib/ai/schemas/itinerary.schema";
import { requireAuth } from "@/lib/auth-api";

const requestSchema = z.object({
  destination: z.string().min(2),
  country: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  travelers: z.number().int().min(1).max(20),
  budget: z.number().positive(),
  currency: z.string().min(3).max(3),
  travelStyle: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();

    const input = requestSchema.parse(body);

    const prompt = buildItineraryPrompt(input);

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are TripPulse, a professional AI travel planner. Return only valid JSON. Never include markdown fences or additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "The AI returned an empty response.",
        },
        { status: 502 },
      );
    }

   let parsed: unknown;

try {
  const cleanedContent = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  parsed = JSON.parse(cleanedContent);
} catch {
  // Fallback: extract the first JSON object from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      console.error("Invalid JSON returned by Groq:", content);

      return NextResponse.json(
        {
          success: false,
          error: "The AI returned invalid JSON.",
        },
        { status: 502 },
      );
    }
  } else {
    console.error("No JSON found in Groq response:", content);

    return NextResponse.json(
      {
        success: false,
        error: "The AI returned invalid JSON.",
      },
      { status: 502 },
    );
  }
}

    const result = itinerarySchema.safeParse(parsed);

    if (!result.success) {
      console.error("AI response failed schema validation:", result.error);

      return NextResponse.json(
        {
          success: false,
          error: "The AI response did not match the expected format.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Itinerary generation failed:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid trip information.",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Itinerary generation error detail:", message);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to generate your itinerary.",
        detail: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    );
  }
}