'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import { useSelectedCities } from '../../_context/CitiesContext';
import { City, WeatherData } from '../../_lib/models';
import { convertTimestampToLocalTime, formatDate } from '../../_lib/dateTimeUtil';
import { unitToSymbol } from '../../_lib/temperatureUtil';
import { openWeatherIconUrl } from '../../_lib/constants';

function CityWeather({ cityId, weather, unit }: { cityId: string, weather: WeatherData, unit: string }) {
	
	const { getCityById } = useSelectedCities();
	const [city, setCity] = useState<City | null>(null);
	const localDtStr = convertTimestampToLocalTime(weather.dt);	
	const [isLoading, setIsLoading] = useState<boolean>(true);


	useEffect(() => {
		const fetchCity = async () => {
			setIsLoading(true);
			const city = await getCityById(cityId);
			setCity(city);

			setIsLoading(false);
		};

		fetchCity();
	}, [getCityById]);


	if (isLoading) {
		return <div>Loading Weather Data...</div>;
	}

	return (
		<div className='flex flex-col gap-2'>			
			<h1 className='text-3xl font-medium'>{city?.place_name}</h1>			
			<p className='text-md font-bold'>{formatDate(localDtStr)}</p>
			<p className='uppercase text-sm'>
				min: {weather.main.temp_min}{unitToSymbol(unit)}, max: {weather.main.temp_max}{unitToSymbol(unit)}
			</p>			
			<div className='flex flex-col gap-2 items-center'>
					<Image 
						src={`${openWeatherIconUrl}${weather.weather[0].icon}.png`} 
						alt={weather.weather[0].description} 
						width={84}
						height={84}
					/>
					<p className='text-7xl font-bold'>{weather.main.temp.toFixed(0)}{unitToSymbol(unit)}</p>
					<p className='capitalize text-sm font-medium'>{weather.weather[0].main}</p>
					<p className='capitalize text-xs text-gray-500'>({weather.weather[0].description})</p>
			</div>			
		</div>
	)
}

export default CityWeather