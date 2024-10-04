import React from 'react'
import { WeatherData } from '../../_lib/models'
import SectionTitle from '../SectionTitle'

function WeatherDetail({ weather }: { weather: WeatherData}) {
	return (
		<div>
			<SectionTitle title="Current Details" />
			<div className="flex flex-col gap-2 p-4 items-center">
				<WeatherDetailItem label="Humidity" value={weather.main.humidity} />
				<WeatherDetailItem label="Wind" value={weather.wind.speed} />
				<WeatherDetailItem label="Pressure" value={weather.main.pressure} />
				<WeatherDetailItem label="Chance of rain" value={ weather.rain?.['1h']} />
				<WeatherDetailItem label="Clouds" value={weather.clouds.all} />
			</div>
		</div>
	)
}

function WeatherDetailItem({ label, value }: { label: string, value: string | number | undefined }) {
	return (
		<p className='flex w-full md:w-2/3'>
			<span className='font-medium text-sm text-gray-500 pl-4 flex-1'>{label}:</span>
			<span className='font-medium text-sm pl-2 flex-1'>{value ?? 'N/A'}</span>
		</p>
	)
}

export default WeatherDetail