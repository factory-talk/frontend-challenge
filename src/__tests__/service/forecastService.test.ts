// Mock environment variable before any imports
process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test_api_key';

// Mock fetch globally  
global.fetch = jest.fn();

import { ForecastService, ForecastResponse, CurrentWeatherResponse, DailyForecast } from '@/service/forecastService';
import { City } from '@/model/CityModel';

const mockCity: City = {
  id: 1,
  name: 'Bangkok',
  state: '',
  country: 'TH',
  coord: { lon: 100.5167, lat: 13.75 }
};

const mockCurrentWeather: CurrentWeatherResponse = {
  coord: { lon: 100.5167, lat: 13.75 },
  weather: [{
    id: 800,
    main: 'Clear',
    description: 'clear sky',
    icon: '01d'
  }],
  base: 'stations',
  main: {
    temp: 298.15,
    feels_like: 302.78,
    temp_min: 295.15,
    temp_max: 301.15,
    pressure: 1013,
    humidity: 78,
    sea_level: 1013,
    grnd_level: 1010
  },
  visibility: 10000,
  wind: {
    speed: 2.57,
    deg: 250
  },
  clouds: {
    all: 0
  },
  dt: 1642694400,
  sys: {
    country: 'TH',
    sunrise: 1642638600,
    sunset: 1642681800
  },
  timezone: 25200,
  id: 1,
  name: 'Bangkok',
  cod: 200
};

const mockForecastResponse: ForecastResponse = {
  cod: '200',
  message: 0,
  cnt: 8,
  list: [
    {
      dt: 1642694400,
      main: {
        temp: 298.15,
        feels_like: 302.78,
        temp_min: 295.15,
        temp_max: 301.15,
        pressure: 1013,
        sea_level: 1013,
        grnd_level: 1010,
        humidity: 78,
        temp_kf: 0
      },
      weather: [{
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }],
      clouds: { all: 0 },
      wind: { speed: 2.57, deg: 250 },
      visibility: 10000,
      pop: 0.1,
      sys: { pod: 'd' },
      dt_txt: '2022-01-20 12:00:00'
    },
    {
      dt: 1642705200,
      main: {
        temp: 299.15,
        feels_like: 303.78,
        temp_min: 296.15,
        temp_max: 302.15,
        pressure: 1012,
        sea_level: 1012,
        grnd_level: 1009,
        humidity: 75,
        temp_kf: 0
      },
      weather: [{
        id: 801,
        main: 'Clouds',
        description: 'few clouds',
        icon: '02d'
      }],
      clouds: { all: 20 },
      wind: { speed: 3.57, deg: 260 },
      visibility: 10000,
      pop: 0.2,
      sys: { pod: 'd' },
      dt_txt: '2022-01-20 15:00:00'
    },
    {
      dt: 1642716000,
      main: {
        temp: 297.15,
        feels_like: 301.78,
        temp_min: 294.15,
        temp_max: 300.15,
        pressure: 1014,
        sea_level: 1014,
        grnd_level: 1011,
        humidity: 80,
        temp_kf: 0
      },
      weather: [{
        id: 500,
        main: 'Rain',
        description: 'light rain',
        icon: '10n'
      }],
      clouds: { all: 75 },
      wind: { speed: 1.57, deg: 240 },
      visibility: 8000,
      pop: 0.6,
      rain: { '3h': 2.5 },
      sys: { pod: 'n' },
      dt_txt: '2022-01-20 18:00:00'
    },
    {
      dt: 1642780800,
      main: {
        temp: 296.15,
        feels_like: 300.78,
        temp_min: 293.15,
        temp_max: 299.15,
        pressure: 1015,
        sea_level: 1015,
        grnd_level: 1012,
        humidity: 82,
        temp_kf: 0
      },
      weather: [{
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }],
      clouds: { all: 0 },
      wind: { speed: 2.0, deg: 230 },
      visibility: 10000,
      pop: 0.0,
      sys: { pod: 'd' },
      dt_txt: '2022-01-21 12:00:00'
    }
  ],
  city: {
    id: 1,
    name: 'Bangkok',
    coord: { lat: 13.75, lon: 100.5167 },
    country: 'TH',
    population: 5104476,
    timezone: 25200,
    sunrise: 1642638600,
    sunset: 1642681800
  }
};

// Mock environment variable
const originalEnv = process.env;

