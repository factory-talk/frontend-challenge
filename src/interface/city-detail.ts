import { ForecastData } from "./response/forecast-resp"
import { WeatherResp } from "./response/weather-resp"

export type CityDetail = {
    id: string
    lat: string
    lon: string
    display_place: string
    display_name: string
    country_code: string
    weather: WeatherResp
    forecast: ForecastData[]
}