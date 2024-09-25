"use client";

import type { GetWeatherDataFromLocationSearch} from "@/hooks/api/useGetWeatherDataFromLocationSearch";
import { useGetWeatherDataFromLocationSearch } from "@/hooks/api/useGetWeatherDataFromLocationSearch";
import useLocationStore from "@/stores/useLocationStore";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { useState } from "react";


const IndexPage = () => {
  const [search, setSearch] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data: locationData } = useGetWeatherDataFromLocationSearch(debouncedSearch);
const { addLocationCard, locationCards } = useLocationStore()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowPopover(true); // Show popover when typing
  };

  const handleClickAdd = (searchData: GetWeatherDataFromLocationSearch) => {
    addLocationCard({
      id: searchData.location.place_id,
      displayName: searchData.location.display_name,
      lat: searchData.location.lat,
      lon: searchData.location.lon
    })
  }

  // const items = [
  //   {
  //     title: 'Extended Devviantex Adaptation →',
  //     description: "See what's extended from T3 App and what changes, how's project structure, and how to use all tools and lib.",
  //   },
  //   // Add 5 more objects here with different or same content
  //   {
  //     title: 'Another Devviantex Feature →',
  //     description: 'Explore new features and improvements in the latest release.',
  //   },
  //   {
  //     title: 'Devviantex Framework Overview →',
  //     description: 'An overview of the main components and libraries used in Devviantex.',
  //   },
  //   {
  //     title: 'Building with Devviantex →',
  //     description: 'Learn how to quickly build apps using Devviantex tools and templates.',
  //   },
  //   {
  //     title: 'Devviantex CLI Guide →',
  //     description: 'Master the command-line interface to speed up your development process.',
  //   },
  //   {
  //     title: 'Customizing Devviantex Projects →',
  //     description: 'Learn how to customize the framework according to your project needs.',
  //   },
  // ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1e3a8a] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          D² <span className="text-blue-300">Weather</span>
        </h1>

      {/* Input with popover */}
      <div className="relative max-w-[600px] w-full">
        <input
          className="text-red-500 w-full"
          placeholder="Enter something"
          value={search}
          onChange={handleChange}
        />

        {/* Popover for location data */}
        {showPopover && locationData && locationData.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-lg bg-white text-black shadow-lg z-50">
            {locationData.map((location, index) => (
              <p key={index} className="p-2 hover:bg-gray-200 cursor-pointer text-red-500" onClick={() => handleClickAdd(location)}>
                {location.location.display_name + location.weather.main.feels_like}
              </p>
            ))}
          </div>
        )}
      </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
      {locationCards.map((item, index) => (
        <div
          key={index}
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20 min-h-[360px]"
        >
          <h3 className="text-2xl font-bold">{item.displayName}</h3>
          <div className="text-lg">{item.id}</div>
        </div>
      ))}
    </div>
      </div>
    </main>
  );
};

export default IndexPage;
