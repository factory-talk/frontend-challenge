
import { useSearchParams } from "next/navigation"
import ForcastList from "../ForcastList"
import WeatherDetailQueryParam from "src/interfaces/WeatherDetail/WeatherDetailQueryParam"
import CurrentWeatherResponse from "src/interfaces/CurrentWeather/CurrentWeatherResponse"
import WeatherProp from "src/interfaces/Common/WeatherProp"
import { useEffect, useState } from "react"
import Link from "next/link"

const WeatherDetail = () => {
    const searchParams = useSearchParams()
    const [currentWeather, setCurrentWeather] = useState<WeatherProp>(new WeatherProp(""))

    useEffect(() => {
        const weatherDetailQueryParam: WeatherDetailQueryParam = new WeatherDetailQueryParam(searchParams.get("lat"), searchParams.get('lon'), searchParams.get('cityDisplayName'))
        fetchCurrentWeather(weatherDetailQueryParam.lat, weatherDetailQueryParam.lon, weatherDetailQueryParam.cityDisplayName)
    }, [])

    const fetchCurrentWeather = async (lat: number, lon: number, cityDisplayName: string): Promise<void> => {
        const weatherRes = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=282135a6d4fac07bf00741f384ae42b8")
        const weather: CurrentWeatherResponse = await weatherRes.json()
        setCurrentWeather(new WeatherProp(cityDisplayName, weather))
    }

    return (
        <>
            <Link href="/">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </Link>
            <div className="grid grid-rows-3 m-2">
                <h1 className="text-3xl font-bold">{currentWeather.cityDisplayName}</h1>
                <p className="text-base font-bold">{currentWeather.getFormattedDate()} </p>
                <p className="text-gray-500 text-sm">Min {Math.ceil(currentWeather.main.temp_min)}°, Max {Math.ceil(currentWeather.main.temp_max)}°</p>
            </div>
            <div className="grid place-items-center">
                <img className="max-h-none flex items-center justify-center" src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} />
                <span className="text-8xl md:text-9xl font-bold">{Math.ceil(currentWeather.main.temp)}°</span>
                <p className="text-xl mt-2">{currentWeather.weather[0].main}</p>
            </div>
            <ForcastList {...currentWeather.coord} />
            <div className="grid grid-cols-2 gap-4 bg-white m-5">
                <div className="text-center">
                    <p className="text-gray-500">Humidity</p>
                    <p className="font-bold">{currentWeather.main.humidity}%</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-500">Wind Speed</p>
                    <p className="font-bold">{currentWeather.wind.speed} m/s</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-500">Pressure</p>
                    <p className="font-bold">{currentWeather.main.pressure} hPa</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-500">Rain Volumn (1 Hours)</p>
                    <p className="font-bold">{currentWeather.rain["1h"]} mm</p>
                </div>
            </div>
        </>
    )
}

export default WeatherDetail