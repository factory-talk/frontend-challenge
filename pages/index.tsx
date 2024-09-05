import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Layout from '@presentation/layout/Layout';
import { CityViewModel } from '@application/dtos/CityViewModel';
import { CityUseCases } from '@application/useCases/CityUseCases';
import { OpenWeatherGeocodingService } from '@application/services/OpenWeatherGeocodingService';
import { OpenWeatherAPI } from '@infrastructure/api/OpenWeatherAPI';
import { Spin } from 'antd';

const geocodingAPI = new OpenWeatherAPI();
const geocodingService = new OpenWeatherGeocodingService(geocodingAPI);
const cityUseCases = new CityUseCases(geocodingService);

const SearchBox = lazy(() => import('@presentation/components/SearchBox'));

const IndexPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityViewModel | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCitySelect = useCallback((city: CityViewModel) => {
    setSelectedCity(city);
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Layout>
        <Suspense fallback={<Spin />}>
          <SearchBox
            onCitySelect={handleCitySelect}
            searchCityOrZip={async (query) => await cityUseCases.searchCityOrZip(query)}
          />
        </Suspense>
      </Layout>
    </div>
  );
};
export default React.memo(IndexPage); 
