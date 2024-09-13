interface ActiveSearchResponse {
    name: string
    local_name:Map<string, string>
    lat: number
    lon: number
    country: string
    state: string
}

export default ActiveSearchResponse