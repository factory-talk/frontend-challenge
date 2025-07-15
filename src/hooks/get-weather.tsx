import axios from "axios"
import { WeatherResp } from "@/interface/response/weather-resp"
import { APP_CONFIG } from "@/config/app.config"
import { Units } from "@/interface/units"

interface GetWeatherProp {
    lat: string
    lon: string
    units: Units
}

export const getWeather = async (query: GetWeatherProp) => {
    const url = APP_CONFIG.NEXT_PUBLIC_WEATHER_URL
    const params = new URLSearchParams({
        appid: APP_CONFIG.NEXT_PUBLIC_APPID || '07318e34fb59a790b30ba1a3caa8c851',
        ...query
    }).toString();

    const result = await axios.get<WeatherResp>(`${url}?${params}`)
    return result.data
}