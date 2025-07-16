import axios from "axios"
import { ForecastResp } from "@/interface/response/forecast-resp"
import { APP_CONFIG } from "@/config/app.config"

interface GetForecastProp {
    lat: string
    lon: string
    units: string
    cnt: string
}

export const getForecast = async (query: GetForecastProp) => {
    const url = APP_CONFIG.NEXT_PUBLIC_FORECAST_URL
    const params = new URLSearchParams({
        appid: APP_CONFIG.NEXT_PUBLIC_APPID || '',
        ...query
    }).toString();

    const result = await axios.get<ForecastResp>(`${url}?${params}`)
    return result.data.list
}