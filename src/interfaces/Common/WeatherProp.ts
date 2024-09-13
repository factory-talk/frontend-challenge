import Coordinate from "./Coordinate"
import InternalParameter from "./InternalParameter"
import CurrentWeatherResponse from "../CurrentWeather/CurrentWeatherResponse"
import MainWeather from "./MainWeather"
import moment, { Moment } from "moment"
import Rain from "../CurrentWeather/Rain"

class WeatherProp {
    coord: Coordinate
    weather: WeatherCondition[]
    main: MainWeather
    dt: Moment
    timezone: number
    name: string
    sys?: InternalParameter
    cityDisplayName: string
    zonedDateTime: Moment
    wind: Wind
    rain: Rain

    constructor(
        cityDisplayName: string,
        currentWeather?: CurrentWeatherResponse
    ) {
        if (currentWeather) {
            this.coord = currentWeather.coord
            this.dt = moment.unix(currentWeather.dt * 1000)
            this.main = currentWeather.main
            this.weather = currentWeather.weather
            this.timezone = currentWeather.timezone
            this.name = currentWeather.name
            this.sys = currentWeather.sys
            this.cityDisplayName = cityDisplayName
            this.zonedDateTime = moment(currentWeather.dt * 1000).utcOffset(currentWeather.timezone / 60)
            this.wind = currentWeather.wind
            this.rain = currentWeather.rain
        } else {
            this.coord = { lat: 0, lon: 0 }
            this.dt = moment(new Date())
            this.timezone = 0 
            this.name = ""
            this.weather = [{id: 0, main: "", description: "", icon: "01d"}]
            this.main = { temp: 0, feels_like: 0, temp_min: 0, temp_max: 0, pressure: 1010, humidity: 0, sea_level: 0, grnd_level: 0 }
            this.cityDisplayName = cityDisplayName
            this.zonedDateTime = moment(new Date())
            this.wind = {speed: 0, deg: 0 , gust: 0}
            this.rain = {"1h": 0, "3h": 0}
        }
    }

    getFormattedDate = (): string => {
        return this.zonedDateTime
            .format('dddd, DD MMMM YYYY')
    }

    getFormattedTime = (): string => {
        return this.zonedDateTime
            .format('hh:mm A')
    }
}

export default WeatherProp