import { WeatherController } from '@presentation/controllers/WeatherController';
import { IOpenWeatherGeocoding } from '@application/interfaces/IOpenWeatherGeocoding';
import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { Logger } from '@infrastructure/utils/Logger';

jest.mock('@infrastructure/utils/Logger', () => ({
  Logger: {
    logError: jest.fn(),
  },
}));

describe('WeatherController', () => {
  let weatherController: WeatherController;
  let geocodingServiceMock: jest.Mocked<IOpenWeatherGeocoding>;

  beforeEach(() => {
    geocodingServiceMock = {
      searchByZip: jest.fn(),
      searchCity: jest.fn(),
      getWeatherData: jest.fn(),
      getHourlyForecast: jest.fn(),
    };

    weatherController = new WeatherController(geocodingServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeatherForCity', () => {
    it('should return weather data for a valid latitude and longitude', async () => {
      const mockWeather = new WeatherDTO('Clear', 'Bangkok', 0, 30, 28, 32, 70, 5, 1012, 'Clear', 'clear sky', '01d', Date.now());
      geocodingServiceMock.getWeatherData.mockResolvedValue(mockWeather);

      const result = await weatherController.getWeatherForCity(13.7563, 100.5018);
      expect(geocodingServiceMock.getWeatherData).toHaveBeenCalledWith(13.7563, 100.5018);
      expect(result).toEqual(mockWeather);
    });

    it('should throw an error when getWeatherForCity encounters an error', async () => {
      geocodingServiceMock.getWeatherData.mockRejectedValue(new Error('API Error'));

      await expect(weatherController.getWeatherForCity(13.7563, 100.5018)).rejects.toThrow('Could not retrieve weather data');
      expect(Logger.logError).toHaveBeenCalledWith('Error in WeatherController:', new Error('API Error'));
    });
  });

  describe('getTwentyFourHourForecast', () => {
    it('should return a 24-hour forecast for a valid latitude and longitude', async () => {
      const mockForecast = [
        new WeatherDTO('Clear', 'Bangkok', 0, 30, 28, 32, 70, 5, 1012, 'Clear', 'clear sky', '01d', Date.now()),
      ];
      geocodingServiceMock.getHourlyForecast.mockResolvedValue(mockForecast);

      const result = await weatherController.getTwentyFourHourForecast(13.7563, 100.5018);
      expect(geocodingServiceMock.getHourlyForecast).toHaveBeenCalledWith(13.7563, 100.5018);
      expect(result).toEqual(mockForecast);
    });

    it('should throw an error when getTwentyFourHourForecast encounters an error', async () => {
      geocodingServiceMock.getHourlyForecast.mockRejectedValue(new Error('API Error'));

      await expect(weatherController.getTwentyFourHourForecast(13.7563, 100.5018)).rejects.toThrow('Could not retrieve forcast data');
      expect(Logger.logError).toHaveBeenCalledWith('Error in WeatherController:', new Error('API Error'));
    });
  });
});
