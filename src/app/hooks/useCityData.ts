import { useState, useEffect } from "react";
import { CityResponse, CityPayload } from "../types/city";
import { ApiResponse } from "../types";
import { fetchCity, addCity, updateCity, deleteCity } from "../lib/fetchCity";

export function useFetchCityData() {
  const [cities, setCities] = useState<CityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCitiesData = async () => {
      setLoading(true);
      try {
        const data = await fetchCity();
        setCities(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesData();
  }, []);

  return { cities, loading, error };
}

export function useAddCityData(city: CityPayload) {
  const [response, setResponse] = useState<ApiResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const addCityData = async () => {
      setLoading(true);
      try {
        const data = await addCity(city);
        setResponse(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    addCityData();
  }, [city]);

  return { response, loading, error };
}

export function useUpdateCityData(city: CityPayload) {
  const [response, setResponse] = useState<ApiResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateCityData = async () => {
      setLoading(true);
      try {
        const data = await updateCity(city);
        setResponse(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    updateCityData();
  }, [city]);

  return { response, loading, error };
}

export function useDeleteCityData(cityId: number) {
  const [response, setResponse] = useState<ApiResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const deleteCityData = async () => {
      setLoading(true);
      try {
        const data = await deleteCity(cityId);
        setResponse(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (cityId) {
      deleteCityData();
    }
  }, [cityId]);

  return { response, loading, error };
}
