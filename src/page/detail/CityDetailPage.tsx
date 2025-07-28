'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CityService } from '@/service/cityService';
import { City } from '@/model/CityModel';
import { WeatherData } from '@/model/WeatherData';
import { kelvinToCelsius } from '@/utils/weatherUtils';
interface CityDetailPageProps {
  city?: City;
}
const CityDetailPage: React.FC<CityDetailPageProps> = ({ city: propCity }) => {
  const params = useParams();
  const router = useRouter();
  const cityId = params?.id as string;
  const numericCityId = cityId ? parseInt(cityId, 10) : null;
  const [city, setCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadCityData = async () => {
      await CityService.loadCities();
      const foundCity = propCity || (numericCityId ? CityService.getCityById(numericCityId) : null);
      setCity(foundCity || null);
      if (foundCity) {
        const weather = CityService.getWeatherData(foundCity.id);
        setWeatherData(weather || null);
      }
      setLoading(false);
    };
    loadCityData();
  }, [cityId, propCity, numericCityId]);
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading city data...</p>
          </div>
        </div>
      </div>
    );
  }
  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              City Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The city you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              onClick={() => router.push('/')}
              className="
                px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                transition-colors duration-200 font-medium
              "
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="
              inline-flex items-center text-blue-600 hover:text-blue-800
              transition-colors duration-200 mb-4
            "
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            {city.name}
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            {city.country}
          </p>
        </div>
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Country</label>
                <p className="text-lg text-gray-900">{city.country}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Country</label>
                <p className="text-lg text-gray-900">{city.country}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Coordinates</label>
                <p className="text-lg font-mono text-gray-900">
                  {city.coord.lat.toFixed(4)}°, {city.coord.lon.toFixed(4)}°
                </p>
              </div>
            </div>
          </div>
          {}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Weather Data
            </h2>
            <div className="space-y-3">
              {weatherData ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Temperature</label>
                    <p className="text-2xl font-bold text-blue-600">
                      {kelvinToCelsius(weatherData.main.temp)}°C
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Description</label>
                    <p className="text-lg text-gray-900 capitalize">
                      {weatherData.weather[0]?.description}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Humidity</label>
                    <p className="text-lg text-gray-900">{weatherData.main.humidity}%</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No weather data available</p>
              )}
            </div>
          </div>
          {}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coordinates & Time
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Latitude</label>
                <p className="text-lg font-mono text-gray-900">{city.coord.lat.toFixed(6)}°</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Longitude</label>
                <p className="text-lg font-mono text-gray-900">{city.coord.lon.toFixed(6)}°</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">State</label>
                <p className="text-lg text-gray-900">{city.state || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Location Map</h2>
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-lg font-medium">Map Integration</p>
              <p className="text-sm">
                Coordinates: {city.coord.lat.toFixed(4)}°, {city.coord.lon.toFixed(4)}°
              </p>
              <p className="text-xs mt-2 text-gray-400">
                Map component can be integrated here
              </p>
            </div>
          </div>
        </div>
        {}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">City ID</label>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">{city.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CityDetailPage;