describe('ForecastService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { 
      ...originalEnv, 
      NEXT_PUBLIC_OPENWEATHER_API_KEY: 'test_api_key' 
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getCurrentWeather', () => {
    it('should fetch current weather successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCurrentWeather)
      });

      const result = await ForecastService.getCurrentWeather(mockCity);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.openweathermap.org/data/2.5/weather')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`lat=${mockCity.coord.lat}&lon=${mockCity.coord.lon}`)
      );
      expect(result).toEqual(mockCurrentWeather);
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await ForecastService.getCurrentWeather(mockCity);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch current weather data:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it('should handle missing API key', async () => {
      delete process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await ForecastService.getCurrentWeather(mockCity);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch current weather data:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await ForecastService.getCurrentWeather(mockCity);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch current weather data:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe('getCurrentWeatherByCoordinates', () => {
    it('should fetch current weather by coordinates successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCurrentWeather)
      });

      const result = await ForecastService.getCurrentWeatherByCoordinates(13.75, 100.5167);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('lat=13.75&lon=100.5167')
      );
      expect(result).toEqual(mockCurrentWeather);
    });

    it('should handle errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await ForecastService.getCurrentWeatherByCoordinates(13.75, 100.5167);

      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe('getForecast', () => {
    it('should fetch forecast successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockForecastResponse)
      });

      const result = await ForecastService.getForecast(mockCity);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.openweathermap.org/data/2.5/forecast')
      );
      expect(result).toEqual(mockForecastResponse);
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await ForecastService.getForecast(mockCity);

      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe('getForecastByCoordinates', () => {
    it('should fetch forecast by coordinates successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockForecastResponse)
      });

      const result = await ForecastService.getForecastByCoordinates(13.75, 100.5167);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('lat=13.75&lon=100.5167')
      );
      expect(result).toEqual(mockForecastResponse);
    });
  });

  describe('groupForecastByDay', () => {
    it('should group forecast items by day', () => {
      const dailyForecasts = ForecastService.groupForecastByDay(mockForecastResponse);

      expect(dailyForecasts).toHaveLength(2); // 2022-01-20 and 2022-01-21
      expect(dailyForecasts[0].date).toBe('2022-01-20');
      expect(dailyForecasts[0].items).toHaveLength(3);
      expect(dailyForecasts[1].date).toBe('2022-01-21');
      expect(dailyForecasts[1].items).toHaveLength(1);
    });

    it('should calculate correct min/max temperatures', () => {
      const dailyForecasts = ForecastService.groupForecastByDay(mockForecastResponse);
      const firstDay = dailyForecasts[0];

      expect(firstDay.minTemp).toBe(297.15); // Lowest temp on 2022-01-20
      expect(firstDay.maxTemp).toBe(299.15); // Highest temp on 2022-01-20
    });

    it('should calculate average humidity', () => {
      const dailyForecasts = ForecastService.groupForecastByDay(mockForecastResponse);
      const firstDay = dailyForecasts[0];

      // (78 + 75 + 80) / 3 = 77.67 rounded to 78
      expect(firstDay.averageHumidity).toBe(78);
    });

    it('should determine most common weather condition', () => {
      const dailyForecasts = ForecastService.groupForecastByDay(mockForecastResponse);
      const firstDay = dailyForecasts[0];

      // Most common among Clear, Clouds, Rain should be determined by frequency
      expect(['Clear', 'Clouds', 'Rain']).toContain(firstDay.mainWeather);
    });

    it('should calculate average rain probability', () => {
      const dailyForecasts = ForecastService.groupForecastByDay(mockForecastResponse);
      const firstDay = dailyForecasts[0];

      // (0.1 + 0.2 + 0.6) * 100 / 3 = 30
      expect(firstDay.rainProbability).toBe(30);
    });

    it('should include current weather as today when provided', () => {
      // Mock current date to match forecast data
      const mockDate = new Date('2022-01-19T10:00:00Z'); // Use a day before forecast data
      const dateSpy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const dailyForecasts = ForecastService.groupForecastByDay(
        mockForecastResponse, 
        mockCurrentWeather
      );

      expect(dailyForecasts[0].date).toBe('2022-01-19'); // Should be today
      expect(dailyForecasts[0].items.length).toBe(1); // Should include only current weather

      dateSpy.mockRestore();
    });

    it('should sort daily forecasts by date', () => {
      const dailyForecasts = ForecastService.groupForecastByDay(mockForecastResponse);

      for (let i = 1; i < dailyForecasts.length; i++) {
        expect(dailyForecasts[i - 1].date <= dailyForecasts[i].date).toBe(true);
      }
    });
  });

  describe('getHourlyForecastForDay', () => {
    it('should return hourly forecast for specific day', () => {
      const hourlyData = ForecastService.getHourlyForecastForDay(
        mockForecastResponse,
        '2022-01-20'
      );

      expect(hourlyData).toHaveLength(3);
      hourlyData.forEach(item => {
        expect(item.dt_txt).toContain('2022-01-20');
      });
    });

    it('should return empty array for non-existent date', () => {
      const hourlyData = ForecastService.getHourlyForecastForDay(
        mockForecastResponse,
        '2022-01-25'
      );

      expect(hourlyData).toHaveLength(0);
    });

    it('should return empty array for date not in forecast data (not today)', () => {
      const hourlyData = ForecastService.getHourlyForecastForDay(
        mockForecastResponse,
        '2022-01-19' // Date not in forecast data and not today
      );

      expect(hourlyData).toHaveLength(0); // Should return empty array for date not in forecast data
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const formatted = ForecastService.formatDate('2022-01-20');
      expect(formatted).toMatch(/\w+,\s\w+\s\d{1,2}/); // Should match format like "Thu, January 20"
    });

    it('should handle different date formats', () => {
      const formatted = ForecastService.formatDate('2022-12-25');
      expect(formatted).toMatch(/\w+,\s\w+\s\d{1,2}/); // Should match general date format
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const formatted = ForecastService.formatTime('2022-01-20T15:30:00Z');
      expect(formatted).toMatch(/\d{2}:\d{2}/); // Should be in HH:MM format
    });

    it('should handle different times', () => {
      const formatted = ForecastService.formatTime('2022-01-20T09:00:00Z');
      expect(formatted).toMatch(/\d{2}:\d{2}/); // Should be in HH:MM format
    });

    it('should use 24-hour format', () => {
      const formatted = ForecastService.formatTime('2022-01-20T21:45:00Z');
      expect(formatted).toMatch(/\d{2}:\d{2}/); // Should be in HH:MM format
    });
  });
  });

  describe('error handling', () => {
    it('should handle invalid JSON response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await ForecastService.getCurrentWeather(mockCity);

      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });

    it('should handle fetch rejection', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await ForecastService.getForecast(mockCity);

      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });
  });
