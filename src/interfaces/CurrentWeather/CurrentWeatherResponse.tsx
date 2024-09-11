import Coordinate from "../Common/Coordinate"
import InternalParameter from "../Common/InternalParameter"
import MainWeather from "./MainWeather"

interface CurrentWeatherResponse {
    coord: Coordinate
    weather: WeatherCondition[]
    main: MainWeather
    dt: number
    timezone: number
    name: string
    sys: InternalParameter
}

export default CurrentWeatherResponse