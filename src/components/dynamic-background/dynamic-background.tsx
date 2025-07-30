"use client";

import { cn } from "@/lib/utils";
import { useWeatherBg, WeatherCondition } from "@/hooks/use-weather-bg";

export function DynamicBackground() {
  const { weather } = useWeatherBg();
  return (
    <>
      <BackgroundWeatherColors
        weather={WeatherCondition.SUNNY}
        current={weather}
      />
      <BackgroundWeatherColors
        weather={WeatherCondition.PARTLY_CLOUDY}
        current={weather}
      />
      <BackgroundWeatherColors
        weather={WeatherCondition.CLOUDY}
        current={weather}
      />
      <BackgroundWeatherColors
        weather={WeatherCondition.RAINY}
        current={weather}
      />
      <BackgroundWeatherColors
        weather={WeatherCondition.DEFAULT}
        current={weather}
      />

      {/* bg-blur overlay */}
      <div className="fixed inset-0 -z-[1] backdrop-blur-sm bg-white/10" />
    </>
  );
}

function BackgroundWeatherColors({
  weather,
  current,
}: {
  weather: WeatherCondition;
  current: WeatherCondition;
}) {
  let weatherClassName = {
    primary:
      "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900",
    secondary:
      "bg-gradient-to-tl from-cyan-300 via-transparent to-yellow-300 dark:from-cyan-800 dark:via-transparent dark:to-yellow-800",
  };

  const isCurrent = weather === current;

  switch (weather) {
    case WeatherCondition.SUNNY:
      weatherClassName = {
        primary:
          "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-yellow-600 dark:via-orange-700 dark:to-red-700",
        secondary:
          "bg-gradient-to-tl from-amber-300 via-transparent to-blue-400 dark:from-amber-600 dark:via-transparent dark:to-blue-600",
      };
      break;
    case WeatherCondition.CLOUDY:
      weatherClassName = {
        primary:
          "bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900",
        secondary:
          "bg-gradient-to-tl from-slate-300 via-transparent to-gray-500 dark:from-slate-600 dark:via-transparent dark:to-gray-700",
      };
      break;
    case WeatherCondition.RAINY:
      weatherClassName = {
        primary:
          "bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-900",
        secondary:
          "bg-gradient-to-tl from-cyan-400 via-transparent to-slate-600 dark:from-cyan-700 dark:via-transparent dark:to-slate-800",
      };
      break;
    case WeatherCondition.PARTLY_CLOUDY:
      weatherClassName = {
        primary:
          "bg-gradient-to-br from-blue-400 via-gray-500 to-yellow-500 dark:from-blue-700 dark:via-gray-700 dark:to-yellow-700",
        secondary:
          "bg-gradient-to-tl from-sky-300 via-transparent to-amber-400 dark:from-sky-600 dark:via-transparent dark:to-amber-600",
      };
      break;
  }

  return (
    <>
      {/* <div
        className={cn(
          "size-full fixed inset-0 pointer-events-none -z-[1] transition-all [transition:opacity_0.5s_ease_0s,scale_1s_cubic-bezier(0,0,0.2,1)_0.3s] opacity-0 scale-[10]",
          `absolute inset-0 transition-all duration-1000 ease-in-out`,
          weatherClassName.primary,
        )}
      ></div> */}
      <div className="size-full -z-[2] fixed inset-0 pointer-events-none">
        <div
          className={cn(
            `absolute inset-0 pointer-events-none transition-all [transition:opacity_0.5s_ease_0s,scale_3s_cubic-bezier(0,0,0.2,1)_0.3s] opacity-0 scale-[5] ${weatherClassName.primary}`,
            isCurrent ? "opacity-100 scale-[2]" : "opacity-0"
          )}
        />
        <div
          className={cn(
            `absolute inset-0 pointer-events-none transition-all [transition:opacity_0.5s_ease_0s,scale_3s_cubic-bezier(0,0,0.2,1)_0.3s] opacity-0 scale-[5] ${weatherClassName.secondary} opacity-70`,
            isCurrent ? "opacity-100 scale-[2]" : "opacity-0"
          )}
        />
      </div>
    </>
  );
}
