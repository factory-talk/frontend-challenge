import { ForecastData } from '@/interface/response/forecast-resp'
import { WeatherResp } from '@/interface/response/weather-resp'
import { WeatherDetail } from '@/interface/weather-detail'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type State = {
    searchText: string
    weatherDetails: WeatherDetail[]
}

type Actions = {
    setSearchText: (value: string) => void
    setWeatherDetails: (weatherDetails: WeatherDetail) => void
    deleteWeatherDetails: (id: string) => void
}

const initialState: State = {
    searchText: '',
    weatherDetails: []
}

export const useValueStore = create<State & Actions>()(
    devtools((set) => ({
        ...initialState,
        setSearchText: (value) => set(() => ({ searchText: value })),
        setWeatherDetails: (value) => set((state) => {
            const isExist = state.weatherDetails.some(
                (item) => item.id === value.id
            )
            if (isExist) return state

            const mergeData = [...state.weatherDetails, value]

            return { weatherDetails: mergeData }
        }),
        deleteWeatherDetails: (id: string) => set((state) => ({
            weatherDetails: state.weatherDetails.filter((item) => item.id !== id),
        })),
    }))
)

