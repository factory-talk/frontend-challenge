import { CityDetail } from '@/interface/city-detail'
import { Units } from '@/interface/units'
import { WeatherDetail } from '@/interface/weather-detail'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'



type State = {
    cityList: CityDetail[]
    weatherDetail?: WeatherDetail
    units: Units
    fetchKey: string
}

type Actions = {
    setWeatherDetail: (weatherDetails: WeatherDetail) => void
    setCityList: (city: CityDetail) => void
    deleteCityList: (id: string) => void
    setUnits: (units: Units) => void
    setFetchKey: () => void
    setCityListAll: (cities: CityDetail[]) => void
}

const initialState: State = {
    cityList: [],
    weatherDetail: undefined,
    units: 'metric',
    fetchKey: ''
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
                setUnits: (value) => set(() => {
                    return { units: value }
                }),
                setFetchKey: () => set(() => ({ fetchKey: Date.now().toString() })),
                setCityListAll: (cities) => set(() => ({
                    cityList: cities
                }))
            }),
            {
                name: 'city-store',
            }
        )
    )
)

