import { ForecastResponse } from "@/app/api/forecast/route";
import { SearchCityResponse } from "@/app/api/search-city/route";
import { WeatherResponse } from "@/app/api/weather/route";

export async function getCurrentWeather({
  lat,
  lon,
}: {
  lat: number | null;
  lon: number | null;
}): Promise<BaseResponse<WeatherResponse>> {
  try {
    const rawData = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    const data = await rawData.json();
    return { data, success: true };
  } catch {
    return { data: null, success: false };
  }
}

type BaseResponse<T> =
  | { data: T; success: true }
  | {
      data: null;
      success: false;
    };

export async function searchCityApi(
  query: string
): Promise<BaseResponse<SearchCityResponse[]>> {
  try {
    const rawData = await fetch(`/api/search-city?q=${query}`);
    const data = await rawData.json();
    return { data, success: true };
  } catch {
    return { data: null, success: false };
  }
}

export async function weatherForecastApi({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<BaseResponse<ForecastResponse>> {
  try {
    const rawData = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`);
    const data = await rawData.json();
    return { data, success: true };
  } catch {
    return { data: null, success: false };
  }
}
