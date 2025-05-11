import { useState, useEffect } from "react";
import { ForecastResponse } from "../types/forecast";
import { fetchForecast } from "../lib/fetchForecast";

export function useFetchForecastData(cityName: string) {
  const [forecastData, setForecastData] = useState<ForecastResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const useFetchForecast = async () => {
      setLoading(true);
      try {
        const data = await fetchForecast(cityName);
        setForecastData(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    useFetchForecast();
  }, [cityName]);

  return { forecastData, loading, error };
}