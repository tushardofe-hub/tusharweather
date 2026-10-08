import { GeocodingResponse, GeocodingResult, WeatherForecastResponse } from '../types/weather';

export class OpenMeteoError extends Error {
  constructor(message: string, public isNotFound = false) {
    super(message);
    this.name = 'OpenMeteoError';
  }
}

/**
 * Search cities using Open-Meteo Geocoding API
 * Requirement: Use https://geocoding-api.open-meteo.com/v1/search?name={city_name}
 */
export async function searchCities(cityName: string, signal?: AbortSignal): Promise<GeocodingResult[]> {
  const query = cityName.trim();
  if (!query) {
    return [];
  }

  const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;

  try {
    const res = await fetch(endpoint, { signal });
    if (!res.ok) {
      throw new OpenMeteoError(`Geocoding server responded with HTTP ${res.status}`);
    }

    const data: GeocodingResponse = await res.json();
    if (!data.results || data.results.length === 0) {
      throw new OpenMeteoError(`No results found for "${query}"`, true);
    }

    return data.results;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof OpenMeteoError) {
      throw err;
    }
    throw new OpenMeteoError('City not found or network error. Please verify the city name or check your connection.');
  }
}

/**
 * Fetch current weather and 7-day forecast using Open-Meteo Weather Forecast API
 * Requirement: Use https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto
 */
export async function fetchWeatherForecast(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<WeatherForecastResponse> {
  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

  try {
    const res = await fetch(endpoint, { signal });
    if (!res.ok) {
      throw new OpenMeteoError(`Weather service error (HTTP ${res.status})`);
    }

    const data: WeatherForecastResponse = await res.json();
    if (!data.current_weather || !data.daily) {
      throw new OpenMeteoError('Received incomplete weather forecast data');
    }

    return data;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof OpenMeteoError) {
      throw err;
    }
    throw new OpenMeteoError('Unable to load weather forecast. Network error or service temporarily unavailable.');
  }
}
