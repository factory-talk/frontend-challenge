'use client';

import { useState } from 'react';
import { RefreshCcw, SquareMenu } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { LocationCard, CustomButton , AutocompleteSearchBar } from '@/components';
import type { ExtendedLocationData } from '@/hooks/api/useGetWeatherDataFromLocationSearch';
import { useGetWeatherDataFromLocationSearch } from '@/hooks/api/useGetWeatherDataFromLocationSearch';
import { QUERY_KEY } from '@/hooks/api/query-key';
import useLocationStore from '@/stores/useLocationStore';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { ROUTE } from '@/routes';
import useTemperatureUnitStore from '@/stores/useTemperatureUnitStore';
import Logo from '@/assets/svg/logo.svg';

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

  const handleSearchClickAdd = (
    searchData: ExtendedLocationData,
  ) => {
    addLocation({
      id: searchData.location.place_id,
      displayPlace: searchData.location.display_place,
      displayAddress: searchData.location.display_address,
      lat: searchData.location.lat,
      lon: searchData.location.lon,
    });
  };

  // BUTTON LOGIC HANDLERS
  const handleDetailSearch = () => {
    router.push(ROUTE.SEARCH);
  };

  const handleToggleUnit = () => {
    toggleUnit(() =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.OPEN_WEATHER] }),
    );
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.OPEN_WEATHER] });
  };


  return (
    <div className='container flex flex-col items-center justify-center gap-12 p-4'>
      <div className='flex flex-col justify-center text-center text-3xl sm:text-5xl font-extrabold tracking-tight'>
        <div className='self-center w-32 h-32 sm:w-[200px] sm:h-[200px] '>
          <Logo />
        </div>
        <div>
          D² <span className='text-blue-200'>Weather Watch</span>
        </div>
      </div>

      {/* Input with popover and buttons */}
      <div className='relative max-w-[800px] w-full flex flex-col gap-2 items-center'>
          {/* Search Input Section */}
          <AutocompleteSearchBar
          extendedLocationData={extendedLocationData}
          search={search}
          setSearch={setSearch}
          unit={unit}
          onSearchClickAdd={handleSearchClickAdd}
        />

        {/* Button Section */}
        <div className='flex flex-col flex-grow lg:flex-row gap-2 w-full lg:w-auto '>
          {/* Detail Search Button */}
          <CustomButton
            icon={SquareMenu}
            label='Detailed Search'
            title='Detailed Search'
            onClick={handleDetailSearch}
          />

          {/* Unit Change Button */}
          <CustomButton
            className='min-w-[160px]'
            label={`Unit: ${unit.label}`}
            title='Change Unit'
            onClick={handleToggleUnit}
          />

          {/* Refresh Button */}
          <CustomButton
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
            onDelete={() => removeLocation(location.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
