import { GroupWeatherResponse, WeatherResponse } from "../types/weather";
import { API_URL, API_KEY } from "../utils/config";

export const fetchGroupedWeather = async (cityIds: number[]): Promise<GroupWeatherResponse> => {
  if (!API_URL || !API_KEY) {
    throw new Error("Missing API configuration.");
  }
  const url = `${API_URL}/2.5/group?id=${cityIds.join(",")}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`);
  const data = await res.json();
  return data;
};


export const fetchDetailWeather = async (cityName: string): Promise<WeatherResponse> => {
  if (!API_URL || !API_KEY) {
    throw new Error("Missing API configuration.");
  }
  const url = `${API_URL}/2.5/weather?q=${cityName}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`);
  const data = await res.json();
  return data;
};
