import ForecastItemProp from "./ForecastItemProp"
import ForecastItemResponse from "./ForecastItemReponse"

interface ForecastResponse {
    cnt: number
    list: ForecastItemResponse[]
    country: string
    timezone: number
}

export default ForecastResponse