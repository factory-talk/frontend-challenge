import { useState, useEffect } from "react";
import { CityResponse, CityPayload } from "../types/city";
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

export function useAddCityData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCityData = async (city: CityPayload) => {
    setLoading(true);
    try {
      await addCity(city);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { addCityData, loading, error };
}

export function useUpdateCityData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCityData = async (city: CityPayload) => {
    setLoading(true);
    try {
      await updateCity(city);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { updateCityData, loading, error };
}

export function useDeleteCityData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCityData = async (cityId: number) => {
    setLoading(true);
    try {
      await deleteCity(cityId);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteCityData, loading, error };
}