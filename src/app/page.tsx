"use client";

import { useEffect, useState, useRef } from "react";
import useFetch from "./hook/useFetch";
import type { GeocodingLocation, GeocodingResponse } from "./type";
import { Combobox } from "@/components/components/ui/custom/combobox";
import { CityCard } from "./(home)/components/CityCard";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedCities, setSelectedCities] = useState<GeocodingLocation[]>([]);
  const [open, setOpen] = useState(false);
  const lastFetchedText = useRef("");
  const isZipCode = /^\d+$/.test(searchText.trim()); // check if numeric

  const weatherFetch = useFetch<GeocodingResponse>("/api/city", { q: " " });
  // #TODO find api to return array of zipcodes
  // const zipFetch = useFetch<ZipcodeResponse>('/api/zipcode', { zip: 90035 })
  // const activeFetch = isZipCode ? zipFetch : weatherFetch
  const activeFetch = weatherFetch;
  const { data: weatherData, loading, error, refetchWithParams } = activeFetch;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = searchText.trim();
      const shouldFetch =
        trimmed.length >= 1 && trimmed !== lastFetchedText.current;

      if (shouldFetch) {
        lastFetchedText.current = trimmed;
        refetchWithParams(isZipCode ? { zip: trimmed } : { q: trimmed });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchText, refetchWithParams]);

  const handleAddCity = (city: GeocodingLocation) => {
    const exists = selectedCities.some(
      (c) => c.name === city.name && c.lat === city.lat && c.lon === city.lon
    );
    if (!exists) {
      setSelectedCities((prev) => [...prev, city]);
    } else {
      window.alert("City already added");
    }
  };

  const handleRemoveCity = (city: GeocodingLocation) => {
    setSelectedCities((prev) =>
      prev.filter(
        (c) =>
          !(c.name === city.name && c.lat === city.lat && c.lon === city.lon)
      )
    );
  };

  const handleClickCity = (city: GeocodingLocation) => {
    router.push(`/weather/${city.name}`);
    console.log(city.name);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 md:px-8 py-8 bg-gradient-to-br from-muted to-background flex flex-col items-center">
      <div
        className=" w-full max-w-xs sm:max-w-sm md:max-w-md space-y-4 border-2 border-primary rounded-lg hover:border-accent"
        onClick={handleOpen}
      >
        <Combobox<GeocodingLocation>
          onSearchChange={setSearchText}
          onSelectOption={handleAddCity}
          options={weatherData ?? []}
          getLabel={(item) => `${item?.name}, ${item?.country}`}
          getKey={(item) => `${item?.name}-${item?.lat}-${item?.lon}`}
        />
      </div>

      <div className=" mt-6 grid grid-cols-1 gap-4 w-full max-w-md">
        {selectedCities.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            No cities added. Start searching above.
          </p>
        )}

        {selectedCities.map((city, idx) => (
          <CityCard
            key={`${city.name}-${idx}`}
            item={city}
            onDelete={() => handleRemoveCity(city)}
            onClickCity={() => handleClickCity(city)}
          />
        ))}
      </div>
    </main>
  );
}

