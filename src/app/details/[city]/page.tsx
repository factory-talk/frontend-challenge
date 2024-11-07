"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "src/components/Navbar";
import TemperatureDisplay from "src/components/TemperatureDisplay";
import TemperatureUnitSelector from "src/components/TemperatureUnitSelector";

export default function Details() {
  const router = useRouter();
  const { city } = useParams(); // รับพารามิเตอร์ `city` จาก URL
  const [weatherData, setWeatherData] = useState<any>(null);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<"C" | "F" | "K">("C");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        if (!response.ok) throw new Error("Failed to fetch weather data");
        const data = await response.json();

        setWeatherData({
          city: data.name,
          temperature: Math.round(data.main.temp),
          minTemp: Math.round(data.main.temp_min),
          maxTemp: Math.round(data.main.temp_max),
          description: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          pressure: data.main.pressure,
        });

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        if (!forecastResponse.ok) throw new Error("Failed to fetch forecast data");
        const forecastData = await forecastResponse.json();
        setHourlyForecast(forecastData.list.slice(0, 8));

      } catch (error) {
        setError("Could not fetch weather data.");
      }
    };
    fetchWeatherData();
  }, [city]);

 
  return (
    <main>
      <Navbar />
      <div className="container mx-auto mt-6">
   {/* ปุ่มสำหรับเปลี่ยนหน่วยอุณหภูมิ */}
   <TemperatureUnitSelector selectedUnit={temperatureUnit} onUnitChange={setTemperatureUnit} />



        {weatherData ? (
          <div className="detail-w">
            <div className="detail-head">
              <h1 className="text-2xl font-bold">{weatherData.city}</h1>
              <h6 className="text-gray-600 text-1l" data-testid="min-max-temp">
              Min <TemperatureDisplay temperature={weatherData.minTemp} unit={temperatureUnit} />, Max <TemperatureDisplay temperature={weatherData.maxTemp} unit={temperatureUnit} />
              </h6>
            </div>
            <div className="detail-c">
              <img src={weatherData.icon} alt="Weather Icon" className="w-10 h-10 rounded-full" />
              <h1 className="text-6xl font-bold"><TemperatureDisplay temperature={weatherData.temperature} unit={temperatureUnit} /></h1>
              <h6 className="text-base">{weatherData.description.toUpperCase()}</h6>
            </div>

             <div className="detail-24h mt-6" >
              <h1 className="text-base font-bold text-gray-400">24 Hour Forecast</h1>
                   {/* แสดงข้อมูลพยากรณ์ทุก 3 ชั่วโมง */}

              <div   className="detail-row flex overflow-x-scroll space-x-4">
                {hourlyForecast.map((hour, index) => (
                  
                  <div  key={index}  data-testid="forecast-item" className="detail-cel text-center" >
                    <h6 className="text-xs">{new Date(hour.dt * 1000).getHours()}:00</h6>
                    <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} alt="Weather Icon" className="w-10 h-10 mx-auto" />
                    <h4 className="text-base font-bold"> <TemperatureDisplay temperature={Math.round(hour.main.temp)} unit={temperatureUnit} ></TemperatureDisplay></h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-card-current mt-4" data-testid="main-temperature">
              <h1 className="text-1l font-bold text-gray-400">Current</h1>
              <div className="detail-weather">
                <div className="weather-item">
                  <span className="label">Humidity:</span>
                  <span className="value">{weatherData.humidity}%</span>
                </div>
                <div className="weather-item">
                  <span className="label">Wind Speed:</span>
                  <span className="value">{weatherData.windSpeed} m/s</span>
                </div>
                <div className="weather-item">
                  <span className="label">Pressure:</span>
                  <span className="value">{weatherData.pressure}hPa</span>
                </div>
                <div className="weather-item">
                  <span className="label">Chance of Rain:</span>
                  <span className="value">{hourlyForecast[0]?.pop * 100 || 0}%</span>
                </div>
              </div>
            </div>

<hr/>
<button onClick={() => router.back()} className="text-blue-500 underline">
        ← Back
      </button>
      

          </div>
         ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
}
