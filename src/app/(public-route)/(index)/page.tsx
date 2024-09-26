'use client';

import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  LocationCard,
  CustomButton,
  AutocompleteSearchBar,
} from '@/components';
import type { ExtendedLocationData } from '@/hooks/api/useGetWeatherDataFromLocationSearch/useGetWeatherDataFromLocationSearch';
import { useGetWeatherDataFromLocationSearch } from '@/hooks/api/useGetWeatherDataFromLocationSearch/useGetWeatherDataFromLocationSearch';
import { QUERY_KEY } from '@/hooks/api/query-key';
import useLocationStore from '@/stores/useLocationStore';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { ROUTE } from '@/routes';
import useTemperatureUnitStore from '@/stores/useTemperatureUnitStore';

const IndexPage = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { unit, toggleUnit } = useTemperatureUnitStore();

  const { data: extendedLocationData } = useGetWeatherDataFromLocationSearch(
    debouncedSearch,
    unit,
  );
  const {
    addLocation,
    location: storedLocation,
    removeLocation,
  } = useLocationStore();

  const queryClient = useQueryClient();
  const router = useRouter();

  const handleClickAddSearch = (searchData: ExtendedLocationData) => {
    addLocation({
      id: searchData.location.place_id,
      displayPlace: searchData.location.display_place,
      displayAddress: searchData.location.display_address,
      lat: searchData.location.lat,
      lon: searchData.location.lon,
    });
  };

  const handleClickCard = (id: string) => {
    router.push(`${ROUTE.DETAIL}/${id}`);
  };

  // BUTTON LOGIC HANDLERS
  const handleToggleUnit = () => {
    toggleUnit(() =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.OPEN_WEATHER] }),
    );
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.OPEN_WEATHER] });
  };

  return (
    <>
      {/* Input with popover and buttons */}
      <div className='relative max-w-[800px] w-full flex flex-col gap-2 items-center'>
        {/* Search Input Section */}
        <AutocompleteSearchBar
          existingLocations={storedLocation}
          extendedLocationData={extendedLocationData}
          search={search}
          setSearch={setSearch}
          unit={unit}
          onSearchClickAdd={handleClickAddSearch}
        />

        {/* Button Section */}
        <div className='flex flex-col flex-grow lg:flex-row gap-2 w-full lg:w-auto '>
          {/* Unit Change Button */}
          <CustomButton
            className='min-w-[160px]'
            data-testid='unit-button'
            label={`Unit: ${unit.label}`}
            title='Change Unit'
            onClick={handleToggleUnit}
          />
          {/* Refresh Button */}
          <CustomButton
            data-testid='refresh-button'
            icon={RefreshCcw}
            label='Refresh All'
            title='Refresh Weather Data'
            onClick={handleRefresh}
          />
        </div>
      </div>

      {/* Location Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8'>
        {storedLocation.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            unit={unit}
            onClick={() => handleClickCard(location.id)}
            onDelete={() => removeLocation(location.id)}
          />
        ))}
      </div>
    </>
  );
};

export default IndexPage;
