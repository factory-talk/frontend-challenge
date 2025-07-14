import { CityDetail } from '@/interface/city-detail'
import { WeatherDetail } from '@/interface/weather-detail'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type State = {
    cityList: CityDetail[]
    weatherDetail?: WeatherDetail
}

type Actions = {
    setWeatherDetail: (weatherDetails: WeatherDetail) => void
    setCityList: (city: CityDetail) => void
    deleteCityList: (id: string) => void
}

const initialState: State = {
    cityList: [],
    weatherDetail: undefined
}

export const useValueStore = create<State & Actions>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,
                setWeatherDetail: (value) => set(() => {
                    return { weatherDetail: value }
                }),
                deleteCityList: (id) => set((state) => ({
                    cityList: state.cityList.filter((item) => item.id !== id)
                })),

                // persist action
                setCityList: (value) => set((state) => {
                    const isExist = state.cityList.some((item) => item.id === value.id)
                    if (isExist) return state
                    return { cityList: [...state.cityList, value] }
                }),
            }),
            {
                name: 'city-store',
            }
        )
    )
)

