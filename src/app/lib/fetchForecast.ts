import { ForecastResponse } from "../types/forecast";
import { API_URL, API_KEY } from "../utils/config";

export const fetchForecast = async (cityName: string): Promise<ForecastResponse> => {
  if (!API_URL || !API_KEY) {
    throw new Error("Missing API configuration.");
  }
  const url = `${API_URL}/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`);
  const data = await res.json();
  return data;
};