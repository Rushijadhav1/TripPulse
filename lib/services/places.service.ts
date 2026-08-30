const GEOAPIFY_PLACES_URL =
  "https://api.geoapify.com/v2/places";

export type Restaurant = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
};

type GeoapifyFeature = {
  properties?: {
    place_id?: string;
    name?: string;
    lat?: number;
    lon?: number;
    formatted?: string;
    categories?: string[];
  };
};
export type Hotel = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
};

export type Attraction = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
};

type GeoapifyResponse = {
  features?: GeoapifyFeature[];
};

export async function getRestaurants(
  latitude: number,
  longitude: number,
  limit = 10,
): Promise<Restaurant[]> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY is not configured.");
  }

  const url = new URL(GEOAPIFY_PLACES_URL);

  url.searchParams.set(
    "categories",
    "catering.restaurant,catering.cafe",
  );

  url.searchParams.set(
    "bias",
    `circle:${longitude},${latitude},5000`,
  );

  url.searchParams.set("limit", String(limit));
  url.searchParams.set("apiKey", apiKey);

  const response = await fetch(url, {
    next: {
      revalidate: 900,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch restaurants.");
  }

  const data =
    (await response.json()) as GeoapifyResponse;

    return (data.features ?? [])
  .map((feature) => {
    const place = feature.properties;

    if (
      !place?.place_id ||
      !place.name ||
      place.lat == null ||
      place.lon == null
    ) {
      return null;
    }

    const categories = place.categories ?? [];

    const isRestaurant =
      categories.some((category) =>
        category.startsWith("catering.restaurant"),
      ) ||
      categories.some((category) =>
        category.startsWith("catering.cafe"),
      ) ||
      categories.some((category) =>
        category.startsWith("catering.fast_food"),
      ) ||
      categories.some((category) =>
        category.startsWith("catering.bar"),
      );

    if (!isRestaurant) {
      return null;
    }

    return {
      id: place.place_id,
      name: place.name,
      latitude: place.lat,
      longitude: place.lon,
      address: place.formatted ?? "",
      category: categories.find((category) =>
        category.startsWith("catering."),
      ) ?? "restaurant",
    };
  })
  .filter(
    (restaurant): restaurant is Restaurant =>
      restaurant !== null,
  );
 
}

export async function getHotels(
  latitude: number,
  longitude: number,
  limit = 10,
): Promise<Hotel[]> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY is not configured.");
  }

  const url = new URL(GEOAPIFY_PLACES_URL);

  url.searchParams.set(
    "categories",
    "accommodation.hotel,accommodation.guest_house,accommodation.hostel",
  );

  url.searchParams.set(
    "bias",
    `circle:${longitude},${latitude},5000`,
  );

  url.searchParams.set("limit", String(limit));
  url.searchParams.set("apiKey", apiKey);

  const response = await fetch(url, {
    next: {
      revalidate: 900,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch hotels.");
  }

  const data =
    (await response.json()) as GeoapifyResponse;

  return (data.features ?? [])
    .map((feature) => {
      const place = feature.properties;

      if (
        !place?.place_id ||
        !place.name ||
        place.lat == null ||
        place.lon == null
      ) {
        return null;
      }

      return {
        id: place.place_id,
        name: place.name,
        latitude: place.lat,
        longitude: place.lon,
        address: place.formatted ?? "",
        category:
          place.categories?.find((category) =>
            category.startsWith("accommodation."),
          ) ?? "accommodation",
      };
    })
    .filter(
      (hotel): hotel is Hotel =>
        hotel !== null,
    );
}

export async function getAttractions(
  latitude: number,
  longitude: number,
  limit = 10,
): Promise<Attraction[]> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY is not configured.");
  }

  const url = new URL(GEOAPIFY_PLACES_URL);

  url.searchParams.set(
    "categories",
    [
      "tourism.attraction",
      "tourism.sights",
      "entertainment.museum",
      "entertainment.culture",
    ].join(","),
  );

  url.searchParams.set(
    "bias",
    `circle:${longitude},${latitude},5000`,
  );

  url.searchParams.set("limit", String(limit));
  url.searchParams.set("apiKey", apiKey);

  const response = await fetch(url, {
    next: {
      revalidate: 900,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch attractions.");
  }

  const data =
    (await response.json()) as GeoapifyResponse;

  return (data.features ?? [])
    .map((feature) => {
      const place = feature.properties;

      if (
        !place?.place_id ||
        !place.name ||
        place.lat == null ||
        place.lon == null
      ) {
        return null;
      }

      const categories = place.categories ?? [];

      return {
        id: place.place_id,
        name: place.name,
        latitude: place.lat,
        longitude: place.lon,
        address: place.formatted ?? "",
        category:
          categories.find((category) =>
            category.startsWith("tourism."),
          ) ??
          categories.find((category) =>
            category.startsWith("entertainment."),
          ) ??
          "attraction",
      };
    })
    .filter(
      (attraction): attraction is Attraction =>
        attraction !== null,
    );
}