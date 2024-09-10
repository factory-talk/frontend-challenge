import React from "react"
import WeatherItemProps from "../../interfaces/WeatherItemProps"

const WeatherItem = (weatherItemProps: WeatherItemProps) => {
    return (
        <>
            <div className="w-full grid grid-cols-4 grid-rows-2 py-2">
                <div className="px-4">{weatherItemProps.cityName}</div>
                <div className="col-start-3 row-span-2 text-center">{weatherItemProps.icon}</div>
                <div className="row-span-2 text-center">{weatherItemProps.temp}</div>
                <div className="px-4">{weatherItemProps.dateTime.getHours()}:{weatherItemProps.dateTime.getMinutes()}</div>
            </div>
        </>

    )
}

export default WeatherItem