import { OpenWeatherAPI } from '@infrastructure/api/OpenWeatherAPI';
import { HttpClient, APIError } from '@infrastructure/utils/HttpClient';
import { Logger } from '@infrastructure/utils/Logger';
import { store } from '@application/states/store';
import { CityDTO } from '@application/dtos/CityDTO';
import { WeatherDTO } from '@application/dtos/WeatherDTO';

jest.mock('@infrastructure/utils/HttpClient');
jest.mock('@infrastructure/utils/Logger', () => ({
  Logger: {
    log: jest.fn(),
    logAPIRequest: jest.fn(),
    logAPIResponse: jest.fn(),
    logError: jest.fn(),
  },
}));
jest.mock('@application/states/store', () => ({
  store: {
    getState: jest.fn(),
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
      temperatureUnit: { unit: 'Celsius' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchCity', () => {
    it('should return an array of CityDTO when the request is successful', async () => {
      const mockResponse = [
        { name: 'Bangkok', country: 'TH', lat: 13.7563, lon: 100.5018 },
      ];
      geoClientMock.get.mockResolvedValueOnce(mockResponse);

      const result = await openWeatherAPI.searchCity('Bangkok');

      expect(geoClientMock.get).toHaveBeenCalledWith('/direct', expect.any(Object));
      expect(result).toEqual([
        new CityDTO('Bangkok', 'TH', 'Bangkok, TH', 13.7563, 100.5018),
      ]);
    });

    it('should return an empty array if the searchCity request fails with an API error', async () => {
      geoClientMock.get.mockRejectedValueOnce(new APIError(500, 'API error'));

      const result = await openWeatherAPI.searchCity('InvalidCity');

      expect(Logger.logError).toHaveBeenCalledWith('API error in searchCity: API error', expect.any(APIError));
      expect(result).toEqual([]);
    });

    it('should log a non-API error and return an empty array', async () => {
      const mockError = new Error('Some non-API error');
      geoClientMock.get.mockRejectedValueOnce(mockError);

      const result = await openWeatherAPI.searchCity('InvalidCity');

      expect(Logger.logError).toHaveBeenCalledWith('Error searching city: Some non-API error', mockError);
      expect(result).toEqual([]);
    });
  });

  describe('searchByZip', () => {
    it('should return an array of CityDTO when the request is successful', async () => {
      const mockResponse = {
        zip: '11110',
        name: 'Bang Bua Thong',
        lat: 13.9167,
        lon: 100.4333,
        country: 'TH',
      };
      geoClientMock.get.mockResolvedValueOnce(mockResponse);

      const result = await openWeatherAPI.searchByZip('11110');
      expect(geoClientMock.get).toHaveBeenCalledWith('/zip', expect.any(Object));
      expect(result).toEqual([
        new CityDTO('Bang Bua Thong', 'TH', 'Bang Bua Thong, TH', 13.9167, 100.4333),
      ]);
    });

    it('should return an empty array if the searchByZip request fails with an API error', async () => {
      geoClientMock.get.mockRejectedValueOnce(new APIError(500, 'API error'));

      const result = await openWeatherAPI.searchByZip('invalidZip');

      expect(Logger.logError).toHaveBeenCalledWith('API error in searchByZip: API error', expect.any(APIError));
      expect(result).toEqual([]);
    });

    it('should log a non-API error and return an empty array', async () => {
      const mockError = new Error('Some non-API error');
      geoClientMock.get.mockRejectedValueOnce(mockError);

      const result = await openWeatherAPI.searchByZip('invalidZip');

      expect(Logger.logError).toHaveBeenCalledWith('Error searching by zip: Some non-API error', mockError);
      expect(result).toEqual([]);
    });
  });

  describe('getWeatherData', () => {
    it('should handle missing or incomplete weather data', async () => {
      const mockResponse = {
        name: 'Chiang Mai',
        main: { temp: null, temp_min: undefined, temp_max: null, humidity: 70, pressure: 1012 },
        weather: [null],
        wind: { speed: 5 },
        dt: 1725645600,
        timezone: 25200,
      };

      weatherClientMock.get.mockResolvedValueOnce(mockResponse);

      const result = await openWeatherAPI.getWeatherData(18.7882778, 98.9858802);
      expect(Logger.logAPIResponse).toHaveBeenCalledWith('/weather', mockResponse);
      expect(result).toEqual(
        new WeatherDTO(
          'Unknown Main',
          'Chiang Mai',
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
          1725645600,
          25200
        )
      );
    });

    it('should log an error if an exception occurs during the weather data request', async () => {
      const mockError = new Error('Weather data error');
      weatherClientMock.get.mockRejectedValueOnce(mockError);

      await expect(openWeatherAPI.getWeatherData(18.7882778, 98.9858802)).rejects.toThrow(mockError);

      expect(Logger.logError).toHaveBeenCalledWith('Error fetching weather data: Weather data error', mockError);
    });
  });

  describe('getHourlyForecast', () => {
    it('should throw an error if no forecast data is received', async () => {
      const mockResponse = { city: { name: 'Chiang Mai', timezone: 25200 }, list: [] };
      weatherClientMock.get.mockResolvedValueOnce(mockResponse);

      await expect(openWeatherAPI.getHourlyForecast(18.7882778, 98.9858802)).rejects.toThrow('No forecast data received from API');
      expect(Logger.logError).toHaveBeenCalledWith('Error fetching hourly forecast data', expect.any(Error));
    });

    it('should log an error if an exception occurs during the forecast data request', async () => {
      const mockError = new Error('Forecast data error');
      weatherClientMock.get.mockRejectedValueOnce(mockError);

      await expect(openWeatherAPI.getHourlyForecast(18.7882778, 98.9858802)).rejects.toThrow('No forecast data received from API');

      expect(Logger.logError).toHaveBeenCalledWith('Error fetching hourly forecast data', mockError);
    });

    it('should map forecast data to WeatherDTO objects', async () => {
      const mockResponse = {
        city: { name: 'Chiang Mai', timezone: 25200 },
        list: [
          {
            weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
            main: { temp: 28.3, temp_min: 25, temp_max: 30, humidity: 60, pressure: 1010 },
            wind: { speed: 5 },
            dt: 1725645600,
            rain: { '3h': 0.1 },
          },
          {
            weather: [{ main: 'Rain', description: 'light rain', icon: '09d' }],
            main: { temp: 26.3, temp_min: 24, temp_max: 28, humidity: 80, pressure: 1005 },
            wind: { speed: 3 },
            dt: 1725655600,
            rain: { '3h': 2.5 },
          }
        ]
      };
      weatherClientMock.get.mockResolvedValueOnce(mockResponse);

      const result = await openWeatherAPI.getHourlyForecast(18.7882778, 98.9858802);

      expect(result).toEqual([
        new WeatherDTO(
          'Clear',
          'Chiang Mai',
          0.1,
          28.3,
          25,
          30,
          60,
          5,
          1010,
          'Clear',
          'clear sky',
          '01d',
          1725645600,
          25200
        ),
        new WeatherDTO(
          'Rain',
          'Chiang Mai',
          2.5,
          26.3,
          24,
          28,
          80,
          3,
          1005,
          'Rain',
          'light rain',
          '09d',
          1725655600,
          25200
        ),
      ]);
    });
  });
});
