import moment, { Moment } from "moment"
import MainWeather from "../Common/MainWeather"
import ForecastItemResponse from "./ForecastItemReponse"

class ForecastItemProp {
    dt: Moment
    main: MainWeather
    weather: WeatherCondition[]
    dt_txt: number
    zonedDateTime: Moment

    constructor(forecastItemResponse: ForecastItemResponse, timezone: number) {
        this.dt = moment.unix(forecastItemResponse.dt * 1000)
        this.main = forecastItemResponse.main
        this.weather = forecastItemResponse.weather
        this.dt_txt = forecastItemResponse.dt_txt
        this.zonedDateTime = moment(forecastItemResponse.dt * 1000).utcOffset(timezone / 60)
    }

    getShortFormattedTime = (): string => {
        return this.zonedDateTime.format('hh A')
    }
}

export default ForecastItemProp