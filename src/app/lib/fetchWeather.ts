import { GroupWeatherData } from "../types/weather";
import { API_URL, API_KEY } from "../utils/config";

export const fetchGroupedWeatherData = async (
  cityIds: number[]
): Promise<GroupWeatherData[]> => {
  if (!API_URL || !API_KEY) {
    throw new Error("Missing API configuration.");
  }
  const url = `${API_URL}/group?id=${cityIds.join(",")}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`);
  const data = await res.json();
  return data.list;
};
