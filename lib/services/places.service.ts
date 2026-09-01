const GEOAPIFY_PLACES_URL =
  "https://api.geoapify.com/v2/places";

export type Place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
  distance: number;
  website?: string;
  phone?: string;
  openingHours?: string;
};

type GeoapifyFeature = {
  properties?: {
    place_id?: string;
    name?: string;
    lat?: number;
    lon?: number;
    formatted?: string;
    categories?: string[];
    distance?: number;
    website?: string;
    phone?: string;
    opening_hours?: string;
  };
};

type GeoapifyResponse = {
  features?: GeoapifyFeature[];
};

// ── Category definitions for each tab ────────────────────────────

const RESTAURANT_CATEGORIES = [
  "catering.restaurant",
  "catering.cafe",
];

const HOTEL_CATEGORIES = [
  "accommodation.hotel",
  "accommodation.guest_house",
];

const ATTRACTION_CATEGORIES = [
  "tourism.attraction",
  "tourism.sights",
  "entertainment.museum",
  "entertainment.culture",
];

const TEMPLE_CATEGORIES = [
  "religion.place_of_worship",
  "tourism.attraction",
  "tourism.sights",
];

const NATURE_CATEGORIES = [
  "natural.water",
  "natural.mountain",
  "natural.forest",
  "natural.protected_area",
  "leisure.park",
  "leisure.park.garden",
  "leisure.park.nature_reserve",
  "leisure.picnic",
  "national_park",
];

const HISTORICAL_CATEGORIES = [
  "heritage.unesco",
  "tourism.sights",
  "entertainment.museum",
  "tourism.attraction",
];

const ALL_CATEGORIES = [
  ...ATTRACTION_CATEGORIES,
  ...TEMPLE_CATEGORIES,
  ...NATURE_CATEGORIES,
  ...HISTORICAL_CATEGORIES,
  ...RESTAURANT_CATEGORIES,
  ...HOTEL_CATEGORIES,
];

export type PlaceCategory =
  | "all"
  | "restaurants"
  | "hotels"
  | "attractions"
  | "temples"
  | "nature"
  | "historical";

const CATEGORY_CONFIG: Record<
  PlaceCategory,
  { categories: string[]; isHotelCategory?: boolean }
> = {
  all: { categories: ALL_CATEGORIES },
  restaurants: { categories: RESTAURANT_CATEGORIES },
  hotels: {
    categories: HOTEL_CATEGORIES,
    isHotelCategory: true,
  },
  attractions: { categories: ATTRACTION_CATEGORIES },
  temples: { categories: TEMPLE_CATEGORIES },
  nature: { categories: NATURE_CATEGORIES },
  historical: { categories: HISTORICAL_CATEGORIES },
};

// ── Category priority scoring ────────────────────────────────────

const CATEGORY_PRIORITY: Record<string, number> = {
  "heritage.unesco": 100,
  "tourism.attraction": 90,
  "tourism.sights": 85,
  "natural.mountain": 82,
  "natural.water": 80,
  "natural.forest": 78,
  "natural.protected_area": 77,
  "national_park": 76,
  "leisure.park": 75,
  "leisure.park.garden": 73,
  "leisure.park.nature_reserve": 72,
  "leisure.picnic": 70,
  "entertainment.museum": 68,
  "entertainment.culture": 65,
  "religion.place_of_worship": 63,
  "catering.restaurant": 60,
  "catering.cafe": 55,
  "accommodation.hotel": 50,
  "accommodation.guest_house": 40,
};

// ── Scoring ──────────────────────────────────────────────────────

function getPrimaryCategory(categories: string[]): string {
  if (!categories.length) return "";

  // Pick the highest-priority category from the place's category list
  let best = categories[0];
  let bestScore = CATEGORY_PRIORITY[best] ?? 0;

  for (const cat of categories) {
    const score = CATEGORY_PRIORITY[cat] ?? 0;
    if (score > bestScore) {
      best = cat;
      bestScore = score;
    }
  }

  return best;
}

function scorePlace(
  feature: GeoapifyFeature,
): number {
  const props = feature.properties;
  if (!props) return 0;

  const cats = props.categories ?? [];
  const primary = getPrimaryCategory(cats);
  let score = CATEGORY_PRIORITY[primary] ?? 30;

  // Distance bonus (Geoapify returns distance in meters when using bias)
  const dist = props.distance ?? 99999;
  const distKm = dist / 1000;

  if (distKm < 2) score += 30;
  else if (distKm < 5) score += 22;
  else if (distKm < 10) score += 14;
  else if (distKm < 15) score += 6;
  else if (distKm > 25) score -= 10;

  // Slight bonus for named places (indicates notability)
  if (props.name && props.name.length > 2) score += 5;

  return score;
}

