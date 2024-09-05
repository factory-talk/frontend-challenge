import { OpenWeatherAPI } from '@infrastructure/api/OpenWeatherAPI';
import { HttpClient } from '@infrastructure/utils/HttpClient';
import { CityDTO } from '@application/dtos/CityDTO';
import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { store } from '@application/states/store';
import { Logger } from '@infrastructure/utils/Logger';

jest.mock('@infrastructure/utils/Logger', () => ({
  Logger: {
    log: jest.fn(),
    logAPIRequest: jest.fn(),
    logAPIResponse: jest.fn(),
    logError: jest.fn(),
  },
}));

jest.mock('@infrastructure/utils/HttpClient');
jest.mock('@application/states/store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));

describe('OpenWeatherAPI', () => {
  let openWeatherAPI: OpenWeatherAPI;
  let geoClientMock: jest.Mocked<HttpClient>;
  let weatherClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    geoClientMock = new HttpClient('') as jest.Mocked<HttpClient>;
    weatherClientMock = new HttpClient('') as jest.Mocked<HttpClient>;
    openWeatherAPI = new OpenWeatherAPI();

    (openWeatherAPI as any).geoClient = geoClientMock;
    (openWeatherAPI as any).weatherClient = weatherClientMock;

    (store.getState as jest.Mock).mockReturnValue({
      temperatureUnit: {
        unit: 'Celsius',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeatherData', () => {
    it('should return a WeatherDTO when the request is successful', async () => {
      const mockResponse = {
        name: 'Bangkok',
        main: { temp: 30, temp_min: 28, temp_max: 32, humidity: 70, pressure: 1012 },
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        wind: { speed: 5 },
        dt: 1627550400,
      };

      weatherClientMock.get.mockResolvedValueOnce(mockResponse);

      const result = await openWeatherAPI.getWeatherData(13.7563, 100.5018);

      const params = {
        lat: 13.7563,
        lon: 100.5018,
        appid: expect.any(String),
        units: 'metric', 
      };

      expect(weatherClientMock.get).toHaveBeenCalledWith('/weather', params);

      expect(Logger.logAPIRequest).toHaveBeenCalledWith('/weather', params);
      expect(Logger.logAPIResponse).toHaveBeenCalledWith('/weather', mockResponse);

      expect(result).toEqual(
        new WeatherDTO(
          'Clear',
          'Bangkok',
          0,
          30,
          28,
          32,
          70,
          5,
          1012,
          'Clear',
          'clear sky',
          '01d',
          1627550400
        )
      );
    });

    it('should throw an error when the request fails', async () => {
      weatherClientMock.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(openWeatherAPI.getWeatherData(13.7563, 100.5018)).rejects.toThrow(
        'Could not retrieve weather data: API Error'
      );

      expect(Logger.logError).toHaveBeenCalledWith('Error fetching weather data', expect.any(Error));
    });

    it('should handle missing or incomplete weather data', async () => {
      const mockResponse = {
        name: 'Bangkok',
        main: { temp: null, temp_min: undefined, temp_max: null, humidity: 70, pressure: 1012 },
        weather: [null],
        wind: { speed: 5 },
        dt: 1627550400
      };
    
      weatherClientMock.get.mockResolvedValueOnce(mockResponse);
    
      const result = await openWeatherAPI.getWeatherData(13.7563, 100.5018);
    
      expect(Logger.logAPIResponse).toHaveBeenCalledWith('/weather', mockResponse);
    
      expect(result).toEqual(
        new WeatherDTO(
          'Unknown Main',
          'Bangkok',
          0,
          0, 
          0, 
          0, 
          70,
          5,
          1012,
          'Unknown Main',
          'No description available',
          '01d',
          1627550400
        )
      );
    });
    
    
    
    

  });

  describe('getHourlyForecast', () => {
    it('should return an array of WeatherDTO when the request is successful', async () => {
      const mockResponse = {
        city: { name: 'Bangkok', timezone: 25200 },
        list: [
          {
            dt: 1627550400,
            main: { temp: 30, temp_min: 28, temp_max: 32, humidity: 70, pressure: 1012 },
            weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
            wind: { speed: 5 },
            rain: { '3h': 0 },
          },
        ],
      };

      weatherClientMock.get.mockResolvedValueOnce(mockResponse);

      const result = await openWeatherAPI.getHourlyForecast(13.7563, 100.5018);

      const params = {
        lat: 13.7563,
        lon: 100.5018,
        appid: expect.any(String),
        cnt: 8,
        units: 'metric',
      };

      expect(weatherClientMock.get).toHaveBeenCalledWith('/forecast', params);

      expect(Logger.logAPIRequest).toHaveBeenCalledWith('/forecast', params);
      expect(Logger.logAPIResponse).toHaveBeenCalledWith('/forecast', mockResponse);

      expect(result).toEqual([
        new WeatherDTO(
          'Clear',
          'Bangkok',
          0,
          30,
          28,
          32,
          70,
          5,
          1012,
          'Clear',
          'clear sky',
          '01d',
          1627550400
        ),
      ]);
    });

    it('should throw an error if no forecast data is received', async () => {
      const mockResponse = {
        city: { name: 'Bangkok', timezone: 25200 },
        list: [],
      };

      weatherClientMock.get.mockResolvedValueOnce(mockResponse);

      await expect(openWeatherAPI.getHourlyForecast(13.7563, 100.5018)).rejects.toThrow(
        'No forecast data received from API'
      );

      expect(Logger.logError).toHaveBeenCalledWith('Error fetching hourly forecast data', expect.any(Error));
    });

    it('should throw an error when the request fails', async () => {
      weatherClientMock.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(openWeatherAPI.getHourlyForecast(13.7563, 100.5018)).rejects.toThrow(
        'No forecast data received from API'
      );

      expect(Logger.logError).toHaveBeenCalledWith('Error fetching hourly forecast data', expect.any(Error));
    });
  });
});
