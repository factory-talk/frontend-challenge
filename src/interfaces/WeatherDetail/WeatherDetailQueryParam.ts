class WeatherDetailQueryParam{
    lat: number
    lon: number
    cityDisplayName: string

    constructor(lat: string | null, lon: string | null, cityDisplayName: string | null) {
        this.lat = lat ? Number.parseFloat(lat) : 0
        this.lon = lon ? Number.parseFloat(lon) : 0
        this.cityDisplayName = cityDisplayName ? cityDisplayName : ""
    }
}

export default WeatherDetailQueryParam