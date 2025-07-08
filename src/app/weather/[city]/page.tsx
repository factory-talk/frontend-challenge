// src/app/weather/[city]/page.tsx
import axios from "axios";

type WeatherResponse = {
    name: string;
    main: { temp: number; humidity: number };
    weather: { description: string; icon: string }[];
};

export default async function WeatherDetail({ params }: { params: { city: string } }) {
    const res = await axios.get<WeatherResponse>("https://api.openweathermap.org/data/2.5/weather", {
        params: {
            q: params.city,
            units: "metric",
            appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY
        },
    });
    const weather = res.data;

    return (
        <div className="bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-2">{weather.name}</h1>
            <p>🌡 Temp: {weather.main.temp}°C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>☁️ {weather.weather[0].description}</p>
            <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="icon"
            />
        </div>
    );
}
