'use client';
import React, { useState, useEffect } from 'react';
import AutoSuggestions from '@/components/AutoSuggestions';
import SearchResultsList from '@/components/SearchResultsList';
import { City } from '@/model/CityModel';
import { CityService } from '@/service/cityService';
const SearchPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [recentSearches, setRecentSearches] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  useEffect(() => {
    CityService.loadCities();
    const stored = localStorage.getItem('recentCitySearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);
  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    const updatedRecent = [
      city,
      ...recentSearches.filter(c => c.id !== city.id)
    ].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentCitySearches', JSON.stringify(updatedRecent));
    window.location.href = `/detail/${city.id}`;
  };
  const handleRecentCityClick = (city: City) => {
    setSelectedCity(city);
    window.location.href = `/detail/${city.id}`;
  };
  const handleSearch = (query: string, results: City[]) => {
    setSearchQuery(query);
    setSearchResults(results);
  };
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentCitySearches');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 md:py-8 px-4">
      <div className="w-full max-w-[1024px] mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Weather Forecast
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Get detailed weather forecasts for cities around the world
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8 overflow-hidden">
          <div className="mb-6">
            <label htmlFor="city-search" className="block text-sm font-medium text-gray-700 mb-2">
              Search for a city to get weather forecast
            </label>
            <div className="w-full max-w-xl mx-auto">
              <AutoSuggestions
                placeholder="Type a city name (e.g., Bangkok, New York)..."
                onSelect={handleCitySelect}
                onSearch={handleSearch}
                className="w-full"
                minQueryLength={1}
                debounceMs={300}
                maxSuggestions={8}
              />
            </div>
          </div>
          {recentSearches.length > 0 && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="relative">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory scroll-smooth">
                  {recentSearches.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleRecentCityClick(city)}
                      className="
                        group relative px-4 py-3 bg-gray-100 hover:bg-blue-50 rounded-lg text-sm
                        transition-all duration-150 border border-gray-200 hover:border-blue-300
                        text-gray-700 hover:text-blue-700 overflow-hidden flex-shrink-0 snap-start
                        min-w-[130px] max-w-[160px] h-16
                      "
                      title={`${city.name}, ${city.country}`}
                    >
                      <div className="text-left h-full flex flex-col justify-center">
                        <div className="font-medium truncate">{city.name}</div>
                        <div className="text-xs text-gray-500 group-hover:text-blue-500 truncate">{city.country}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {recentSearches.length > 3 && (
                  <div className="absolute top-0 right-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                )}
              </div>
            </div>
          )}
        </div>
        {searchQuery && searchResults.length >= 0 && (
          <SearchResultsList
            query={searchQuery}
            results={searchResults}
            onCitySelect={handleCitySelect}
            className="mb-8"
          />
        )}
        {!searchQuery && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              How to get weather forecast
            </h2>
            <ul className="space-y-3 text-gray-600 text-sm md:text-base">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  1
                </span>
                <span>Type at least 1 character in the search box to see city suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  2
                </span>
                <span>Use arrow keys to navigate through suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  3
                </span>
                <span>Press Enter to select a city or click on it</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  4
                </span>
                <span>Click the search button to see all matching cities in a list</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  5
                </span>
                <span>View current weather, 5-day forecast, and hourly details</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  6
                </span>
                <span>Your recent searches will be saved for quick access</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchPage;

