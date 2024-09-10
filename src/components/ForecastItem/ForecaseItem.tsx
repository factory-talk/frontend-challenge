import React from "react"
import ForecastItemProps from "../../interfaces/ForecastItemProps"

const ForecastItem = (forecastItemProps : ForecastItemProps) => {
    return (
        <div className="grid gap-1">
            <p className="text-gray-500 text-sm">{forecastItemProps.dateTime.getHours()}</p>
            <div className="text-md">{forecastItemProps.icon}</div>
            <p className="text-gray-500 text-sm">{forecastItemProps.temp}</p>
        </div>
    )
}

export default ForecastItem