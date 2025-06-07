"use client";

import { Loader, SearchIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import useFetch from "./hook/useFetch";
import type { GeocodingLocation, GeocodingResponse } from "./type";
import { Combobox } from "@/components/components/ui/custom/combobox";
import { ComboboxDemo } from "@/components/components/ui/custom/comboboxDemo";
import { CityCard } from "./(home)/components/CityCard";
import { useRouter } from "next/navigation";
import { Backdrop } from "@/components/components/ui/backdrop";

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
      {/* <Backdrop open={open} onClose={handleOpen} variant="blur">
        <div className="animate-pulse">
          <Loader className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Backdrop> */}
      {/* <h1 className="text-3xl font-bold bg-blue-200 p-4">Tailwind is working</h1> */}

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
      {/* <ComboboxDemo/> */}
    </main>
  );
}

{
  /* {loading && <p className="text-sm text-muted">Loading...</p>}
        {error && <p className="text-sm text-red-500">Error fetching data.</p>}
        {weatherData && weatherData.length > 0 && (
          <ul className="space-y-2 text-left text-sm mt-4">
            {weatherData.map((item, idx) => (
              <li
              onClick={()=>{
                setCityName(item.name)
                console.log(item.name)}}
              key={idx}>
              
                📍 <strong>{item.name}</strong>, {item.country} — lat: {item.lat}, lon: {item.lon}
              </li>
            ))}
          </ul>
        )} */
}
