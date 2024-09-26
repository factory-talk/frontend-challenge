import Image from 'next/image';
import { useGetOpenWeatherData } from '@/hooks/api/useGetOpenWeatherData';
import { RefreshCcw, Trash, Loader } from 'lucide-react';
import type { Location } from '@/stores/useLocationStore';
import type { TemperatureUnit } from '@/stores/useTemperatureUnitStore';

type LocationCardProps = {
  location: Location;
  unit: TemperatureUnit;
  onDelete: () => void;
};

export const LocationCard = ({
  location,
  unit,
  onDelete,
}: LocationCardProps): JSX.Element => {
  const {
    data: weatherData,
    refetch,
    isFetching,
  } = useGetOpenWeatherData({
    lat: location.lat,
    lon: location.lon,
    unit
  });

  return (
    <div className='relative flex flex-col justify-between max-w-xs gap-2 p-6 rounded-xl bg-white/10 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl min-h-[400px]'>
      {/* Refresh and Delete Icons */}
      <div className='absolute top-3 right-3 flex space-x-1'>
        <button
          className='p-1 hover:text-blue-400 transition'
          type='button'
          onClick={() => refetch()}
        >
          <RefreshCcw className='h-5 w-5' />
        </button>
        <button
          className='p-1 hover:text-red-400 transition'
          type='button'
          onClick={onDelete}
        >
          <Trash className='h-5 w-5' />
        </button>
      </div>
      {/* Card Header */}
      <div className='h-32'>
        <h3 className='text-2xl font-bold line-clamp-2'>
          {location.displayPlace}
        </h3>
        <h4 className='text-lg text-gray-100 line-clamp-2'>
          {location.displayAddress}
        </h4>
      </div>
      {/* Weather Icon */}
      {isFetching ? (
        <div className='flex flex-col justify-center items-center w-full h-16'>
          <Loader />
        </div>
      ) : (
        <div className='relative w-full h-16'>
          <Image
            alt='weather-icon'
            layout='fill'
            objectFit='contain'
            src={`https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@4x.png`}
          />
        </div>
      )}
      {/* Temperature Info */}
      <div className='p-4 text-md'>
        {isFetching ? (
          ['Temperature', 'Feels Like', 'Min', 'Max'].map((label) => (
            <p key={label}>
              {label}: <span className='font-semibold'>...loading</span>
            </p>
          ))
        ) : (
          <>
            <p>
              Temperature:{' '}
              <span className='font-semibold'>{weatherData?.main.temp} {unit.symbol}</span>
            </p>
            <p>
              Feels Like:{' '}
              <span className='font-semibold'>
                {weatherData?.main.feels_like} {unit.symbol}
              </span>
            </p>
            <p>
              Min:{' '}
              <span className='font-semibold'>
                {weatherData?.main.temp_min} {unit.symbol}
              </span>
            </p>
            <p>
              Max:{' '}
              <span className='font-semibold'>
                {weatherData?.main.temp_max} {unit.symbol}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
