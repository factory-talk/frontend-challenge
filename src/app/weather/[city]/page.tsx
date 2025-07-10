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

    // const localTime = moment
    //     .unix(Math.floor(Date.now() / 1000) + timezoneOffset)
    //     .utc()
    //     .format("dddd, MMMM Do YYYY, HH:mm");

    return (
        <div className="bg-white p-6 rounded shadow">
            {/* <h1 className="text-2xl font-bold mb-2">{weather.name}</h1>
            <p> Temp: {weather.main.temp}°C</p>
            <p> Humidity: {weather.main.humidity}%</p>
            <p> {weather.weather[0].description}</p>
            <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="icon"
            />


            <h2 className="text-xl font-semibold mb-2">24-Hour Forecast</h2>
            */}

        </div>
    );
}
