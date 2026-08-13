import { NextResponse } from "next/server";
import { z } from "zod";

import { groq } from "@/lib/ai/groq";
import { buildItineraryPrompt } from "@/lib/ai/prompts/itinerary";
import { itinerarySchema } from "@/lib/ai/schemas/itinerary.schema";

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
  try {
    const body = await request.json();

    const input = requestSchema.parse(body);

    const prompt = buildItineraryPrompt(input);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are VoyageAI, a professional AI travel planner. Return only valid JSON. Never include markdown fences or additional text.",
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
  console.error("Invalid JSON returned by Groq:", content);

  return NextResponse.json(
    {
      success: false,
      error: "The AI returned invalid JSON.",
    },
    { status: 502 },
  );
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

    return NextResponse.json(
      {
        success: false,
        error: "Unable to generate your itinerary.",
      },
      { status: 500 },
    );
  }
}