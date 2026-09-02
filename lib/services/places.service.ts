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

// ── Search area config ───────────────────────────────────────────

const SEARCH_RADIUS_METERS = 45_000;

// ── Category definitions for each tab ────────────────────────────

const RESTAURANT_CATEGORIES = [
  "catering.restaurant",
  "catering.cafe",
];

const HOTEL_CATEGORIES = [
  "accommodation.hotel",
  "accommodation.motel",
  "accommodation.guest_house",
];

const ATTRACTION_CATEGORIES = [
  "tourism.attraction",
  "tourism.attraction.viewpoint",
  "tourism.sights",
  "tourism.sights.castle",
  "tourism.sights.ruines",
  "tourism.sights.lighthouse",
  "entertainment.museum",
  "entertainment.culture",
  "entertainment.theme_park",
];

const TEMPLE_CATEGORIES = [
  "religion.place_of_worship",
  "religion.place_of_worship.hindu",
  "religion.place_of_worship.buddhist",
  "religion.place_of_worship.jain",
  "tourism.attraction",
  "tourism.sights",
];

const NATURE_CATEGORIES = [
  "natural.water",
  "natural.water.waterfall",
  "natural.mountain",
  "natural.mountain.peak",
  "natural.forest",
  "natural.protected_area",
  "leisure.park",
  "leisure.park.garden",
  "leisure.park.nature_reserve",
  "leisure.picnic",
  "leisure.picnic.bbq",
];

const HISTORICAL_CATEGORIES = [
  "heritage.unesco",
  "heritage",
  "tourism.sights",
  "tourism.sights.castle",
  "tourism.sights.ruines",
  "entertainment.museum",
  "tourism.attraction",
];

const ALL_CATEGORIES = [
  ...new Set([
    ...ATTRACTION_CATEGORIES,
    ...TEMPLE_CATEGORIES,
    ...NATURE_CATEGORIES,
    ...HISTORICAL_CATEGORIES,
    ...RESTAURANT_CATEGORIES,
    ...HOTEL_CATEGORIES,
  ]),
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
  "heritage": 95,
  "tourism.attraction": 90,
  "tourism.attraction.viewpoint": 88,
  "tourism.sights": 85,
  "tourism.sights.castle": 92,
  "tourism.sights.ruines": 87,
  "tourism.sights.lighthouse": 82,
  "natural.water.waterfall": 88,
  "natural.mountain": 82,
  "natural.mountain.peak": 83,
  "natural.water": 80,
  "natural.forest": 78,
  "natural.protected_area": 85,
  "leisure.park": 65,
  "leisure.park.garden": 63,
  "leisure.park.nature_reserve": 72,
  "leisure.picnic": 55,
  "leisure.picnic.bbq": 50,
  "entertainment.museum": 75,
  "entertainment.culture": 70,
  "entertainment.theme_park": 80,
  "religion.place_of_worship": 78,
  "religion.place_of_worship.hindu": 80,
  "religion.place_of_worship.buddhist": 79,
  "religion.place_of_worship.jain": 79,
  "catering.restaurant": 50,
  "catering.cafe": 45,
  "accommodation.hotel": 55,
  "accommodation.motel": 45,
  "accommodation.guest_house": 40,
};

// ── Tourism category classification ──────────────────────────────

const TOURISM_HEAVY_PREFIXES = [
  "tourism",
  "heritage",
  "natural",
];

const HERITAGE_PREFIXES = [
  "heritage",
  "tourism.sights.castle",
  "tourism.sights.ruines",
];

const NATURE_DESTINATION_PREFIXES = [
  "natural",
  "leisure.park.nature_reserve",
];

// ── Haversine distance (meters) ─────────────────────────────────

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Scoring helpers ──────────────────────────────────────────────

