import { ForecastData } from "./response/forecast-resp"
import { WeatherResp } from "./response/weather-resp"


export type WeatherDetail = {
    id: string
    weather: WeatherResp
    forecast: ForecastData[]
}