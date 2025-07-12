
export type LocationResp = {
    place_id: string
    osm_id: string
    osm_type: string
    lat: string
    lon: string
    boundingbox: string[]
    class: string
    type: string
    display_name: string
    display_place: string
    display_address: string
    address: {
        name: string
        suburb?: string
        city?: string
        county?: string
        state: string
        postcode?: string
        country: string
        country_code: string
    }
}
