import MainWeather from "../Common/MainWeather"

interface ForecastItemResponse {
    dt: number
    main: MainWeather
    weather: WeatherCondition[]
    dt_txt: number
}

export default ForecastItemResponse