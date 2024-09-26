// SearchInputWithPopover.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { ExtendedLocationData } from '@/hooks/api/useGetWeatherDataFromLocationSearch';
import type { TemperatureUnit } from '@/stores/useTemperatureUnitStore';
type SearchInputWithPopoverProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  extendedLocationData: ExtendedLocationData[] | undefined;
  unit: TemperatureUnit;
  onSearchClickAdd: (location: ExtendedLocationData) => void;
};

export const AutocompleteSearchBar: React.FC<SearchInputWithPopoverProps> = ({
  search,
  setSearch,
  extendedLocationData,
  unit,
  onSearchClickAdd,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowPopover(true);
  };

  const handleLocationSelect = (location: ExtendedLocationData) => {
    onSearchClickAdd(location);
    setShowPopover(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setShowPopover(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative w-full flex flex-col'>
      <input
        className='w-full p-3 rounded-lg bg-white/10 placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
        placeholder='Enter location...'
        value={search}
        onChange={handleSearchChange}
      />
      {/* Popover for location data */}
      {showPopover && (
        <div
          ref={popoverRef}
          className='absolute left-0 right-0 top-12 max-h-96 overflow-y-auto rounded-lg bg-blue-400 shadow-lg z-50'
        >
          {extendedLocationData && extendedLocationData.length > 0 ? (
            extendedLocationData.map((extendedLocation) => (
              <div
                key={extendedLocation.location.place_id}
                className='flex justify-between items-center w-auto px-4 py-2 m-1 rounded-lg hover:bg-blue-600 cursor-pointer transition'
              >
                <p onClick={() => handleLocationSelect(extendedLocation)}>
                  {extendedLocation.location.display_name}
                </p>
                <div>
                  <div className='relative min-w-12 h-12'>
                    <Image
                      alt='weather-icon'
                      layout='fill'
                      objectFit='contain'
                      src={`https://openweathermap.org/img/wn/${extendedLocation.weather.weather[0].icon}@4x.png`}
                    />
                  </div>
                  <p className='text-sm text-nowrap'> {extendedLocation.weather.main.temp} {unit.symbol}</p>
                </div>
              </div>
            ))
          ) : (
            <p className='p-2 text-center text-gray-100'>No location found</p>
          )}
        </div>
      )}
    </div>
  );
};