function getPrimaryCategory(categories: string[]): string {
  if (!categories.length) return "";

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

function hasAnyPrefix(
  categories: string[],
  prefixes: string[],
): boolean {
  return categories.some((cat) =>
    prefixes.some(
      (p) => cat === p || cat.startsWith(p + "."),
    ),
  );
}

function isTourismHeavy(categories: string[]): boolean {
  return hasAnyPrefix(categories, TOURISM_HEAVY_PREFIXES);
}

function isHeritage(categories: string[]): boolean {
  return hasAnyPrefix(categories, HERITAGE_PREFIXES);
}

function isNatureDestination(categories: string[]): boolean {
  return hasAnyPrefix(
    categories,
    NATURE_DESTINATION_PREFIXES,
  );
}

// ── Scoring ──────────────────────────────────────────────────────

function scorePlace(
  feature: GeoapifyFeature,
  centerLat: number,
  centerLon: number,
): number {
  const props = feature.properties;
  if (!props) return 0;

  const cats = props.categories ?? [];
  const primary = getPrimaryCategory(cats);

  // 1. Category tourism relevance (0-100)
  let score = CATEGORY_PRIORITY[primary] ?? 30;

  // 2. Tourism-specific boosts
  if (isTourismHeavy(cats)) score += 20;
  if (isHeritage(cats)) score += 15;
  if (isNatureDestination(cats)) score += 12;

  // 3. Distance penalty (mild — fame matters more)
  const dist =
    props.distance ??
    haversine(
      centerLat,
      centerLon,
      props.lat ?? 0,
      props.lon ?? 0,
    );
  const distKm = dist / 1000;

  if (distKm > 40) score -= 8;
  else if (distKm > 30) score -= 4;
  else if (distKm < 5) score += 5;

  // 4. Named place bonus
  if (props.name && props.name.length > 5) score += 8;
  if (props.name && props.name.length > 10) score += 5;

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
    "filter",
    `circle:${longitude},${latitude},${SEARCH_RADIUS_METERS}`,
  );
  url.searchParams.set(
    "bias",
    `proximity:${longitude},${latitude}`,
  );
  url.searchParams.set("limit", String(Math.min(limit, 500)));
  url.searchParams.set("lang", "en");
  url.searchParams.set("apiKey", apiKey);

  if (name?.trim()) {
    url.searchParams.set("name", name.trim());
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Geoapify API error: ${response.status} — ${body}`,
    );
  }

  return (await response.json()) as GeoapifyResponse;
}

// ── Multi-area search points ─────────────────────────────────────

function generateSearchPoints(
  lat: number,
  lon: number,
): { latitude: number; longitude: number }[] {
  const offsetKm = (SEARCH_RADIUS_METERS * 0.6) / 1000;
  const dLat = offsetKm / 111;
  const dLon =
    offsetKm / (111 * Math.cos((lat * Math.PI) / 180));

  return [
    { latitude: lat, longitude: lon },
    { latitude: lat + dLat, longitude: lon },
    { latitude: lat - dLat, longitude: lon },
    { latitude: lat, longitude: lon + dLon },
    { latitude: lat, longitude: lon - dLon },
  ];
}

async function fetchAllAreas(
  categories: string[],
  latitude: number,
  longitude: number,
  fetchLimit: number,
  name?: string,
): Promise<GeoapifyFeature[]> {
  const points = generateSearchPoints(latitude, longitude);

  const perPointLimit = Math.min(
    Math.ceil(fetchLimit / points.length),
    100,
  );

  const responses = await Promise.all(
    points.map((p) =>
      fetchGeoapify(
        categories,
        p.latitude,
        p.longitude,
        perPointLimit,
        name,
      ),
    ),
  );

  return responses.flatMap((r) => r.features ?? []);
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

// ── Quality filters ──────────────────────────────────────────────

const GENERIC_PREFIXES = [
  "commercial",
  "office",
  "service",
  "healthcare",
  "amenity",
  "parking",
];

function isHostel(feature: GeoapifyFeature): boolean {
  const cats = feature.properties?.categories ?? [];
  return cats.some((c) => c.includes("hostel"));
}

function isGenericBusiness(
  feature: GeoapifyFeature,
): boolean {
  const cats = feature.properties?.categories ?? [];
  return cats.some((c) =>
    GENERIC_PREFIXES.some((g) => c.startsWith(g)),
  );
}

function isTouristRelevant(
  feature: GeoapifyFeature,
): boolean {
  const cats = feature.properties?.categories ?? [];
  const relevantPrefixes = [
    "tourism",
    "entertainment",
    "natural",
    "leisure",
    "heritage",
    "religion",
    "sport",
    "accommodation",
    "catering",
  ];
  return cats.some((c) =>
    relevantPrefixes.some((r) => c.startsWith(r)),
  );
}

// ── Deduplication ────────────────────────────────────────────────

function deduplicate(places: Place[]): Place[] {
  const seen = new Map<string, Place>();

  for (const place of places) {
    const key =
      place.id ||
      `${place.name}_${place.latitude.toFixed(4)}_${place.longitude.toFixed(4)}`;

    if (!seen.has(key)) {
      seen.set(key, place);
    }
  }

  return Array.from(seen.values());
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

  // Large candidate pool from multi-area search
  const fetchLimit = Math.min(limit * 6, 100);

  const allFeatures = await fetchAllAreas(
    config.categories,
    latitude,
    longitude,
    fetchLimit,
    name,
  );

  // Quality filtering
  let features = allFeatures;

  if (config.isHotelCategory) {
    features = features.filter((f) => !isHostel(f));
  }

  features = features.filter(
    (f) =>
      isTouristRelevant(f) || !isGenericBusiness(f),
  );

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
      latitude,
      longitude,
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
