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
        appid: APP_CONFIG.NEXT_PUBLIC_APPID || '07318e34fb59a790b30ba1a3caa8c851',
        ...query
    }).toString();

    const result = await axios.get<ForecastResp>(`${url}?${params}`)
    return result.data.list
}