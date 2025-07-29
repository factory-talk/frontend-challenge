import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutoSuggestions } from '@/hooks/useAutoSuggestions';
import { CityService } from '@/service/cityService';
import { City } from '@/model/CityModel';

// Mock the CityService
jest.mock('@/service/cityService');

const mockCities: City[] = [
  {
    id: 1,
    name: 'Bangkok',
    state: '',
    country: 'TH',
    coord: { lon: 100.5167, lat: 13.75 }
  },
  {
    id: 2,
    name: 'Barcelona',
    state: '',
    country: 'ES',
    coord: { lon: 2.1734, lat: 41.3851 }
  },
  {
    id: 3,
    name: 'Berlin',
    state: '',
    country: 'DE',
    coord: { lon: 13.4105, lat: 52.5244 }
  }
];

const mockedCityService = CityService as jest.Mocked<typeof CityService>;

describe('useAutoSuggestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useAutoSuggestions());

      expect(result.current.query).toBe('');
      expect(result.current.suggestions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasMore).toBe(false);
      expect(result.current.total).toBe(0);
      expect(result.current.selectedIndex).toBe(-1);
      expect(result.current.showSuggestions).toBe(false);
    });

    it('should update query when setQuery is called', () => {
      const { result } = renderHook(() => useAutoSuggestions());

      act(() => {
        result.current.setQuery('Bangkok');
      });

      expect(result.current.query).toBe('Bangkok');
    });
  });

  describe('debouncing', () => {
    it('should debounce query changes', async () => {
      mockedCityService.searchCities.mockReturnValue({
        cities: mockCities,
        hasMore: false,
        total: 3
      });

      const { result } = renderHook(() => useAutoSuggestions(undefined, { debounceMs: 300 }));

      // Set query multiple times quickly
      act(() => {
        result.current.setQuery('B');
      });
      act(() => {
        result.current.setQuery('Ba');
      });
      act(() => {
        result.current.setQuery('Ban');
      });

      // Fast-forward debounce time
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Fast-forward search delay
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockedCityService.searchCities).toHaveBeenCalledTimes(1);
        expect(mockedCityService.searchCities).toHaveBeenCalledWith('Ban', 10);
      });
    });

    it('should use custom debounce time', async () => {
      mockedCityService.searchCities.mockReturnValue({
        cities: mockCities,
        hasMore: false,
        total: 3
      });

      const { result } = renderHook(() => useAutoSuggestions(undefined, { debounceMs: 500 }));

      act(() => {
        result.current.setQuery('Bangkok');
      });

      // Should not search yet
      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(mockedCityService.searchCities).not.toHaveBeenCalled();

      // Should search now
      act(() => {
        jest.advanceTimersByTime(100);
      });
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockedCityService.searchCities).toHaveBeenCalled();
      });
    });
  });

  describe('search functionality', () => {
    it('should search when query meets minimum length', async () => {
      mockedCityService.searchCities.mockReturnValue({
        cities: mockCities,
        hasMore: false,
        total: 3
      });

      const { result } = renderHook(() => useAutoSuggestions());

      act(() => {
        result.current.setQuery('Ba');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.suggestions).toEqual(mockCities);
        expect(result.current.showSuggestions).toBe(true);
        expect(result.current.total).toBe(3);
      });
    });

    it('should not search when query is below minimum length', async () => {
      const { result } = renderHook(() => useAutoSuggestions());

      act(() => {
        result.current.setQuery('B');
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(mockedCityService.searchCities).not.toHaveBeenCalled();
      expect(result.current.suggestions).toEqual([]);
      expect(result.current.showSuggestions).toBe(false);
    });

    it('should use custom minimum query length', async () => {
      mockedCityService.searchCities.mockReturnValue({
        cities: mockCities,
        hasMore: false,
        total: 3
      });

      const { result } = renderHook(() => useAutoSuggestions(undefined, { minQueryLength: 3 }));

      // Should not search with 2 characters
      act(() => {
        result.current.setQuery('Ba');
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(mockedCityService.searchCities).not.toHaveBeenCalled();

      // Should search with 3 characters
      act(() => {
        result.current.setQuery('Ban');
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(mockedCityService.searchCities).toHaveBeenCalled();
      });
    });

    it('should use custom max suggestions', async () => {
      mockedCityService.searchCities.mockReturnValue({
        cities: mockCities.slice(0, 5),
        hasMore: true,
        total: 10
      });

      const { result } = renderHook(() => useAutoSuggestions(undefined, { maxSuggestions: 5 }));

      act(() => {
        result.current.setQuery('Ba');
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(mockedCityService.searchCities).toHaveBeenCalledWith('Ba', 5);
      });
    });
  });

  describe('loading state', () => {
    it('should show loading state during search', () => {
      mockedCityService.searchCities.mockReturnValue({
        cities: mockCities,
        hasMore: false,
        total: 3
      });

      const { result } = renderHook(() => useAutoSuggestions());

      act(() => {
        result.current.setQuery('Bangkok');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('selection functionality', () => {
    beforeEach(async () => {
      mockedCityService.searchCities.mockReturnValue({
        cities: mockCities,
        hasMore: false,
        total: 3
      });
    });

    it('should handle suggestion selection', async () => {
      const onSelect = jest.fn();
      const { result } = renderHook(() => useAutoSuggestions(onSelect));

      // Load suggestions first
      act(() => {
        result.current.setQuery('Ba');
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.suggestions).toHaveLength(3);
      });

      // Select a suggestion
      act(() => {
        result.current.selectSuggestion(mockCities[0]);
      });

      expect(result.current.query).toBe('Bangkok');
      expect(result.current.showSuggestions).toBe(false);
      expect(result.current.suggestions).toEqual([]);
      expect(result.current.selectedIndex).toBe(-1);
      expect(onSelect).toHaveBeenCalledWith(mockCities[0]);
    });

    it('should clear suggestions', async () => {
      const { result } = renderHook(() => useAutoSuggestions());

      // Load suggestions first
      act(() => {
        result.current.setQuery('Ba');
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.showSuggestions).toBe(true);
      });

      // Clear suggestions
      act(() => {
        result.current.clearSuggestions();
      });

      expect(result.current.showSuggestions).toBe(false);
      expect(result.current.suggestions).toEqual([]);
      expect(result.current.selectedIndex).toBe(-1);
    });

    it('should update selected index', async () => {
      const { result } = renderHook(() => useAutoSuggestions());

      act(() => {
        result.current.setSelectedIndex(2);
      });

      expect(result.current.selectedIndex).toBe(2);
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(async () => {
      mockedCityService.searchCities.mockReturnValue({
        cities: mockCities,
        hasMore: false,
        total: 3
      });
    });

    it('should handle ArrowDown key', async () => {
      const { result } = renderHook(() => useAutoSuggestions());

      // Load suggestions first
      act(() => {
        result.current.setQuery('Ba');
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.suggestions).toHaveLength(3);
      });

      // Simulate ArrowDown key
      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: jest.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.selectedIndex).toBe(0);
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      // Press ArrowDown again
      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.selectedIndex).toBe(1);
    });

    it('should handle ArrowUp key', async () => {
      const { result } = renderHook(() => useAutoSuggestions());

      // Load suggestions and set selected index
      act(() => {
        result.current.setQuery('Ba');
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.suggestions).toHaveLength(3);
      });

      act(() => {
        result.current.setSelectedIndex(2);
      });

      // Simulate ArrowUp key
      const mockEvent = {
        key: 'ArrowUp',
        preventDefault: jest.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.selectedIndex).toBe(1);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should handle Enter key to select suggestion', async () => {
      const onSelect = jest.fn();
      const { result } = renderHook(() => useAutoSuggestions(onSelect));

      // Load suggestions and set selected index
      act(() => {
        result.current.setQuery('Ba');
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.suggestions).toHaveLength(3);
      });

      act(() => {
        result.current.setSelectedIndex(1);
      });

      // Simulate Enter key
      const mockEvent = {
        key: 'Enter',
        preventDefault: jest.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(onSelect).toHaveBeenCalledWith(mockCities[1]);
    });

    it('should handle Escape key to clear suggestions', async () => {
      const { result } = renderHook(() => useAutoSuggestions());

      // Load suggestions first
      act(() => {
        result.current.setQuery('Ba');
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.showSuggestions).toBe(true);
      });

      // Simulate Escape key
      const mockEvent = {
        key: 'Escape',
        preventDefault: jest.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.showSuggestions).toBe(false);
    });

    it('should not handle keys when no suggestions are shown', () => {
      const { result } = renderHook(() => useAutoSuggestions());

      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: jest.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      // Should not change selected index
      expect(result.current.selectedIndex).toBe(-1);
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should not move beyond array bounds with ArrowDown', async () => {
      const { result } = renderHook(() => useAutoSuggestions());

      // Load suggestions
      act(() => {
        result.current.setQuery('Ba');
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.suggestions).toHaveLength(3);
      });

      // Set to last index
      act(() => {
        result.current.setSelectedIndex(2);
      });

      // Try to go beyond
      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: jest.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.selectedIndex).toBe(2); // Should stay at last index
    });

    it('should not move beyond array bounds with ArrowUp', async () => {
      const { result } = renderHook(() => useAutoSuggestions());

      // Load suggestions
      act(() => {
        result.current.setQuery('Ba');
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.suggestions).toHaveLength(3);
      });

      // Set to first index
      act(() => {
        result.current.setSelectedIndex(0);
      });

      // Try to go before first
      const mockEvent = {
        key: 'ArrowUp',
        preventDefault: jest.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.selectedIndex).toBe(-1); // Should go to -1 (no selection)
    });
  });
});
