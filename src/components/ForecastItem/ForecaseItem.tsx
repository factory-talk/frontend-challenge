import React from "react"
import ForecastItemProp from "src/interfaces/WeatherForecast/ForecastItemProp"

const ForecastItem = (forecastItemProp : ForecastItemProp) => {
    return (
        <div className="grid gap-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">{forecastItemProp.getShortFormattedTime()}</p>
            <img className="max-h-none" src={`https://openweathermap.org/img/wn/${forecastItemProp.weather[0].icon}@2x.png`} />
            <p className="text-gray-500 text-sm">{forecastItemProp.main.temp}</p>
        </div>
    )
}

export default ForecastItem