import React from "react"
import WeatherItemProp from "src/interfaces/WeatherList/WeatherItemProp"

const WeatherItem = (weatherItemProps: WeatherItemProp) => {
    return (
        <>
            <div className="w-full grid grid-cols-4 grid-rows-2 py-2">
                <div className="px-4">{weatherItemProps.cityDispayName}</div>
                <div className="col-start-3 row-span-2 text-center">{weatherItemProps.weather[0].icon}</div>
                <div className="row-span-2 text-center">{weatherItemProps.main.temp}</div>
                <div className="px-4">{weatherItemProps.dt.getHours()}:{weatherItemProps.dt.getMinutes()}</div>
            </div>
        </>

    )
}

export default WeatherItem