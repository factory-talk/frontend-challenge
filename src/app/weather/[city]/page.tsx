"use client"
import axios from "axios";
import moment from "moment";
import { useState, useEffect } from "react";

type WeatherModel = {
    name: string;
    wind: { speed: number };
    rain: { '1h': number };
    sys: { country: string };
    weather: { main: string; description: string; icon: string; }[];
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
        feels_like: number;
        grnd_level: number;
        humidity: number;
        pressure: number;
        sea_level: number;
    };
};

type ForecastModel = {
    dt: number;
    weather: { main: string; description: string; icon: string; }[];
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
        feels_like: number;
        grnd_level: number;
        humidity: number;
        pressure: number;
        sea_level: number;
    };
};

type ForecastResponse = {
    list: ForecastModel[];
    city: { timezone: number };
};

export default function WeatherDetail({ params }: { params: { city: string } }) {
    const [weathers, setWeather] = useState<WeatherModel | null>(null);
    const [forecasts, setForecast] = useState<ForecastModel[]>([]);
    const [timezone, setTimezone] = useState<number>(0);

    useEffect(() => {
        console.log("params.city:", params.city); // ตรวจว่าเปลี่ยนไหม
        const initWeather = async () => {
            try {
                const weatherRespon = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
                    params: {
                        q: params.city,
                        units: "metric",
                        appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY
                    },
                });

                const forecastRespon = await axios.get<ForecastResponse>("https://api.openweathermap.org/data/2.5/forecast", {
                    params: {
                        q: params.city,
                        units: "metric",
                        appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY
                    },
                });

                setWeather(weatherRespon.data);

                const responForecast = forecastRespon.data;
                setForecast(responForecast.list.slice(0, 8));
                setTimezone(responForecast.city.timezone);
            }
            catch (err) {
                console.log("init weather failed.", err)
            }

        }
        initWeather();

    }, [params.city]);

    const localTime = moment
        .unix(Math.floor(Date.now() / 1000) + timezone)
        .utc()
        .format("dddd, Do MMMM YYYY , HH:mm");

    return (
        <div className="bg-white p-6 rounded shadow">

            <div className="flex flex-col leading-[0.5]">
                <h1 className="text-2xl font-bold mb-2">&#128205; {weathers?.name}, {weathers?.sys?.country} ({weathers?.weather[0]?.main})</h1>
                <h2>{localTime}</h2>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex flex-col justify-start leading-[0.5]">
                    <h2 className="text-2xl font-bold mt-5 mb-2">&#127777; {weathers?.main?.temp}°C</h2>
                    <span>{weathers?.weather[0]?.description}</span>
                </div>
                <img src={`https://openweathermap.org/img/wn/${weathers?.weather[0]?.icon}@2x.png`} alt="icon" />
            </div>

            <div className="flex">
                <h2 className="text-2xl font-bold mt-5 mb-2">Current Detail :</h2>
            </div>

            <div className="grid 2xl:grid-cols-6 xl:grid-col-3 md:grid-cols-2 grid-cols-1 gap-3">
                <div className="bg-white rounded shadow-xl p-3 h-[150px] flex flex-col items-center justify-center border-t-8">
                    <span className="font-bold">&#8595; {weathers?.main?.temp_min}°</span>
                    <span>Min Temperature</span>
                </div>
                <div className="bg-white rounded shadow-xl p-3 h-[150px] flex flex-col items-center justify-center border-t-8">
                    <span className="font-bold">&#8593; {weathers?.main?.temp_max}°</span>
                    <span>Max Temperature</span>
                </div>
                <div className="bbg-white rounded shadow-xl p-3 h-[150px] flex flex-col items-center justify-center border-t-8">
                        <span className="font-bold">&#128167; {weathers?.main?.humidity}%</span>
                        <span>Humidity</span>
                </div>
                <div className="bbg-white rounded shadow-xl p-3 h-[150px] flex flex-col items-center justify-center border-t-8">
                        <span className="font-bold">&#9202; {weathers?.main?.pressure}hPa</span>
                        <span>Pressure</span>
                </div>
                <div className="bbg-white rounded shadow-xl p-3 h-[150px] flex flex-col items-center justify-center border-t-8">
                    <div className="flex flex-col">
                        <span className="font-bold">&#127811; {weathers?.wind?.speed}m/s</span>
                        <span>Wind Speed</span>
                    </div>
                </div>
                <div className="bbg-white rounded shadow-xl p-3 h-[150px] flex flex-col items-center justify-center border-t-8">
                    <div className="flex flex-col">
                        <span className="font-bold">&#9748; {weathers?.rain?.["1h"]}mm</span>
                        <span>Rain Volume</span>
                    </div>
                </div>
            </div>


        </div>
    );
}
