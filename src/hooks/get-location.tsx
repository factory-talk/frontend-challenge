import axios from "axios"
import { LocationResp } from "@/interface/response/location-resp"
import { APP_CONFIG } from "@/config/app.config"


interface GetLocationProp {
    q: string
    limit: string
    dedupe: string
}

export const getLocations = async (query: GetLocationProp) => {
    const url = APP_CONFIG.NEXT_PUBLIC_LACATION_URL
    const params = new URLSearchParams({
        key: APP_CONFIG.NEXT_PUBLIC_KEY || '',
        ...query
    }).toString();

    const result = await axios.get<LocationResp[]>(`${url}?${params}`)
    return result.data
}