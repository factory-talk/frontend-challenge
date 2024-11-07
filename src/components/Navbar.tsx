"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const Navbar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [countryCode, setCountryCode] = useState("TH");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        );
        const data = await response.json();

        // ตรวจสอบว่า features มีข้อมูลก่อนที่จะค้นหาประเทศ
        const countryFeature = data.features?.find(
          (feature: any) => feature.place_type?.includes("country")
        );

        if (countryFeature) {
          setCountryCode(countryFeature.properties.short_code.toUpperCase());
        }
      } catch (error) {
        console.error("Error fetching country code:", error);
      }
    });
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length > 0) {
        const isZipCode = /^\d+$/.test(debouncedSearchTerm);
        if (isZipCode) {
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?zip=${debouncedSearchTerm},${countryCode}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
            );
            const data = await response.json();
            if (data.name) setSuggestions([data.name]);
          } catch (error) {
            console.error("Error fetching by Zip Code:", error);
          }
        } else {
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                debouncedSearchTerm
              )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&types=place&limit=5`
            );
            const data = await response.json();
            const places = data.features?.map((feature: any) => feature.place_name) || [];
            setSuggestions(places);
          } catch (error) {
            console.error("Error fetching city names:", error);
          }
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchTerm, countryCode]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const addToFavorites = (city: string) => {
    const existingFavorites = JSON.parse(localStorage.getItem("favoriteCities") || "[]");
    if (!existingFavorites.includes(city)) {
      const updatedFavorites = [...existingFavorites, city];
      localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
      toast.success(`"${city}" has been added to favorites!`, { autoClose: 2000 });
      window.dispatchEvent(new Event("favoritesUpdated"));
    } else {
      toast.info(`"${city}" is already in your favorites.`, { autoClose: 2000 });
    }
    setSearchTerm("");
    setSuggestions([]);
  };

  const goToDetail = (city: string) => {
    router.push(`/details/${encodeURIComponent(city)}`);
  };

  return (
    <nav className="bg-gray-800 p-4 relative">
      <ToastContainer />
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">LOGO</div>
        <div className="relative flex-1 md:flex md:items-center">
          <input
            type="text"
            placeholder="Search city or Zip"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:w-auto px-3 py-1 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-1 bg-white shadow-lg rounded-md w-full max-w-xs md:max-w-sm z-10">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between px-4 py-2">
                  <div
                    className="text-gray-700 hover:text-blue-500 cursor-pointer flex items-center"
                    onClick={() => goToDetail(suggestion)}
                  >
                    <FaMapMarkerAlt className="text-blue-500 mr-2" /> {suggestion}
                  </div>
                  <button
                    data-testid="add-favorite-icon"
                    onClick={() => addToFavorites(suggestion)}
                    className="text-blue-500 hover:text-blue-700 text-lg"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
