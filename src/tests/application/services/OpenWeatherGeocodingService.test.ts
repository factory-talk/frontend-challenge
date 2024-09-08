import { OpenWeatherGeocodingService } from '@application/services/OpenWeatherGeocodingService';
import { OpenWeatherAPI } from '@infrastructure/api/OpenWeatherAPI';
import { Logger } from '@infrastructure/utils/Logger';
import { WeatherUseCases } from '@application/useCases/WeatherUseCases';
import { CityDTO } from '@application/dtos/CityDTO';
import { WeatherDTO } from '@application/dtos/WeatherDTO';

jest.mock('@infrastructure/api/OpenWeatherAPI');
jest.mock('@application/useCases/WeatherUseCases');

jest.mock('@infrastructure/utils/Logger', () => ({
  Logger: {
    log: jest.fn(),
    logAPIRequest: jest.fn(),
    logAPIResponse: jest.fn(),
    logError: jest.fn(),
  },
}));

describe('OpenWeatherGeocodingService', () => {
  let service: OpenWeatherGeocodingService;
  let openWeatherAPIMock: jest.Mocked<OpenWeatherAPI>;

  beforeEach(() => {
    openWeatherAPIMock = new OpenWeatherAPI() as jest.Mocked<OpenWeatherAPI>;
    service = new OpenWeatherGeocodingService(openWeatherAPIMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchCity', () => {
    it('should return a list of CityDTOs when search is successful', async () => {
      const mockResponse = [
        new CityDTO('Bangkok', 'TH', 'Bangkok, TH', 13.7563, 100.5018),
      ];
      openWeatherAPIMock.searchCity.mockResolvedValueOnce(mockResponse);

      const result = await service.searchCity('Bangkok');

      expect(openWeatherAPIMock.searchCity).toHaveBeenCalledWith('Bangkok');
      expect(result).toEqual(mockResponse);
    });

    it('should log and throw an error when search fails', async () => {
      const mockError = new Error('API Error');
      openWeatherAPIMock.searchCity.mockRejectedValueOnce(mockError);

      await expect(service.searchCity('Bangkok')).rejects.toThrow('API Error');
      expect(Logger.logError).toHaveBeenCalledWith('Error in searchCity:', mockError);
    });
  });

  describe('searchByZip', () => {
    it('should return a CityDTO when search by zip is successful', async () => {
      const mockResponse = new CityDTO('Bangkok', 'TH', 'Bangkok, TH', 13.7563, 100.5018);
      openWeatherAPIMock.searchByZip.mockResolvedValueOnce(mockResponse);

      const result = await service.searchByZip('10110');

      expect(openWeatherAPIMock.searchByZip).toHaveBeenCalledWith('10110');
      expect(result).toEqual(mockResponse);
      expect(Logger.log).toHaveBeenCalledWith('Received result for zip: 10110');
    });

    it('should log and throw an error when search by zip fails', async () => {
      const mockError = new Error('API Error');
      openWeatherAPIMock.searchByZip.mockRejectedValueOnce(mockError);

      await expect(service.searchByZip('10110')).rejects.toThrow('API Error');
      expect(Logger.logError).toHaveBeenCalledWith('Error in searchByZip:', mockError);
    });
  });

  describe('getWeatherData', () => {
    it('should return mapped weather data when request is successful', async () => {
      const mockWeatherData = new WeatherDTO(
        'Clear', 'Bangkok', 0, 30, 28, 32, 70, 5, 1012, 'Clear', 'clear sky', '01d', 1627550400
      );
      const mockMappedData = { temp: 30, description: 'clear sky' };

      openWeatherAPIMock.getWeatherData.mockResolvedValueOnce(mockWeatherData);
      (WeatherUseCases.mapWeatherDTOToViewModel as jest.Mock).mockReturnValue(mockMappedData);

      const result = await service.getWeatherData(13.7563, 100.5018);

      expect(openWeatherAPIMock.getWeatherData).toHaveBeenCalledWith(13.7563, 100.5018);
      expect(WeatherUseCases.mapWeatherDTOToViewModel).toHaveBeenCalledWith(mockWeatherData);
      expect(result).toEqual(mockMappedData);
      expect(Logger.log).toHaveBeenCalledWith('Received weather data for coordinates: 13.7563, 100.5018 \n');
    });

    it('should log and throw an error when request fails', async () => {
      const mockError = new Error('API Error');
      openWeatherAPIMock.getWeatherData.mockRejectedValueOnce(mockError);

      await expect(service.getWeatherData(13.7563, 100.5018)).rejects.toThrow('API Error');
      expect(Logger.logError).toHaveBeenCalledWith('Error in getWeatherData:', mockError);
    });

    it('should throw an error when null or undefined weather data is returned', async () => {
      openWeatherAPIMock.getWeatherData.mockResolvedValueOnce(null as any);

      await expect(service.getWeatherData(13.7563, 100.5018)).rejects.toThrow('Received null or undefined weather data from API');
      expect(Logger.logError).toHaveBeenCalledWith('Error in getWeatherData:', expect.any(Error));
    });
  });

  describe('getHourlyForecast', () => {
    it('should return a list of WeatherDTOs when request is successful', async () => {
      const mockResponse = [
        new WeatherDTO(
          'Clear', 'Bangkok', 0, 30, 28, 32, 70, 5, 1012, 'Clear', 'clear sky', '01d', 1627550400
        ),
      ];
      openWeatherAPIMock.getHourlyForecast.mockResolvedValueOnce(mockResponse);

      const result = await service.getHourlyForecast(13.7563, 100.5018);

      expect(openWeatherAPIMock.getHourlyForecast).toHaveBeenCalledWith(13.7563, 100.5018);
      expect(result).toEqual(mockResponse);
    });

    it('should log and throw an error when request fails', async () => {
      const mockError = new Error('API Error');
      openWeatherAPIMock.getHourlyForecast.mockRejectedValueOnce(mockError);

      await expect(service.getHourlyForecast(13.7563, 100.5018)).rejects.toThrow('API Error');
      expect(Logger.logError).toHaveBeenCalledWith('Error in getHourlyForecast:', mockError);
    });
  });
});
