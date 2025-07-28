'use client';
import React from 'react';
import { City } from '@/model/CityModel';
import { CityService } from '@/service/cityService';
import WeatherIcon from './WeatherIcon';
import { kelvinToCelsius, calculateRainProbability } from '@/utils/weatherUtils';
const getTimezoneFromCoordinates = (lat: number, lon: number): string => {
  const utcOffset = Math.round(lon / 15);
  if (lon >= 97 && lon <= 107 && lat >= 5 && lat <= 25) {
    return 'Asia/Bangkok';
  } else if (lon >= 100 && lon <= 145 && lat >= -45 && lat <= -10) {
    return 'Australia/Sydney';
  } else if (lon >= 116 && lon <= 130 && lat >= 35 && lat <= 45) {
    return 'Asia/Tokyo';
  } else if (lon >= 73 && lon <= 135 && lat >= 5 && lat <= 55) {
    return 'Asia/Kolkata';
  } else if (lon >= -10 && lon <= 30 && lat >= 35 && lat <= 70) {
    return 'Europe/London';
  } else if (lon >= -130 && lon <= -60 && lat >= 25 && lat <= 50) {
    return 'America/New_York';
  } else if (lon >= -80 && lon <= -30 && lat >= -55 && lat <= 15) {
    return 'America/Sao_Paulo';
  }
  return utcOffset >= 0 ? `Etc/GMT-${utcOffset}` : `Etc/GMT+${Math.abs(utcOffset)}`;
};
interface SearchResultsListProps {
  query: string;
  results: City[];
  onCitySelect?: (city: City) => void;
  className?: string;
}
const SearchResultsList: React.FC<SearchResultsListProps> = ({
  query,
  results,
  onCitySelect,
  className = ""
}) => {
  const getWeatherDataForCity = (city: City) => {
    return CityService.getWeatherData(city.id);
  };
  const formatCityTime = (city: City) => {
    const weatherData = getWeatherDataForCity(city);
    if (!weatherData?.time) {
      const now = new Date();
      return now.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    try {
      const timezone = getTimezoneFromCoordinates(city.coord.lat, city.coord.lon);
      const date = new Date(weatherData.time * 1000);
      return date.toLocaleTimeString('th-TH', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.warn('Error formatting city time:', error);
      const now = new Date();
      return now.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  };
  const getTemperatureColor = (tempCelsius: number): string => {
    if (tempCelsius >= 35) {
      return 'from-red-500 to-red-600';
    } else if (tempCelsius >= 30) {
      return 'from-orange-500 to-red-500';
    } else if (tempCelsius >= 25) {
      return 'from-yellow-500 to-orange-500';
    } else if (tempCelsius >= 20) {
      return 'from-green-500 to-yellow-500';
    } else if (tempCelsius >= 15) {
      return 'from-blue-500 to-green-500';
    } else if (tempCelsius >= 10) {
      return 'from-blue-600 to-blue-500';
    } else {
      return 'from-blue-700 to-purple-600';
    }
  };
  if (!query) return null;
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-t-lg border border-gray-200 px-6 py-4 border-b-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Search Results
          </h2>
          <div className="text-sm text-gray-500">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </div>
        </div>
      </div>
      <div className="bg-white rounded-b-lg border border-gray-200 max-h-96 overflow-y-auto">
        {results.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {results.map((city, index) => {
              const weatherData = getWeatherDataForCity(city);
              const rainProbability = weatherData?.weather?.[0] 
                ? calculateRainProbability(
                    weatherData.weather[0].main, 
                    weatherData.weather[0].description,
                    weatherData.clouds?.all
                  )
                : 0;
              return (
                <div
                  key={city.id}
                  onClick={() => onCitySelect?.(city)}
                  className="px-6 py-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 relative">
                          {weatherData?.weather?.[0]?.icon ? (
                            <div className="relative">
                              <div className={`absolute -bottom-2 -right-2 bg-gradient-to-br ${getTemperatureColor(kelvinToCelsius(weatherData.main.temp))} text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white z-0`}>
                                <span className="text-xs font-bold leading-none">
                                  {kelvinToCelsius(weatherData.main.temp)}°
                                </span>
                              </div>
                              <div className="relative z-10">
                                <WeatherIcon 
                                  iconCode={weatherData.weather[0].icon} 
                                  size="md"
                                  theme="auto"
                                  timestamp={weatherData.time}
                                  timezone={getTimezoneFromCoordinates(city.coord.lat, city.coord.lon)}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center relative">
                              {weatherData && (
                                <div className={`absolute -bottom-2 -right-2 bg-gradient-to-br ${getTemperatureColor(kelvinToCelsius(weatherData.main.temp))} text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white z-0`}>
                                  <span className="text-xs font-bold leading-none">
                                    {kelvinToCelsius(weatherData.main.temp)}°
                                  </span>
                                </div>
                              )}
                              <svg className="w-6 h-6 text-blue-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.004 4.004 0 003 15z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-semibold text-gray-900 truncate">
                            {city.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {formatCityTime(city)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 space-x-3">
                            {weatherData ? (
                              <>
                                <span>💧 {weatherData.main.humidity}%</span>
                                <span>🌧️ {rainProbability}%</span>
                              </>
                            ) : (
                              <span>Weather data not available</span>
                            )}
                            {city.state && <span>• {city.state}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6 flex-shrink-0 flex flex-col items-end space-y-2">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {city.country}
                      </span>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center">
                        Detail
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cities found</h3>
            <p className="text-gray-500">
              No cities match your search for &ldquo;{query}&rdquo;. Try searching with a different term or check your spelling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchResultsList;

