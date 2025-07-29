import { useState, useEffect, useCallback } from 'react';
import { City } from '@/model/CityModel';
import { SuggestionResult } from '@/model/SuggestionResult';
import { CityService } from '@/service/cityService';
interface UseAutoSuggestionsOptions {
  minQueryLength?: number;
  debounceMs?: number;
  maxSuggestions?: number;
}
interface UseAutoSuggestionsReturn {
  query: string;
  setQuery: (query: string) => void;
  suggestions: City[];
  isLoading: boolean;
  hasMore: boolean;
  total: number;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  selectSuggestion: (city: City) => void;
  clearSuggestions: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  showSuggestions: boolean;
}
export function useAutoSuggestions(
  onSelect?: (city: City) => void,
  options: UseAutoSuggestionsOptions = {}
): UseAutoSuggestionsReturn {
  const {
    minQueryLength = 2,
    debounceMs = 300,
    maxSuggestions = 10
  } = options;
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);
  useEffect(() => {
    if (debouncedQuery.length >= minQueryLength) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const result: SuggestionResult = CityService.searchCities(
          debouncedQuery,
          maxSuggestions
        );
        setSuggestions(result.cities);
        setHasMore(result.hasMore);
        setTotal(result.total);
        setSelectedIndex(-1);
        setShowSuggestions(true);
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setHasMore(false);
      setTotal(0);
      setSelectedIndex(-1);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  }, [debouncedQuery, minQueryLength, maxSuggestions]);
  const selectSuggestion = useCallback((city: City) => {
    setQuery(city.name);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    onSelect?.(city);
  }, [onSelect]);
  const clearSuggestions = useCallback(() => {
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  }, []);
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        clearSuggestions();
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex, selectSuggestion, clearSuggestions]);
  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    hasMore,
    total,
    selectedIndex,
    setSelectedIndex,
    selectSuggestion,
    clearSuggestions,
    handleKeyDown,
    showSuggestions
  };
}

