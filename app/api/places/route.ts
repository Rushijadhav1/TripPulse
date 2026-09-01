import { NextResponse } from "next/server";

import {
  getPlacesByCategory,
  type PlaceCategory,
} from "@/lib/services/places.service";
import { requireAuth } from "@/lib/auth-api";

const VALID_CATEGORIES: PlaceCategory[] = [
  "all",
  "restaurants",
  "hotels",
  "attractions",
  "temples",
  "nature",
  "historical",
];

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

    const category = (searchParams.get("category") ??
      "all") as PlaceCategory;

    const limit = Math.min(
      Number(searchParams.get("limit") ?? 12),
      20,
    );

    const name = searchParams.get("name") ?? undefined;

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

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid category. Valid: ${VALID_CATEGORIES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const places = await getPlacesByCategory(
      category,
      latitude,
      longitude,
      limit,
      name,
    );

    return NextResponse.json({
      success: true,
      data: places,
    });
  } catch (error) {
    console.error("Places API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch places.",
      },
      { status: 500 },
    );
  }
}
