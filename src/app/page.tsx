"use client";
import { useState } from 'react';
import axios from 'axios';

const API_KEY = "193b24b56b979e191c35c2ce30c0780e";
type City = {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<City[]>([]);

  const getCities = async (input: string) => {
    if (!input) return;

    try {
      const response = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
        params: {
          q: input,
          limit: 5,
          appid: API_KEY,
        },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  const searchCities = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearch(input);
    getCities(input);
  };

  return (
    <>

      <div className='h-[60px] flex justify-center items-center bg-gray-500 relative'>
        <input type="text" placeholder='Search for cities' value={search} onChange={searchCities}
          className="block w-[80%] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />

        {suggestions.length > 0 && (
          <ul className="absolute z-10 top-10 bg-white border mt-1 rounded shadow w-[80%] h-max-[200px] overflow-auto">
            {suggestions.map((city, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => {
                  setSearch(`${city.name}, ${city.country}`);
                  setSuggestions([]);
                }}>
                <span className="mr-2">-</span>  {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}


      </div>


    </>
  );
}
