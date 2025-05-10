import { useState, useEffect } from "react";
import { GroupWeatherData, City, WeatherResponse } from "../types/weather";
import { fetchGroupedWeather, fetchDetailWeather } from "../lib/fetchWeather";

export function useFetchGroupedWeatherData(
  cities: City[],
  currentPage: number,
  itemsPerPage: number,
  searchQuery: string
) {
  const [weatherData, setWeatherData] = useState<GroupWeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const useFetchGroupedWeather = async () => {
      setLoading(true);
      try {
        const filtered = searchQuery
          ? cities.filter((city) =>
              city.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : cities;

        const indexOfLast = currentPage * itemsPerPage;
        const indexOfFirst = indexOfLast - itemsPerPage;
        const pageCities = filtered.slice(indexOfFirst, indexOfLast);
        const cityIds = pageCities.map((c) => c.id);

        const data = await fetchGroupedWeather(cityIds);
        setWeatherData(data.list);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    useFetchGroupedWeather();
  }, [cities, currentPage, itemsPerPage, searchQuery]);

  return { weatherData, loading, error, totalPages };
}

export function useFetchDetailWeatherData(
  cityName: string
) {
  const [weatherData, setWeatherData] = useState<WeatherResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const useFetchDetailWeather = async () => {
      setLoading(true);
      try {
        const data = await fetchDetailWeather(cityName);
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    useFetchDetailWeather();
  }, [cityName]);

  return { weatherData, loading, error };
}
