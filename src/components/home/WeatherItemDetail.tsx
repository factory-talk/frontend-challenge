'use client'
import { Wind, Droplets, Gauge, CloudRain } from 'lucide-react';
import HourlyForecast from './HourlyForcast';
import Image from 'next/image';
import { convertDatetimeFormat, convertLocalTime } from '@/util/convert-date';
import { WeatherDetail } from '@/interface/weather-detail';
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { convertUnits } from '@/util/convert-unit';
import { useValueStore } from '@/lib/store';
import { getWeatherImage } from '@/util/getweather-image';


export const WeatherItemDetail = ({ weatherDetail }: {
    weatherDetail: WeatherDetail
}) => {
    const router = useRouter()
    const units = useValueStore((state) => state.units)

    const { weather, forecast } = weatherDetail

    return (
        <div className='flex justify-center flex-col items-center'>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                <div className="mb-5">
                    <div className='flex float-start items-center gap-3 py-3'>
                        <Button type="primary" size='large' shape="circle" icon={<ArrowLeftOutlined />} onClick={() => router.push('/')} />
                    </div>
                    <div className="flex items-center max-w-2xl w-full">
                        <h2 className="text-2xl font-bold text-gray-800 capitalize">
                            {weather.display_place}, {weather.sys.country}
                        </h2>

                    </div>
                    <p className="text-gray-600">{convertDatetimeFormat(weather.dt)}</p>
                </div>

                <div className="flex items-center justify-center mb-6 flex-col">
                    <div className="flex flex-col items-center justify-center text-center">
                        <span className="font-bold">Local of City Time:</span>
                        <span>{convertLocalTime(weather.dt, weather.timezone)}</span>
                    </div>
                    <Image
                        alt='forecast-icon'
                        width={100}
                        height={100}
                        src={getWeatherImage(weather.weather[0].icon)}
                    />
                    <div className="ml-4 text-center">
                        <div className="text-4xl font-bold text-gray-800">{weather.main.temp}{convertUnits(units)}</div>
                        <div className="text-lg text-gray-600 capitalize">{weather.weather[0].description}</div>
                        <div className="text-sm text-gray-500">
                            H: {weather.main.temp_max}{convertUnits(units)} L: {weather.main.temp_min}{convertUnits(units)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <Wind className="mx-auto mb-2 text-gray-600" size={24} />
                        <div className="text-lg font-semibold text-gray-800">{weather.wind.speed} m/s</div>
                        <div className="text-sm text-gray-600">Wind</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <Droplets className="mx-auto mb-2 text-gray-600" size={24} />
                        <div className="text-lg font-semibold text-gray-800">{weather.main.humidity}%</div>
                        <div className="text-sm text-gray-600">Humidity</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <Gauge className="mx-auto mb-2 text-gray-600" size={24} />
                        <div className="text-lg font-semibold text-gray-800">{weather.main.pressure} hPa</div>
                        <div className="text-sm text-gray-600">Pressure</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <CloudRain className="mx-auto mb-2 text-gray-600" size={24} />
                        <div className="text-lg font-semibold text-gray-800">
                            {weather.rain ? `${weather.rain['1h']}` : '0'} mm
                        </div>
                        <div className="text-sm text-gray-600">Rain</div>
                    </div>
                </div>

                <HourlyForecast forecastData={forecast} />
            </div>
        </div>
    )
}