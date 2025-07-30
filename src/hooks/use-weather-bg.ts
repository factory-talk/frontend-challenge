"use client";

import { create } from "zustand";


export enum WeatherCondition {
  SUNNY = "sunny",
  CLOUDY = "cloudy",
  RAINY = "rainy",
  PARTLY_CLOUDY = "partly-cloudy",
  DEFAULT = "default",
}

type Store = {
  weather: WeatherCondition;
  change: (weather: WeatherCondition) => void;
};

const useWeatherBg = create<Store>((set) => ({
  weather: WeatherCondition.DEFAULT,
  change: (weather) => set({ weather: weather }),
}));

export { useWeatherBg };
