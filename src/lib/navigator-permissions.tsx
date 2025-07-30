"use client";

import { WeatherResponse } from "@/app/api/weather/route";
import { useMyLocation } from "@/hooks/use-my-location";
import { useWeatherBg, WeatherCondition } from "@/hooks/use-weather-bg";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCurrentWeather } from "src/services/get-current-weather";
import { mergeWeatherFormat } from "./utils";

export function NavigatorPermissions() {
  const [forceReEffect, setForceReEffect] = useState(0);
  const weatherBg = useWeatherBg();
  const myLocation = useMyLocation();
  const refreshLocation = () => {
    myLocation.set({ isLoading: true });
    setForceReEffect((i) => i + 1);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getCurrentWeather({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }).then(({ data, success }) => {
          if (!success) return;

          myLocation.set({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            isLoading: false,
            isError: false,
            refreshLocation,
            details: data,
          });
          weatherBg.change(mergeWeatherFormat(data.weather[0].main));
        });
      },
      (err) => {
        let msg = err.message;

        switch (err.code) {
          case 1:
            msg =
              "We can't access your location. Please allow location access to continue.";
            break;
          case 2:
            msg =
              "Unable to access your location. Make sure location services are enabled.";
            break;
        }

        toast.error(msg);
        myLocation.set({
          lat: null,
          lon: null,
          details: null,
          refreshLocation,
          isLoading: false,
          isError: true,
        });
        weatherBg.change(WeatherCondition.DEFAULT);
      }
    );
  }, [forceReEffect]);

  return null;
}

