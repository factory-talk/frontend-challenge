import Link from "next/link"
import React from "react"
import { IMAGE_API } from "src/config/api"
import WeatherProp from "src/interfaces/Common/WeatherProp"
import WeatherDetailQueryParam from "src/interfaces/WeatherDetail/WeatherDetailQueryParam"
import WeatherItemProp from "src/interfaces/WeatherList/WeatherItemProp"

const WeatherItem: React.FC<WeatherItemProp> = ({ removeWeatherItemProp, weatherProp }) => {

    const buildQueryParam = (weatherProp: WeatherProp): string => {
        const weatherQuery: WeatherDetailQueryParam = new WeatherDetailQueryParam(weatherProp.coord.lat.toString(), weatherProp.coord.lon.toString(), weatherProp.cityDisplayName)
        const urlQuery: string = new URLSearchParams(weatherQuery as any).toString()
        return `/detail?${urlQuery}`
    }

    const handleRemoveWeatherItem = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        removeWeatherItemProp(weatherProp.name)
    }

    return (
        <>
            <div className="w-full flex py-2 border-b border-slate-600 hover:bg-gray-100 cursor-pointer">
                <Link href={buildQueryParam(weatherProp)} className="flex w-11/12">
                    <div className="w-7/12 sm:w-10/12">
                        <div className="px-4 flex w-full text-2xl md:text-4xl font-bold">{weatherProp.name}, {weatherProp.cityDisplayName}</div>
                        <div className="px-4 flex">{weatherProp.getFormattedTime()}</div>
                    </div>
                    <div className="w-4/12 sm:w-1/12">
                        <img className="max-h-none items-center justify-center" src={`${IMAGE_API}/img/wn/${weatherProp.weather[0].icon}@2x.png`} />
                    </div>
                    <div className="w-1/12 sm:w-1/12">
                        <span className="text-3xl min-h-full flex items-center justify-center">{Math.ceil(weatherProp.main.temp)}°C</span>
                    </div>
                </Link>
                <div className="flex justify-end w-1/12">
                    <div onClick={handleRemoveWeatherItem} className="cursor-pointer mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </>

    )
}

export default WeatherItem