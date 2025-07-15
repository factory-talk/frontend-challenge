'use client'
import React, { useEffect } from 'react'
import CityItem from './CityItem'
import { useValueStore } from '@/lib/store'
import { getForecast } from '@/hooks/get-forecast'
import { getWeather } from '@/hooks/get-weather'

function CityList() {
    const cityList = useValueStore((state) => state.cityList)

    const fetchKey = useValueStore((state) => state.fetchKey)
    const units = useValueStore((state) => state.units)
    const setCityListAll = useValueStore((state) => state.setCityListAll)

    const fetchUpdated = async () => {
        const updated = await Promise.all(
            cityList.map(async (city) => {
                const [weather, forecast] = await Promise.all([
                    getWeather({ lat: city.lat, lon: city.lon, units }),
                    getForecast({ lat: city.lat, lon: city.lon, units, cnt: '24' })
                ])
                return { ...city, weather, forecast }
            })
        )

        setCityListAll(updated)
    }

    useEffect(() => {
        fetchUpdated()
    }, [fetchKey])

    return (
        <div className="grid grid-cols-1  sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-6">
            {
                cityList.map((item, key) => (
                    <div key={'ct' + key} className='py-2 flex justify-center'>
                        <CityItem key={'cti' + key} cityDetail={item} />
                    </div>
                ))
            }
        </div>
    )
}

export default CityList