"use client";

import { WeatherResponse } from "@/app/api/weather/route";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMyLocation } from "@/hooks/use-my-location";
import { MapPinIcon, MapPinOffIcon, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { getCurrentWeather } from "src/services/get-current-weather";

export function CardCurrentLocation({
  onLocationChange,
}: {
  onLocationChange: (v: WeatherResponse | null) => void;
}) {
  const { isLoading, details, isError, refreshLocation } = useMyLocation();
  const currentLocationName = details?.name ?? "Unknown";

  useEffect(() => {
    onLocationChange(details);
  }, [details]);
  return (
    <Card
      className="p-1 flex-row items-center gap-1 justify-start min-h-[46px] animate-in fade-in slide-in-from-top duration-500 shrink-0 cursor-pointer"
      loading={isLoading}
      key={`current-location-${isLoading ? "loading" : "loaded"}`}
      onClick={() => details && onLocationChange(details)}
    >
      {!isError ? (
        <MapPinIcon color="white" className="size-[1.5rem]" />
      ) : (
        <MapPinOffIcon color="white" className="size-[1.5rem]" />
      )}
      <span className="text-white text-xl font-extrabold">
        {currentLocationName}
      </span>
      <Button
        type="button"
        size={"icon"}
        className="ml-auto !glass-morphism !rounded-full xl:hover:scale-110 active:scale-110"
        onClick={(e) => {
          e.stopPropagation();
          refreshLocation();
        }}
      >
        <RefreshCw />
      </Button>
    </Card>
  );
}
