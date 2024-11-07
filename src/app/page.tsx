"use client";
import { useEffect, useState } from "react";
import Navbar from "src/components/Navbar";
import Link from "next/link";
import TemperatureDisplay from "src/components/TemperatureDisplay";
import TemperatureUnitSelector from "src/components/TemperatureUnitSelector";
import { FaTrash } from "react-icons/fa";

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [temperatureUnit, setTemperatureUnit] = useState<"C" | "F" | "K">("C");
  const [favoriteCities, setFavoriteCities] = useState<string[]>([]);
  const [favoriteWeatherData, setFavoriteWeatherData] = useState<any>({});

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteCities") || "[]");
    setFavoriteCities(storedFavorites);

    const handleFavoritesUpdated = () => {
      const updatedFavorites = JSON.parse(localStorage.getItem("favoriteCities") || "[]");
      setFavoriteCities(updatedFavorites);
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
    };
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          setError("Location permission denied.");
        }
      );
    } else {
      setError("Geolocation not available.");
    }
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (location) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=${unit}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
          );
          if (!response.ok) throw new Error("Failed to fetch weather data");
          const data = await response.json();
          setWeatherData({
            city: data.name,
            temperature: data.main.temp,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            timezoneOffset: data.timezone,
          });
        } catch (error) {
          setError("Could not fetch weather data.");
        }
      }
    };
    fetchWeatherData();
  }, [location, unit]);

  useEffect(() => {
    const fetchFavoriteWeatherData = async () => {
      const updatedData: any = {};
      for (const city of favoriteCities) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
          );
          if (response.ok) {
            const data = await response.json();
            updatedData[city] = {
              city: data.name,
              temperature: data.main.temp,
              icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
              timezoneOffset: data.timezone,
            };
          }
        } catch (error) {
          console.error("Could not fetch weather data for", city);
        }
      }
      setFavoriteWeatherData(updatedData);
    };

    if (favoriteCities.length > 0) {
      fetchFavoriteWeatherData();
    }
  }, [favoriteCities, unit]);

  const getLocalTime = (timezoneOffset: number) => {
    const utcTime = new Date();
    const utcTimestamp = utcTime.getTime() + utcTime.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTimestamp + timezoneOffset * 1000);
    return localTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  const deleteCity = (city: string) => {
    const updatedCities = favoriteCities.filter((c) => c !== city);
    setFavoriteCities(updatedCities);
    localStorage.setItem("favoriteCities", JSON.stringify(updatedCities));
  };

  const deleteAllCities = () => {
    setFavoriteCities([]);
    localStorage.removeItem("favoriteCities");
  };

  return (
    <main>
      <div>
        <Navbar />
        <div className="container mx-auto mt-6">
          <TemperatureUnitSelector selectedUnit={temperatureUnit} onUnitChange={setTemperatureUnit} />
      

          {weatherData?.city ? (
            <Link href={`/details/${weatherData.city}`}>
              <div className="card-city">
                <div className="card-left">
                  <h1 className="text-2xl font-bold">{weatherData.city}</h1>
                  <h6 className="text-gray-600 text-1l">{getLocalTime(weatherData.timezoneOffset)}</h6>
                </div>
                <div className="card-right">
                  {weatherData.icon ? (
                    <img src={weatherData.icon} alt="Weather Icon" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-400 rounded-full circle-city"></div>
                  )}
                  <h1 className="text-2xl font-bold">
                    <TemperatureDisplay temperature={Math.round(weatherData.temperature) ?? "--"} unit={temperatureUnit} />
                  </h1>
                </div>
              </div>
            </Link>
          ) : (
            <p>Loading weather data...</p>
          )}

          {favoriteCities.length > 0 && (
            <div className="mt-6">
              <h1>Favorite Place</h1>
              {favoriteCities.map((city, index) => (
                <div key={index} className="card-city flex justify-between items-center">
                  <Link href={`/details/${city}`}>
                    <div className="card-left">
                      <h1 className="text-2xl font-bold">{city}</h1>
                      <h6 className="text-gray-600 text-1l">
                        {favoriteWeatherData[city] ? getLocalTime(favoriteWeatherData[city].timezoneOffset) : "Unknown Time"}
                      </h6>
                    </div>
                  </Link>
                  <div className="card-right">
                    {favoriteWeatherData[city]?.icon ? (
                      <img src={favoriteWeatherData[city].icon} alt="Weather Icon" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-400 rounded-full circle-city"></div>
                    )}
                    <h1 className="text-2xl font-bold ml-4">
                      <TemperatureDisplay temperature={Math.round(favoriteWeatherData[city]?.temperature) ?? "--"} unit={temperatureUnit} />
                    </h1>
                    <button onClick={() => deleteCity(city)} className="text-red-500 hover:text-red-700 ml-2">
                     ❌
                  </button>
                  </div>
                 
                </div>
              ))}
            </div>
          )}
    
          <hr />
          <button  onClick={deleteAllCities} className="mb-4 p-2 text-red-400 rounded delete-btn">
          <FaTrash /> Delete all

          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </main>
  );
}
