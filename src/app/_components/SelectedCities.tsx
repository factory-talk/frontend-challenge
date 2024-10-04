'use client'

import moment from 'moment-timezone';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

import { City, WeatherData } from '../_lib/models';
import { useSelectedCities } from '../_context/CitiesContext';
import { IoIosRemoveCircle } from "react-icons/io";
import { getWeatherByCoords } from '../_services/apiWeather';
import { openWeatherIconUrl } from '../_lib/constants';
import { useSearchParams } from 'next/navigation';
import { unitToSymbol } from '../_lib/temperatureUtil';
import Link from 'next/link';
import { computeCityWeatherURL } from '../_lib/navigationUtil';


function SelectedCities () {

	const { selectedCities, removeCity } = useSelectedCities();
	const [isLoading, setIsLoading] = useState(false);	
	const [cities, setCities] = useState<City[]>([]);
	const unit = useSearchParams().get('unit') || 'celsius';
	const country = useSearchParams().get('country') || 'all';

	useEffect(() => {
		const fetchCities = async () => {
			setIsLoading(true);
			const cities = await Promise.all(selectedCities.map(async (city: City) => {				
				const weather: WeatherData = await getWeatherByCoords({ 
					lat: city.center[1].toString(), 
					lon: city.center[0].toString(),
					unit: unit
				});
				city.weather = weather;
				return city;
			}))
			
			setCities(cities);
			setIsLoading(false);
		}
		fetchCities()
	}, [selectedCities, unit]);

	if (isLoading) {
		return <div className='text-gray-500 text-center'>Loading Today Weather. Anytime Now...</div>
	}

	if (selectedCities.length === 0) {
		return <div className='text-gray-500 text-center'>- Search for a city to see the weather -</div>
	}

	const handleRemoveCity = (e: any, city: City) => {
		e.stopPropagation();
		e.preventDefault();
		removeCity(city)
	}

	return (
		<>
			<ul className="w-full">
				{cities && cities.map((city: City) => (
					<li key={city.id}>				
						<Link href={computeCityWeatherURL({
							id: city.id,
							lat: city.center[1].toString(),
							lon: city.center[0].toString(),
							unit: unit,
							country: country
						})}>
							<div 
								className='flex gap-2 md:gap-4 p-4 border-b items-center cursor-pointer shadow-md'>
								<p className='font-bold flex-1'>{city.place_name}</p>
								<p>
									{moment.utc().add(city.weather.timezone, 'seconds').format('YYYY-MM-DD HH:mm')}
								</p>
								<p>
									{city.weather.weather[0].icon && 
									<Image 
										src={`${openWeatherIconUrl}${city.weather.weather[0].icon}.png`} 
										alt={city.weather.weather[0].description} 										
										width={48} 
										height={48} />}
								</p>
								<p className='w-10 text-center'>{city.weather.main.temp.toFixed(0)}{unitToSymbol(unit)}</p>
								<p>
									<IoIosRemoveCircle 
										className='cursor-pointer text-gray-500'
										onClick={(e) => { handleRemoveCity(e, city) }} />
								</p>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</>
	)
}

export default SelectedCities;