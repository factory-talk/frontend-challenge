import { CityController } from '@presentation/controllers/CityController';
import { IOpenWeatherGeocoding } from '@application/interfaces/IOpenWeatherGeocoding';

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
      const query = '11110,TH';
      const result = (cityController as any).isValidZipcode(query);  
      expect(result).toBe(true);
    });
  });
});
