'use client'

import React from 'react'
import Image from 'next/image';

import { ForecastData } from '../../_lib/models';
import { convertToLocalTime, getHour } from '../../_lib/dateTimeUtil';
import SectionTitle from '../SectionTitle';
import { unitToSymbol } from '../../_lib/temperatureUtil';
import { openWeatherIconUrl } from '../../_lib/constants';

function Forecast({forecasts, unit}: {forecasts: ForecastData[], unit: string}) {	
	const now = new Date();

	return (
		<div className='flex flex-col gap-2 items-center'>
			<SectionTitle title="24 Hours Forecast" />
			<ul className="flex gap-2 overflow-x-scroll w-full justify-start md:justify-center">
			{forecasts.map((item) => {
				const localDtStr = convertToLocalTime(item.dt_txt);			
				const forecastDate = new Date(localDtStr);
				const hoursDifference = (forecastDate.getTime() - now.getTime()) / (1000 * 60 * 60);
				if (hoursDifference > 24) {
					return null;
				}
				return (
					<li key={item.dt} className='flex flex-col items-center min-w-20'>					
						<p>{getHour(localDtStr)}</p>				
						<Image 
							src={`${openWeatherIconUrl}${item.weather[0].icon}.png`} 
							alt={item.weather[0].description} 
							width={72}
							height={72}
							/>
						<p>{item.main.temp.toFixed(0)}{unitToSymbol(unit)}</p>
						<p className='text-xs text-gray-500 text-center capitalize'>{item.weather[0].description}</p>
					</li>);
			})}
			</ul>		
		</div>
	)
}

export default Forecast