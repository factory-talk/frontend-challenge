import Coordinate from "../Common/Coordinate"
import InternalParameter from "../Common/InternalParameter"
import CurrentWeatherResponse from "../CurrentWeather/CurrentWeatherResponse"
import MainWeather from "../CurrentWeather/MainWeather"

class WeatherItemProp {
    coord: Coordinate
    weather: WeatherCondition[]
    main: MainWeather
    dt: Date
    timezone: number
    name: string
    sys: InternalParameter
    cityDispayName: string

    constructor(currentWeather: CurrentWeatherResponse, cityDisplayname: string) {
        this.coord = currentWeather.coord
        this.dt = new Date(currentWeather.dt)
        this.main = currentWeather.main
        this.weather = currentWeather.weather
        this.timezone = currentWeather.timezone
        this.name = currentWeather.name
        this.sys = currentWeather.sys
        this.cityDispayName = cityDisplayname
    }
}

export default WeatherItemProp