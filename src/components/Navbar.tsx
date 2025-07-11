"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type City = {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
};

export default function Navbar() {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<City[]>([]);
    const router = useRouter();

    const getCities = async (input: string) => {
        if (!input) return;

        try {
            const response = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
                params: {
                    q: input,
                    limit: 5,
                    appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY
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

    const selectCity = (city: City) => {
        setSearch(`${city.name}, ${city.country}`);
        setSuggestions([]);
        router.push(`/weather/${encodeURIComponent(city.name)}`);
    };


    return (
        <>
            <div className='h-[60px] w-full bg-gray-500 flex justify-center items-center gap-5'>

                <div className="p-3">
                    <div className="text-white cursor-pointer flex flex-col text-center leading-[0.5]" onClick={ ()=> { router.push('/') }}>
                        <span className="text-2xl">&#8962;</span>
                        <span>Home</span>
                    </div>
                </div>

                <div className="relative flex flex-grow justify-center items-center">
                    <input type="text" placeholder='Search for cities' value={search} onChange={searchCities}
                        className="block w-[80%] xl:w-[70%] 2xl:w-[60%] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />

                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 top-10 bg-white border mt-1 rounded shadow w-[80%] xl:w-[70%] 2xl:w-[60%] h-max-[200px] overflow-auto">
                            {suggestions.map((city, index) => (
                                <li
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                    onClick={() => { selectCity(city) }}>
                                    <span className="mr-2">-</span>  {city.name}, {city.country}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


            </div>
        </>)

};