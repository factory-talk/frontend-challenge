import { ForecastData } from '@/interface/response/forecast-resp'
import { WeatherResp } from '@/interface/response/weather-resp'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type State = {
    searchText: string
    weatherData?: WeatherResp
    forecastData?: ForecastData[]
}

type Actions = {
    setSearchText: (value: string) => void
    setWeatherData: (weatherData: WeatherResp) => void
    setForecastData: (forecastData: ForecastData[]) => void
    resetWeather: () => void
    resetForecast: () => void
}

const initialState: State = {
    searchText: '',
    weatherData: undefined,
    forecastData: []
}

export const useValueStore = create<State & Actions>()(
    devtools((set) => ({
        ...initialState,
        setSearchText: (value) => set(() => ({ searchText: value })),
        setWeatherData: (value) => set(() => ({ weatherData: value })),
        setForecastData: (value) => set(() => ({ forecastData: value })),
        resetWeather: () => set(() => ({ weatherData: initialState.weatherData })),
        resetForecast: () => set(() => ({ forecastData: initialState.forecastData })),
    }))
)

