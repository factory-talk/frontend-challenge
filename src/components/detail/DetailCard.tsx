'use client'
import { useParams } from 'next/navigation'
import { WeatherItemDetail } from '@/components/home/WeatherItemDetail'
import { useEffect, useState } from 'react'
import { useValueStore } from '@/lib/store'
import { WeatherDetail } from '@/interface/weather-detail'
import { WeatherItemDetailSkeleton } from '../home/WeatherItemDetailSkeleton'
import { getForecast } from '@/hooks/get-forecast'
import { getWeather } from '@/hooks/get-weather'

function DetailCard() {
    const params = useParams<{ id: string }>()
    const [loading, setLoading] = useState(true)

    const setWeatherDetail = useValueStore((state) => state.setWeatherDetail)
    const weatherDetail = useValueStore((state) => state.weatherDetail)
    const cityList = useValueStore((state) => state.cityList)
    const units = useValueStore((state) => state.units)

    const handleFetch = async () => {
        setLoading(true)

        const city = cityList.find(({ id }) => id === params.id)
        if (!city) {
            setLoading(false)
            return
        }

        const [weather, forecast] = await Promise.all([
            getWeather({ lat: city.lat, lon: city.lon, units }),
            getForecast({ lat: city.lat, lon: city.lon, units, cnt: '24' }),
        ])

        const newData = {
            id: params.id,
            weather: {
                ...weather,
                display_place: city.display_place,
            },
            forecast,
        } as WeatherDetail

        setWeatherDetail(newData)
        setLoading(false)
    }

    useEffect(() => {
        handleFetch()
    }, [units, params.id])

    return (
        <>
            {loading ? (
                <WeatherItemDetailSkeleton />
            ) : (
                weatherDetail && (
                    <div className='py-2'>
                        <WeatherItemDetail weatherDetail={weatherDetail} />
                    </div>
                )
            )}
        </>
    )
}

export default DetailCard