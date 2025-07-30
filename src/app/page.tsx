"use client";

import { CardCurrentLocation } from "@/components/card/current-location/card-current-location";
import { SearchWeather } from "@/components/search-weather";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWeatherBg, WeatherCondition } from "@/hooks/use-weather-bg";
import { useState } from "react";
import { SearchCityResponse } from "./api/search-city/route";
import { getCurrentWeather } from "src/services/get-current-weather";
import { WeatherResponse } from "./api/weather/route";
import { CardDetailsLocation } from "@/components/card/details-location/card-details-location";

export default function RootPage() {
  const [searchLocation, setSearchLocation] = useState<WeatherResponse | null>(
    null
  );

  const handleSelect = (i: SearchCityResponse) => {
    getCurrentWeather({ lat: i.lat, lon: i.lon }).then(({ data, success }) => {
      if (!success) return;
      setSearchLocation(data);
    });
  };
  return (
    <>
      <div className="flex flex-col gap-2 size-full overflow-hidden">
        <CardCurrentLocation onLocationChange={(d) => setSearchLocation(d)} />
        <CardDetailsLocation data={searchLocation} />
        <SearchWeather handleSelect={handleSelect} />
      </div>
    </>
  );
}
