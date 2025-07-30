"use client";

import { WeatherCondition } from "@/hooks/use-weather-bg";
import { clsx, type ClassValue } from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useToggleAsync<T = boolean, D = boolean>(
  wait: number = 1000,
  value1?: T,
  value2?: D
): [T | D, Dispatch<SetStateAction<T | D>>, () => Promise<void>] {
  const [toggle, setToggle] = useState<T | D>(value1 ?? (false as T));

  const handleToggle = async () => {
    setToggle(value2 ?? (true as D));
    await new Promise((res) => setTimeout(res, wait));
    setToggle(value1 ?? (false as T));
  };

  return [toggle, setToggle, handleToggle];
}

export function mergeWeatherFormat(weatherName: string) {
  const weatherCase = new Map([
    ["Clouds", WeatherCondition.CLOUDY],
    ["Clear", WeatherCondition.SUNNY],
    ["Atmosphere", WeatherCondition.DEFAULT],
    ["Snow", WeatherCondition.PARTLY_CLOUDY],
    ["Rain", WeatherCondition.RAINY],
    ["Drizzle", WeatherCondition.CLOUDY],
    ["Thunderstorm", WeatherCondition.RAINY],
  ]);

  return weatherCase.get(weatherName) ?? WeatherCondition.DEFAULT;
}

export function getDateTimeByTimezone(offsetSeconds: number): string {
  const offsetMinutes = offsetSeconds / 60;
  return dayjs().utcOffset(offsetMinutes).format("YYYY-MM-DD HH:mm");
}
