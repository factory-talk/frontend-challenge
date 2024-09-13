import Link from "next/link"
import React from "react"
import WeatherProp from "src/interfaces/Common/WeatherProp"
import WeatherDetailQueryParam from "src/interfaces/WeatherDetail/WeatherDetailQueryParam"

const WeatherItem = (weatherItemProps: WeatherProp) => {

    const buildQueryParam = (weatherProp: WeatherProp) : string => {
        const weatherQuery: WeatherDetailQueryParam = new WeatherDetailQueryParam(weatherProp.coord.lat.toString(), weatherProp.coord.lon.toString(), weatherProp.cityDisplayName)
        const urlQuery: string = new URLSearchParams(weatherQuery as any).toString()
        return `/detail?${urlQuery}`
    }

    return (
        <Link href={buildQueryParam(weatherItemProps)}>
            <div className="w-full grid grid-cols-5 sm:grid-cols-12 grid-rows-2 py-2 border-b border-slate-600 hover:bg-gray-100 cursor-pointer">
                <div className="px-4 col-span-2 sm:col-span-3 text-2xl md:text-4xl font-bold">{weatherItemProps.cityDisplayName}</div>
                <img className="max-h-none row-span-2 col-start-4 sm:col-start-11 flex items-center justify-center" src={`https://openweathermap.org/img/wn/${weatherItemProps.weather[0].icon}@2x.png`} />
                <span className="row-span-2 text-3xl min-h-full flex items-center justify-center">{Math.ceil(weatherItemProps.main.temp)}°C</span>
                <div className="px-4 col-span-2">{weatherItemProps.getFormattedTime()}</div>
            </div>
        </Link>

    )
}

export default WeatherItem