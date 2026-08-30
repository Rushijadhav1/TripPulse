import { NextResponse } from "next/server";

import { getWeather } from "@/lib/services/weather.service";
import { requireAuth } from "@/lib/auth-api";

export async function GET(request: Request) {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    const { searchParams } = new URL(request.url);

    const destination = searchParams.get("destination");

    if (!destination) {
      return NextResponse.json(
        {
          success: false,
          error: "Destination is required.",
        },
        { status: 400 },
      );
    }

    const weather = await getWeather(destination);

    return NextResponse.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    console.error("Weather API error:", error);

    const message =
      error instanceof Error &&
      error.name === "AbortError"
        ? "Weather service timed out. Please try again."
        : error instanceof Error
          ? error.message
          : "Unable to fetch weather.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}