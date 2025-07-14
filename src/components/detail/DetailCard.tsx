'use client'
import { useParams } from 'next/navigation'
import { WeatherItemDetail } from '@/components/home/WeatherItemDetail'
import { useEffect, useState } from 'react'
import { useValueStore } from '@/lib/store'
import { WeatherDetail } from '@/interface/weather-detail'
import { WeatherItemDetailSkeleton } from '../home/WeatherItemDetailSkeleton'

function DetailCard() {
    const params = useParams<{ id: string }>()
    const [loading, setLoading] = useState(true);

    const setWeatherDetail = useValueStore((state) => state.setWeatherDetail)
    const weatherDetail = useValueStore((state) => state.weatherDetail)
    const cityList = useValueStore((state) => state.cityList)


    const handleFetch = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const city = cityList.find(({ id }) => id === params.id)
        if (city) {
            const { weather, forecast } = city
            const newData = {
                id: params.id,
                weather: {
                    ...weather,
                    display_place: city.display_place
                },
                forecast,
            } as WeatherDetail

            setWeatherDetail(newData)
        }
        setLoading(false)
    }

    useEffect(() => {
        handleFetch()
        console.log('loading :>> ', loading);
    }, [])


    return (
        <>
            {
                loading ?
                    <WeatherItemDetailSkeleton /> :
                    weatherDetail &&
                    <div className='py-2'>
                        <WeatherItemDetail weatherDetail={weatherDetail} />
                    </div>
            }
        </>
    )
}

export default DetailCard