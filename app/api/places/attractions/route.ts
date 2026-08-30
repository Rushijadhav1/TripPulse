import { NextResponse } from "next/server";

import { getAttractions } from "@/lib/services/places.service";
import { requireAuth } from "@/lib/auth-api";

export async function GET(request: Request) {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    const { searchParams } = new URL(request.url);

    const latitude = Number(
      searchParams.get("latitude"),
    );

    const longitude = Number(
      searchParams.get("longitude"),
    );

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Valid latitude and longitude are required.",
        },
        { status: 400 },
      );
    }

    const attractions = await getAttractions(
      latitude,
      longitude,
      10,
    );

    return NextResponse.json({
      success: true,
      data: attractions,
    });
  } catch (error) {
    console.error("Attractions API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch attractions.",
      },
      { status: 500 },
    );
  }
}