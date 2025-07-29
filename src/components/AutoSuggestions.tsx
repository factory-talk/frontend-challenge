'use client';
import React, { useRef, useEffect } from 'react';
import { City } from '@/model/CityModel';
import { useAutoSuggestions } from '@/hooks/useAutoSuggestions';
interface AutoSuggestionsProps {
  placeholder?: string;
  onSelect?: (city: City) => void;
  onSearch?: (query: string, results: City[]) => void;
  className?: string;
  inputClassName?: string;
  suggestionsClassName?: string;
  maxSuggestions?: number;
  minQueryLength?: number;
  debounceMs?: number;
}
const AutoSuggestions: React.FC<AutoSuggestionsProps> = ({
  placeholder = "Search for cities...",
  onSelect,
  onSearch,
  className = "",
  inputClassName = "",
  suggestionsClassName = "",
  maxSuggestions = 10,
  minQueryLength = 2,
  debounceMs = 300
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    hasMore,
    total,
    selectedIndex,
    selectSuggestion,
    clearSuggestions,
    handleKeyDown,
    showSuggestions
  } = useAutoSuggestions(onSelect, {
    minQueryLength,
    debounceMs,
    maxSuggestions
  });
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<City[]>([]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        clearSuggestions();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSuggestions]);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  const handleSearch = () => {
    if (query.trim().length >= minQueryLength) {
      import('@/service/cityService').then(({ CityService }) => {
        const results = CityService.searchCities(query, 50);
        setSearchResults(results.cities);
        if (onSearch) {
          onSearch(query, results.cities);
        }
        clearSuggestions();
      });
    }
  };
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !showSuggestions) {
      event.preventDefault();
      handleSearch();
    } else {
      handleKeyDown(event);
    }
  };
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="font-semibold text-blue-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleSearchKeyDown}
          placeholder={placeholder}
          className={`
            flex-1 px-4 py-3 text-lg text-gray-900 border border-gray-300 rounded-l-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            placeholder-gray-400 transition-all duration-200 bg-white min-w-0
            ${inputClassName}
          `}
          autoComplete="off"
        />
        <button
          onClick={handleSearch}
          disabled={query.trim().length < minQueryLength}
          title="Search cities"
          className={`
            px-3 py-3 bg-blue-600 text-white rounded-r-lg border border-blue-600
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors duration-200 flex items-center justify-center
            disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0 w-12
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        {isLoading && (
          <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      {showSuggestions && (
        <div className={`
          absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg
          max-h-96 overflow-y-auto ${suggestionsClassName}
        `}>
          {suggestions.length > 0 ? (
            <>
              {total > 0 && (
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  {total === 1 ? '1 result' : `${total} results`}
                  {hasMore && ` (showing first ${suggestions.length})`}
                </div>
              )}
              {suggestions.map((city, index) => (
                <div
                  key={city.id}
                  onClick={() => selectSuggestion(city)}
                  className={`
                    px-4 py-3 cursor-pointer transition-colors duration-150
                    hover:bg-gray-50 border-b border-gray-50 last:border-b-0
                    ${selectedIndex === index ? 'bg-blue-50 border-blue-100' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-medium text-gray-900 truncate">
                        {highlightMatch(city.name, query)}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {city.country}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {city.country}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            query.length >= minQueryLength && !isLoading && (
              <div className="px-4 py-8 text-center text-gray-500">
                <div className="text-lg">No cities found</div>
                <div className="text-sm mt-1">
                  Try searching with a different term
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
export default AutoSuggestions;

