// SearchInputWithPopover.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { ExtendedLocationData } from '@/hooks/api/useGetWeatherDataFromLocationSearch/useGetWeatherDataFromLocationSearch';
import type { TemperatureUnit } from '@/stores/useTemperatureUnitStore';
import type { Location } from '@/stores/useLocationStore';

type SearchInputWithPopoverProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  extendedLocationData: ExtendedLocationData[] | undefined;
  unit: TemperatureUnit;
  existingLocations: Location[];
  onSearchClickAdd: (location: ExtendedLocationData) => void;
};

export const AutocompleteSearchBar: React.FC<SearchInputWithPopoverProps> = ({
  search,
  setSearch,
  extendedLocationData,
  unit,
  onSearchClickAdd,
  existingLocations,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowPopover(true);
  };

  const handleLocationSelect = (location: ExtendedLocationData) => {
    const locationExists = existingLocations.some(
      (existingLocation) => existingLocation.id === location.location.place_id,
    );

    if (locationExists) {
      setNotification('Location already added!');
      setTimeout(() => setNotification(null), 500);
    } else {
      onSearchClickAdd(location);
      setShowPopover(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setShowPopover(false);
    }
  };

  const handleFocus = () => {
    setShowPopover(true);
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
        placeholder='Enter location... *at least 2 letters'
        value={search}
        onChange={handleSearchChange}
        onFocus={handleFocus}  // Show popover on input focus
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
                onClick={() => handleLocationSelect(extendedLocation)}
              >
                <p>{extendedLocation.location.display_name}</p>
                <div>
                  <div className='relative min-w-12 h-12'>
                    <Image
                      fill
                      alt='weather-icon'
                      className='object-contain w-full h-full'
                      src={`https://openweathermap.org/img/wn/${extendedLocation.weather.weather[0].icon}@4x.png`}
                    />
                  </div>
                  <p className='text-sm text-nowrap'>
                    {extendedLocation.weather.main.temp} {unit.symbol}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className='p-2 text-center text-gray-100'>No location found</p>
          )}
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className='absolute top-0 left-0 right-0 bg-red-500 text-white text-center p-3 min-w-12 rounded-lg'>
          {notification}
        </div>
      )}
    </div>
  );
};
