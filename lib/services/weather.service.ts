const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast";

const FETCH_TIMEOUT = 10_000;

async function fetchWithTimeout(
  url: URL | string,
  timeoutMs = FETCH_TIMEOUT,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export type WeatherResult = {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    precipitation: number;
    weatherCode: number;
    windSpeed: number;
  };
  daily: {
    date: string;
    weatherCode: number | null;
    temperatureMax: number;
    temperatureMin: number;
    precipitationProbability: number | null;
    sunrise: string;
    sunset: string;
  }[];
};

type GeocodingResponse = {
  results?: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }[];
};

type ForecastResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
  };
};

export async function getWeather(
  destination: string,
): Promise<WeatherResult> {
  const geocodeUrl = new URL(GEOCODING_URL);

  geocodeUrl.searchParams.set("name", destination);
  geocodeUrl.searchParams.set("count", "1");
  geocodeUrl.searchParams.set("language", "en");
  geocodeUrl.searchParams.set("format", "json");

  const geocodeResponse = await fetchWithTimeout(geocodeUrl);

  if (!geocodeResponse.ok) {
    throw new Error("Failed to find destination.");
  }

  const geocodeData =
    (await geocodeResponse.json()) as GeocodingResponse;

  const location = geocodeData.results?.[0];

  if (!location) {
    throw new Error(`Could not find weather location for "${destination}".`);
  }

  const forecastUrl = new URL(FORECAST_URL);

  forecastUrl.searchParams.set(
    "latitude",
    String(location.latitude),
  );

  forecastUrl.searchParams.set(
    "longitude",
    String(location.longitude),
  );

  forecastUrl.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
  );

  forecastUrl.searchParams.set(
    "daily",
    [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "sunrise",
      "sunset",
    ].join(","),
  );

  forecastUrl.searchParams.set(
    "forecast_days",
    "16",
  );

  forecastUrl.searchParams.set("timezone", "auto");

  const forecastResponse = await fetchWithTimeout(forecastUrl);

  if (!forecastResponse.ok) {
    throw new Error("Failed to fetch weather forecast.");
  }

  const forecastData =
    (await forecastResponse.json()) as ForecastResponse;

  return {
    location: {
      name: location.name,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone,
    },

    current: {
      temperature: forecastData.current.temperature_2m,
      apparentTemperature:
        forecastData.current.apparent_temperature,
      humidity:
        forecastData.current.relative_humidity_2m,
      precipitation:
        forecastData.current.precipitation,
      weatherCode:
        forecastData.current.weather_code,
      windSpeed:
        forecastData.current.wind_speed_10m,
    },

    daily: forecastData.daily.time.map((date, index) => ({
      date,
      weatherCode:
        forecastData.daily.weather_code[index],
      temperatureMax:
        forecastData.daily.temperature_2m_max[index],
      temperatureMin:
        forecastData.daily.temperature_2m_min[index],
      precipitationProbability:
        forecastData.daily
          .precipitation_probability_max[index],
      sunrise:
        forecastData.daily.sunrise[index],
      sunset:
        forecastData.daily.sunset[index],
    })),
  };
}