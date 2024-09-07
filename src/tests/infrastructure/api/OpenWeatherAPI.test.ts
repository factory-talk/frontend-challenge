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

    it('should return an empty array if the searchCity request fails', async () => {
      geoClientMock.get.mockRejectedValueOnce(new APIError(500, 'API error'));

      const result = await openWeatherAPI.searchCity('InvalidCity');

      expect(Logger.logError).toHaveBeenCalledWith('API error in searchCity: API error', expect.any(APIError));
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

    it('should return an empty array if the searchByZip request fails', async () => {
      geoClientMock.get.mockRejectedValueOnce(new APIError(500, 'API error'));

      const result = await openWeatherAPI.searchByZip('invalidZip');

      expect(Logger.logError).toHaveBeenCalledWith('API error in searchByZip: API error', expect.any(APIError));
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
    
  });

  describe('getHourlyForecast', () => {
    it('should throw an error if no forecast data is received', async () => {
      const mockResponse = { city: { name: 'Chiang Mai', timezone: 25200 }, list: [] };
      weatherClientMock.get.mockResolvedValueOnce(mockResponse);

      await expect(openWeatherAPI.getHourlyForecast(18.7882778, 98.9858802)).rejects.toThrow('No forecast data received from API');
      expect(Logger.logError).toHaveBeenCalledWith('Error fetching hourly forecast data', expect.any(Error));
    });
  });
});
