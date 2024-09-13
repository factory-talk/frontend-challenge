import Coordinate from "../Common/Coordinate"
import InternalParameter from "../Common/InternalParameter"
import MainWeather from "../Common/MainWeather"
import Rain from "./Rain"

interface CurrentWeatherResponse {
    coord: Coordinate
    weather: WeatherCondition[]
    main: MainWeather
    dt: number
    timezone: number
    name: string
    sys: InternalParameter
    wind: Wind
    rain: Rain
}

export default CurrentWeatherResponse