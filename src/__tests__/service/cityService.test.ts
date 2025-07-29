import { CityService } from '@/service/cityService';
import { City } from '@/model/CityModel';
import { WeatherData } from '@/model/WeatherData';

// Mock fetch globally
global.fetch = jest.fn();

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
    name: 'London',
    state: '',
    country: 'GB',
    coord: { lon: -0.1257, lat: 51.5085 }
  },
  {
    id: 3,
    name: 'New York',
    state: 'NY',
    country: 'US',
    coord: { lon: -74.006, lat: 40.7143 }
  },
  {
    id: 4,
    name: 'Bangkok Metropolitan',
    state: '',
    country: 'TH',
    coord: { lon: 100.5167, lat: 13.75 }
  }
];

const mockWeatherData = `{"city":{"id":1,"name":"Bangkok","coord":{"lat":13.75,"lon":100.5167},"country":"TH","population":5104476,"timezone":25200},"time":1610989200,"main":{"temp":299.15,"feels_like":302.78,"temp_min":299.15,"temp_max":299.15,"pressure":1013,"humidity":78},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"wind":{"speed":2.57,"deg":250},"clouds":{"all":75}}
{"city":{"id":2,"name":"London","coord":{"lat":51.5085,"lon":-0.1257},"country":"GB","population":1000000,"timezone":0},"time":1610989200,"main":{"temp":275.15,"feels_like":270.93,"temp_min":275.15,"temp_max":275.15,"pressure":1020,"humidity":81},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"wind":{"speed":4.12,"deg":230},"clouds":{"all":90}}`;

