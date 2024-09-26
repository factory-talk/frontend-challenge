'use client';

import { useGetOpenWeatherData } from '@/hooks/api/useGetOpenWeatherData';
import { ROUTE } from '@/routes';
import useLocationStore from '@/stores/useLocationStore';
import useTemperatureUnitStore from '@/stores/useTemperatureUnitStore';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation'; // Import useRouter
import { ArrowLeft } from 'lucide-react';

const DetailPage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter(); // Initialize useRouter
  const { location } = useLocationStore();
  const currentLocation = location.find(
    (_currentLocation) => _currentLocation.id === params.slug,
  );

  if (!currentLocation) {
    notFound(); // This will render the 404 page
  }

  const { unit } = useTemperatureUnitStore();
  const { data } = useGetOpenWeatherData({
    lat: currentLocation.lat,
    lon: currentLocation.lon,
    unit,
  });

  // Reusable component for displaying weather details
  const WeatherDetail = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => {
    return (
      <p className='text-md text-gray-200'>
        <span className='font-semibold'>{label}:</span> {value}
      </p>
    );
  };

  return (
    <div className='container flex justify-center p-content-card'>
      <div className='relative flex flex-col sm:flex-row sm:justify-evenly sm:items-center gap-4 min-h-fit-screen-with-header max-w-screen sm:max-w-[840px] overflow-auto p-6 rounded-xl bg-white/10 shadow-lg'>
        {/* Back Button */}
        <div className='absolute top-3 left-3 flex space-x-1'>
          <button
            className='p-1 hover:text-blue-200 transition z-30'
            type='button'
            onClick={() => {
              router.push(ROUTE.INDEX);
            }}
          >
            <ArrowLeft className='h-8 w-8' />
          </button>
        </div>

        <div className='flex flex-col h-full justify-evenly'>
          <div className='relative w-full h-32'>
            <Image
              alt='weather-icon'
              layout='fill'
              objectFit='contain'
              src={`https://openweathermap.org/img/wn/${data?.weather[0].icon}@4x.png`}
            />
          </div>
          <div className='lg:min-w-[480px] lg:p-4'>
            <h2 className='text-2xl font-bold'>
              {currentLocation.displayPlace}
            </h2>
            <h3 className='text-md text-gray-200'>
              {currentLocation.displayAddress}
            </h3>
            <WeatherDetail label='ID' value={currentLocation.id} />
            <WeatherDetail label='Latitude' value={currentLocation.lat} />
            <WeatherDetail label={'Longitude'} value={currentLocation.lon} />
          </div>
        </div>
        {data ? (
          <div>
            <WeatherDetail
              label='Temperature'
              value={`${data.main.temp} ${unit.symbol}`}
            />
            <WeatherDetail
              label='Feels Like'
              value={`${data.main.feels_like} ${unit.symbol}`}
            />
            <WeatherDetail
              label='Min Temperature'
              value={`${data.main.temp_min} ${unit.symbol}`}
            />
            <WeatherDetail
              label='Max Temperature'
              value={`${data.main.temp_max} ${unit.symbol}`}
            />
            <WeatherDetail
              label='Pressure'
              value={`${data.main.pressure} hPa`}
            />
            <WeatherDetail label='Humidity' value={`${data.main.humidity}%`} />
            <WeatherDetail
              label='Visibility'
              value={`${data.visibility / 1000} km`}
            />
            <WeatherDetail
              label='Wind Speed'
              value={`${data.wind.speed} m/s`}
            />
            <WeatherDetail label='Wind Direction' value={`${data.wind.deg}°`} />
            <WeatherDetail
              label='Cloud Coverage'
              value={`${data.clouds.all}%`}
            />
            <WeatherDetail
              label='Time of Data Calculation'
              value={new Date(data.dt * 1000).toLocaleString()}
            />
            <WeatherDetail label='Country' value={data.sys.country} />
            <WeatherDetail
              label='Sunrise'
              value={new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
            />
            <WeatherDetail
              label='Sunset'
              value={new Date(data.sys.sunset * 1000).toLocaleTimeString()}
            />
            <WeatherDetail
              label='Timezone'
              value={`GMT${data.timezone >= 0 ? '+' : ''}${data.timezone / 3600}`}
            />
            <WeatherDetail
              label='Weather Condition'
              value={data.weather[0]?.description}
            />
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
