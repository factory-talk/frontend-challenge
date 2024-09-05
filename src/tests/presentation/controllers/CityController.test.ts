import { CityController } from '@presentation/controllers/CityController';
import { IOpenWeatherGeocoding } from '@application/interfaces/IOpenWeatherGeocoding';
import { CityDTO } from '@application/dtos/CityDTO';

describe('CityController', () => {
  let cityController: CityController;
  let geocodingServiceMock: jest.Mocked<IOpenWeatherGeocoding>;

  beforeEach(() => {
    geocodingServiceMock = {
      searchByZip: jest.fn(),
      searchCity: jest.fn(),
      getWeatherData: jest.fn(),
      getHourlyForecast: jest.fn(),
    };

    cityController = new CityController(geocodingServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isValidZipcode', () => {
    it('should validate a correct zipcode and country code', () => {
      const query = '12345,US';
      const result = (cityController as any).isValidZipcode(query);
      expect(result).toBe(true);
    });

    it('should invalidate an incorrect zipcode', () => {
      const query = 'abcde,US';
      const result = (cityController as any).isValidZipcode(query);
      expect(result).toBe(false);
    });

    it('should invalidate a correct zipcode with an invalid country code', () => {
      const query = '12345,ZZ';
      const result = (cityController as any).isValidZipcode(query);
      expect(result).toBe(false);
    });
  });

  describe('searchCityOrZip', () => {
    it('should return a city using a valid zipcode', async () => {
      const mockCity = new CityDTO('Bangkok', 'TH', 'Bangkok, Thailand', 13.7563, 100.5018);
      geocodingServiceMock.searchByZip.mockResolvedValue(mockCity);

      const result = await cityController.searchCityOrZip('12345,US');
      expect(geocodingServiceMock.searchByZip).toHaveBeenCalledWith('12345,US');
      expect(result).toEqual([mockCity]);
    });

    it('should search for a city using a city name when input is not a valid zipcode', async () => {
      const mockCities = [new CityDTO('Bangkok', 'TH', 'Bangkok, Thailand', 13.7563, 100.5018)];
      geocodingServiceMock.searchCity.mockResolvedValue(mockCities);

      const result = await cityController.searchCityOrZip('Bangkok');
      expect(geocodingServiceMock.searchCity).toHaveBeenCalledWith('Bangkok');
      expect(result).toEqual(mockCities);
    });

    it('should throw an error when searchCityOrZip encounters an error', async () => {
      geocodingServiceMock.searchCity.mockRejectedValue(new Error('API Error'));

      await expect(cityController.searchCityOrZip('Bangkok')).rejects.toThrow('Could not retrieve city data');
    });
  });
});