// ── Geoapify fetch ───────────────────────────────────────────────

async function fetchGeoapify(
  categories: string[],
  latitude: number,
  longitude: number,
  limit: number,
  name?: string,
): Promise<GeoapifyResponse> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY is not configured.");
  }

  const url = new URL(GEOAPIFY_PLACES_URL);

  url.searchParams.set("categories", categories.join(","));
  url.searchParams.set(
    "bias",
    `proximity:${longitude},${latitude}`,
  );
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("lang", "en");
  url.searchParams.set("apiKey", apiKey);

  if (name?.trim()) {
    url.searchParams.set("name", name.trim());
  }

  const response = await fetch(url, {
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    throw new Error(
      `Geoapify API error: ${response.status}`,
    );
  }

  return (await response.json()) as GeoapifyResponse;
}

// ── Feature → Place conversion ───────────────────────────────────

function featureToPlace(
  feature: GeoapifyFeature,
): Place | null {
  const props = feature.properties;

  if (
    !props?.place_id ||
    !props.name ||
    props.lat == null ||
    props.lon == null
  ) {
    return null;
  }

  const cats = props.categories ?? [];
  const primary = getPrimaryCategory(cats);

  return {
    id: props.place_id,
    name: props.name,
    latitude: props.lat,
    longitude: props.lon,
    address: props.formatted ?? "",
    category: primary || "place",
    distance: props.distance ?? 0,
    website: props.website ?? undefined,
    phone: props.phone ?? undefined,
    openingHours: props.opening_hours ?? undefined,
  };
}

// ── Deduplication ────────────────────────────────────────────────

function deduplicate(places: Place[]): Place[] {
  const seen = new Map<string, Place>();

  for (const place of places) {
    const key = place.id || `${place.name}_${place.latitude.toFixed(4)}_${place.longitude.toFixed(4)}`;

    if (!seen.has(key)) {
      seen.set(key, place);
    }
  }

  return Array.from(seen.values());
}

// ── Hostel filter ────────────────────────────────────────────────

function isHostel(feature: GeoapifyFeature): boolean {
  const cats = feature.properties?.categories ?? [];
  return cats.some((c) => c.includes("hostel"));
}

// ── Public functions ─────────────────────────────────────────────

export async function getPlacesByCategory(
  category: PlaceCategory,
  latitude: number,
  longitude: number,
  limit = 12,
  name?: string,
): Promise<Place[]> {
  const config = CATEGORY_CONFIG[category];

  if (!config) return [];

  // Request extra results so scoring + dedup still leaves enough
  const fetchLimit = Math.min(limit * 4, 60);

  const response = await fetchGeoapify(
    config.categories,
    latitude,
    longitude,
    fetchLimit,
    name,
  );

  let features = response.features ?? [];

  // Filter hostels from hotel category
  if (config.isHotelCategory) {
    features = features.filter((f) => !isHostel(f));
  }

  // Convert, score, dedup, sort
  const places = features
    .map(featureToPlace)
    .filter((p): p is Place => p !== null);

  const scored = places.map((place) => ({
    place,
    score: scorePlace(
      features.find(
        (f) => f.properties?.place_id === place.id,
    )!,
    ),
  }));

  scored.sort((a, b) => b.score - a.score);

  const deduped = deduplicate(
    scored.map((s) => s.place),
  );

  return deduped.slice(0, limit);
}

// Legacy wrappers for API routes that still use separate endpoints

export async function getRestaurants(
  latitude: number,
  longitude: number,
  limit = 12,
): Promise<Place[]> {
  return getPlacesByCategory(
    "restaurants",
    latitude,
    longitude,
    limit,
  );
}

export async function getHotels(
  latitude: number,
  longitude: number,
  limit = 12,
): Promise<Place[]> {
  return getPlacesByCategory(
    "hotels",
    latitude,
    longitude,
    limit,
  );
}

export async function getAttractions(
  latitude: number,
  longitude: number,
  limit = 12,
): Promise<Place[]> {
  return getPlacesByCategory(
    "attractions",
    latitude,
    longitude,
    limit,
  );
}
