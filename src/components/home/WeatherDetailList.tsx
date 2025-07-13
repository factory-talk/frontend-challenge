'use client'
import { useValueStore } from '@/lib/store';
import { WeatherItemDetail } from './WeatherItemDetail';


export const WeatherDetailList = () => {

    const weatherDetails = useValueStore((state) => state.weatherDetails)

    return (
        <div className=''>
            {
                weatherDetails.map((item, key) => (
                    <div key={'wt' + key} className='py-2'>
                        <WeatherItemDetail weatherDetail={item} />
                    </div>
                ))
            }
        </div>
    )
}