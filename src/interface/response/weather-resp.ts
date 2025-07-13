
export interface IWeather {
    id: number
    main: string
    description: string
    icon: string
}

export interface IMain {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level: number
    grnd_level: number
}

export interface IWind {
    speed: number
    deg: number
    gust: number
}
export interface ISys {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
}

export type WeatherResp = {
    coord: {
        lon: number
        lat: number
    }
    weather: IWeather[]
    base: string
    main: IMain
    visibility: number
    wind: IWind
    rain: {
        "1h": number
    }
    clouds: {
        all: number
    }
    dt: number
    sys: ISys
    timezone: number
    id: number
    name: string
    cod: number

    // addon type
    display_place: string
}