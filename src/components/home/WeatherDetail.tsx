import { Wind, Droplets, Gauge, CloudRain, Archive } from 'lucide-react';
import { WeatherResp } from '@/interface/response/weather-resp';
import HourlyForecast from './HourlyForcast';
import Image from 'next/image';
import { convertDatetimeFormat } from '@/util/convert-date';
import { useValueStore } from '@/lib/store';

export const WeatherDetail = ({ weather }: {
    weather: WeatherResp
}) => {
    const resetWeather = useValueStore((state) => state.resetWeather)
    const resetForecast = useValueStore((state) => state.resetForecast)

    const handleRemove = () => {
        resetWeather()
        resetForecast()
    }

    return (
        <div className='flex justify-center flex-col items-center'>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                <div className="mb-5">
                    <div className="flex items-center justify-between max-w-2xl w-full">
                        <h2 className="text-2xl font-bold text-gray-800 capitalize">
                            {weather.display_place}, {weather.sys.country}
                        </h2>
                        <Archive onClick={handleRemove} className='text-gray-500 hover:text-red-400 cursor-pointer' />
                    </div>
                    <p className="text-gray-600">{convertDatetimeFormat(weather.dt)}</p>
                </div>

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
                            {weather.rain ? `${weather.rain['1h']} mm` : '0 mm'}
                        </div>
                        <div className="text-sm text-gray-600">Rain</div>
                    </div>
                </div>

                <HourlyForecast />
            </div>
        </div>
    )
}