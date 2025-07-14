'use client'
import { Card } from 'antd'
import { startCase } from 'lodash'
import CardTitle from './CardTitle'
import { WeatherDetail } from '@/interface/weather-detail'
import Link from 'next/link'
import { CityDetail } from '@/interface/city-detail'
import Image from 'next/image'


function CityItem({ cityDetail }: { cityDetail: CityDetail }) {

    const { id, lat, lon, display_name, country_code, display_place, weather } = cityDetail

    const title = `${startCase(display_place)}, ${country_code.toUpperCase()}`

    return (
        <Card title={
            <CardTitle title={title} id={id} />
        }
            variant="borderless" style={{ width: 368 }}
            actions={[
                <Link href={`/detail/${id}`} key="detail">See more details</Link>,
            ]}
        >
            <div className='text-base'>
                <div className="flex items-center justify-center mb-6">
                    <Image
                        alt='forecast-icon'
                        width={100}
                        height={100}
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    />
                    <div className="ml-4 text-center">
                        <div className="text-4xl font-bold text-gray-800">{weather.main.temp}°C</div>
                        <div className="text-lg text-gray-600 capitalize">{weather.weather[0].description}</div>
                        <div className="text-sm text-gray-500">
                            H: {weather.main.temp_max}°C L: {weather.main.temp_min}°C
                        </div>
                    </div>
                </div>
                <p className='font-semibold'>{startCase(display_name)}</p>
                <div>
                    <span className='font-bold'>Lat : </span>
                    <span>{lat}</span>
                </div>
                <div>
                    <span className='font-bold'>Long : </span>
                    <span>{lon}</span>
                </div>
            </div>
        </Card>
    )
}

export default CityItem