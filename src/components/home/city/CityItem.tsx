'use client'
import { Card } from 'antd'
import { startCase } from 'lodash'
import CardTitle from './CardTitle'
import Link from 'next/link'
import { CityDetail } from '@/interface/city-detail'
import Image from 'next/image'
import { useValueStore } from '@/lib/store'
import { convertUnits } from '@/util/convert-unit'
import { convertLocalTime } from '@/util/convert-date'


function CityItem({ cityDetail }: { cityDetail: CityDetail }) {
    const units = useValueStore((state) => state.units)

    const { id, lat, lon, country_code, display_place, weather } = cityDetail

    const title = `${startCase(display_place)}, ${country_code.toUpperCase()}`

    return (
        <Card title={
            <CardTitle title={title} id={id} />
        }
            variant="borderless" style={{ width: '100%' }}
            actions={[
                <Link href={`/detail/${id}`} key="detail">See more details</Link>,
            ]}
            styles={{ body: { padding: 18 } }}
        >
            <div className="text-base space-y-4">
                {/* Local Time */}
                <div className="flex flex-col items-center justify-center text-center">
                    <span className="font-bold">Local of City Time:</span>
                    <span>{convertLocalTime(weather.dt, weather.timezone)}</span>
                </div>

                {/* Weather Icon & Temp */}
                <div className="flex flex-col items-center justify-center">
                    <Image
                        alt="forecast-icon"
                        width={80}
                        height={80}
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    />
                    <div className="text-2xl font-bold text-gray-800 mt-2">
                        {weather.main.temp}
                        {convertUnits(units)}
                    </div>
                </div>

                {/* Lat / Lon */}
                <div className="space-y-1">
                    <div>
                        <span className="font-bold">Lat: </span>
                        <span>{lat}</span>
                    </div>
                    <div>
                        <span className="font-bold">Long: </span>
                        <span>{lon}</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default CityItem


// <div className='text-base'>
//     <div className="flex flex-col items-center justify-center mb-6">
//         <div className='flex flex-col justify-center items-center'>
//             <span className='font-bold'>Local Time : </span>
//             <span>{convertLocalTime(weather.dt, weather.timezone)}</span>
//         </div>
//         <div className='flex flex-col'>
//             <div className='flex justify-center'>

//                 <Image
//                     alt='forecast-icon'
//                     width={80}
//                     height={80}
//                     src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
//                 />
//             </div>
//             <div className="ml-4 text-center">
//                 <div className="text-2xl font-bold text-gray-800">{weather.main.temp}{convertUnits(units)}</div>
//             </div>
//         </div>
//     </div>
//     <div>
//         <span className='font-bold'>Lat : </span>
//         <span>{lat}</span>
//     </div>
//     <div>
//         <span className='font-bold'>Long : </span>
//         <span>{lon}</span>
//     </div>
// </div>