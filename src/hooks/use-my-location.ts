import { WeatherResponse } from "@/app/api/weather/route";
import { create } from "zustand";

export type MyLocation = {
  lat: number | null;
  lon: number | null;
  isLoading?: boolean;
  isError?: boolean;
  details: WeatherResponse | null;
  refreshLocation: () => void;
  set: (v: Partial<Omit<MyLocation, "set">>) => void;
};


const useMyLocation = create<MyLocation>((set) => ({
  lat: null,
  lon: null,
  isLoading: true,
  isError: false,
  details: null,
  refreshLocation: () => null,
  set: (v) => set(v),
}));

export { useMyLocation };
