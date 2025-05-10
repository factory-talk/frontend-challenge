import { CityResponse, CityPayload } from "../types/city";
import { ApiResponse } from "../types";

export const fetchCity = async (): Promise<CityResponse> => {
  const res = await fetch("/api/cities");
  if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`);
  const data = await res.json();
  return data;
};

export const addCity = async (city: CityPayload): Promise<ApiResponse> => {
  const res = await fetch("/api/cities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ city }),
  });

  if (!res.ok) throw new Error(`Failed to add data: ${res.statusText}`);

  const data: ApiResponse = await res.json();
  return data;
};

export const updateCity = async (city: CityPayload): Promise<ApiResponse> => {
  const res = await fetch("/api/cities", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ city }),
  });

  if (!res.ok) throw new Error(`Failed to update data: ${res.statusText}`);

  const data: ApiResponse = await res.json();
  return data;
};

export const deleteCity = async (cityId: number): Promise<ApiResponse> => {
  const res = await fetch("/api/cities", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: cityId }),
  });

  if (!res.ok) throw new Error(`Failed to delete city: ${res.statusText}`);

  const data: ApiResponse = await res.json();
  return data;
};