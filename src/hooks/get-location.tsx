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
        key: APP_CONFIG.NEXT_PUBLIC_KEY || 'pk.a8e410d9b3f374d01522db250a0b3835',
        ...query
    }).toString();

    const result = await axios.get<LocationResp[]>(`${url}?${params}`)
    return result.data
}