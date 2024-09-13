import React from "react"
import ForecastItemProp from "src/interfaces/WeatherForecast/ForecastItemProp"

const ForecastItem = (forecastItemProp : ForecastItemProp) => {
    console.log(forecastItemProp)
    return (
        <div className="grid gap-1">
            <p className="text-gray-500 text-sm">{forecastItemProp.getShortFormattedTime()}</p>
            <img className="max-h-none flex items-center justify-center" src={`https://openweathermap.org/img/wn/${forecastItemProp.weather[0].icon}@2x.png`} />
            <p className="text-gray-500 text-sm">{forecastItemProp.main.temp}</p>
        </div>
    )
}

export default ForecastItem