import { useState, useEffect } from "react";
import { GroupWeatherData, City } from "../types/weather";
import { fetchGroupedWeatherData } from "../lib/fetchWeather";

export function useWeatherData(
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
    const fetchData = async () => {
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

        const data = await fetchGroupedWeatherData(cityIds);
        setWeatherData(data);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cities, currentPage, itemsPerPage, searchQuery]);

  return { weatherData, loading, error, totalPages };
}
