import ForecastItem from "../ForecastItem"
import { useEffect, useState } from "react"
import Coordinate from "src/interfaces/Common/Coordinate"
import ForecastItemProp from "src/interfaces/WeatherForecast/ForecastItemProp"
import ForecastResponse from "src/interfaces/WeatherForecast/ForecastResponse"

const ForecastList = (coord: Coordinate) => {

    const [forecasts, setForecasts] = useState<ForecastItemProp[]>([])

    useEffect( () => {
        setForecasts([])
        fetchForecast(coord.lat, coord.lon, 6)
    }, [coord])

    const fetchForecast = async (lat: number, lon: number, cnt: number): Promise<void> => {
        const forecastListRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=${cnt}&units=metric&appid=282135a6d4fac07bf00741f384ae42b8`)
        const forecastList: ForecastResponse = await forecastListRes.json()
        forecastList.list.forEach( forecast => {
            setForecasts((prevForecast) => [...prevForecast, new ForecastItemProp(forecast, forecastList.timezone)])
        })
    }

    return (
        <>
            <div className="text-xs m-4 text-gray-500">24 Hours Forecast</div>
            <div className="grid grid-cols-6 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-5 text-center">
                {
                    forecasts.length > 0 && forecasts.slice(0, 6).map((props, index) => (
                        <ForecastItem key={index} {...props}  />
                    ))
                }
            </div>
        </>
    )
}

export default ForecastList