describe('CityService', () => {
  beforeEach(() => {
    // Reset the service state
    (CityService as any).cities = [];
    (CityService as any).weatherData = [];
    (CityService as any).isLoaded = false;
    jest.clearAllMocks();
  });

  describe('loadCities', () => {
    it('should load cities and weather data successfully', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCities)
        })
        .mockResolvedValueOnce({
          text: () => Promise.resolve(mockWeatherData)
        });

      await CityService.loadCities();

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith('/data/city.list.json');
      expect(fetch).toHaveBeenCalledWith('/data/weather_16.json');
      expect(CityService.isDataLoaded()).toBe(true);
      expect(CityService.getCitiesCount()).toBe(4);
    });

    it('should handle failure to load city data', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      await CityService.loadCities();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load city data:', expect.any(Error));
      expect(CityService.isDataLoaded()).toBe(false);
      expect(CityService.getCitiesCount()).toBe(0);
      
      consoleSpy.mockRestore();
    });

    it('should handle failure to load weather data but still load cities', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCities)
        })
        .mockRejectedValueOnce(new Error('Weather data error'));

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await CityService.loadCities();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load weather data:', expect.any(Error));
      expect(CityService.isDataLoaded()).toBe(true);
      expect(CityService.getCitiesCount()).toBe(4);
      
      consoleSpy.mockRestore();
    });

    it('should handle invalid weather data lines', async () => {
      const invalidWeatherData = `{"valid":"data"}
      invalid json line
      {"another":"valid","line":"data"}`;

      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCities)
        })
        .mockResolvedValueOnce({
          text: () => Promise.resolve(invalidWeatherData)
        });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await CityService.loadCities();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse weather data line:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('searchCities', () => {
    beforeEach(async () => {
      // Load mock cities
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCities)
        })
        .mockResolvedValueOnce({
          text: () => Promise.resolve(mockWeatherData)
        });

      await CityService.loadCities();
    });

    it('should return empty result for empty query', () => {
      const result = CityService.searchCities('');
      expect(result).toEqual({
        cities: [],
        hasMore: false,
        total: 0
      });
    });

    it('should return empty result for whitespace query', () => {
      const result = CityService.searchCities('   ');
      expect(result).toEqual({
        cities: [],
        hasMore: false,
        total: 0
      });
    });

    it('should search cities by name', () => {
      const result = CityService.searchCities('Bangkok');
      expect(result.cities).toHaveLength(2);
      expect(result.cities[0].name).toBe('Bangkok');
      expect(result.cities[1].name).toBe('Bangkok Metropolitan');
      expect(result.total).toBe(2);
      expect(result.hasMore).toBe(false);
    });

    it('should search cities by country', () => {
      const result = CityService.searchCities('TH');
      expect(result.cities).toHaveLength(2);
      expect(result.cities.every(city => city.country === 'TH')).toBe(true);
    });

    it('should be case insensitive', () => {
      const result = CityService.searchCities('bangkok');
      expect(result.cities).toHaveLength(2);
      expect(result.cities[0].name).toBe('Bangkok');
    });

    it('should sort results with exact matches first', () => {
      const result = CityService.searchCities('Bangkok');
      expect(result.cities[0].name).toBe('Bangkok'); // Exact match first
      expect(result.cities[1].name).toBe('Bangkok Metropolitan'); // Partial match second
    });

    it('should sort results with "starts with" matches before contains', () => {
      const result = CityService.searchCities('Bang');
      expect(result.cities[0].name).toBe('Bangkok'); // Starts with "Bang"
      expect(result.cities[1].name).toBe('Bangkok Metropolitan'); // Also starts with "Bang"
    });

    it('should respect limit parameter', () => {
      const result = CityService.searchCities('Bang', 1);
      expect(result.cities).toHaveLength(1);
      expect(result.hasMore).toBe(true);
      expect(result.total).toBe(2);
    });

    it('should respect offset parameter', () => {
      const result = CityService.searchCities('Bang', 10, 1);
      expect(result.cities).toHaveLength(1);
      expect(result.cities[0].name).toBe('Bangkok Metropolitan');
      expect(result.hasMore).toBe(false);
      expect(result.total).toBe(2);
    });

    it('should handle pagination correctly', () => {
      const firstPage = CityService.searchCities('Bang', 1, 0);
      const secondPage = CityService.searchCities('Bang', 1, 1);

      expect(firstPage.cities).toHaveLength(1);
      expect(firstPage.hasMore).toBe(true);
      expect(secondPage.cities).toHaveLength(1);
      expect(secondPage.hasMore).toBe(false);
    });
  });

  describe('getCityById', () => {
    beforeEach(async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCities)
        })
        .mockResolvedValueOnce({
          text: () => Promise.resolve(mockWeatherData)
        });

      await CityService.loadCities();
    });

    it('should return city by ID', () => {
      const city = CityService.getCityById(1);
      expect(city).toEqual(mockCities[0]);
    });

    it('should return undefined for non-existent ID', () => {
      const city = CityService.getCityById(999);
      expect(city).toBeUndefined();
    });
  });

  describe('getAllCities', () => {
    beforeEach(async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCities)
        })
        .mockResolvedValueOnce({
          text: () => Promise.resolve(mockWeatherData)
        });

      await CityService.loadCities();
    });

    it('should return copy of all cities', () => {
      const cities = CityService.getAllCities();
      expect(cities).toHaveLength(4);
      expect(cities).not.toBe((CityService as any).cities); // Should be a copy
      expect(cities).toEqual(mockCities);
    });
  });

  describe('getWeatherData', () => {
    beforeEach(async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCities)
        })
        .mockResolvedValueOnce({
          text: () => Promise.resolve(mockWeatherData)
        });

      await CityService.loadCities();
    });

    it('should return weather data for existing city', () => {
      const weatherData = CityService.getWeatherData(1);
      expect(weatherData).toBeDefined();
      expect(weatherData?.city.id).toBe(1);
      expect(weatherData?.city.name).toBe('Bangkok');
    });

    it('should return undefined for non-existent city', () => {
      const weatherData = CityService.getWeatherData(999);
      expect(weatherData).toBeUndefined();
    });
  });

  describe('getAllWeatherData', () => {
    beforeEach(async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCities)
        })
        .mockResolvedValueOnce({
          text: () => Promise.resolve(mockWeatherData)
        });

      await CityService.loadCities();
    });

    it('should return copy of all weather data', () => {
      const weatherData = CityService.getAllWeatherData();
      expect(weatherData).toHaveLength(2);
      expect(weatherData).not.toBe((CityService as any).weatherData); // Should be a copy
    });
  });

  describe('isDataLoaded', () => {
    it('should return false initially', () => {
      expect(CityService.isDataLoaded()).toBe(false);
    });

    it('should return true after successful load', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCities)
        })
        .mockResolvedValueOnce({
          text: () => Promise.resolve(mockWeatherData)
        });

      await CityService.loadCities();
      expect(CityService.isDataLoaded()).toBe(true);
    });

    it('should return false after failed load', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      await CityService.loadCities();
      expect(CityService.isDataLoaded()).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('getCitiesCount', () => {
    it('should return 0 initially', () => {
      expect(CityService.getCitiesCount()).toBe(0);
    });

    it('should return correct count after loading', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCities)
        })
        .mockResolvedValueOnce({
          text: () => Promise.resolve(mockWeatherData)
        });

      await CityService.loadCities();
      expect(CityService.getCitiesCount()).toBe(4);
    });
  });
});
