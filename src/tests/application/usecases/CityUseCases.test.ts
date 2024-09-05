import { CityUseCases } from '@application/useCases/CityUseCases';
import { OpenWeatherGeocodingService } from '@application/services/OpenWeatherGeocodingService';
import { OpenWeatherAPI } from '@infrastructure/api/OpenWeatherAPI';
import { CityDTO } from '@application/dtos/CityDTO';
import { CityViewModel } from '@application/dtos/CityViewModel';

const mockHttpClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

const mockOpenWeatherAPI = {
    geoClient: mockHttpClient,
    weatherClient: mockHttpClient,
    searchCity: jest.fn(),
    searchByZip: jest.fn(),
    getWeatherData: jest.fn(),
    getHourlyForecast: jest.fn(),
  } as unknown as jest.Mocked<OpenWeatherAPI>;
  
  jest.mock('@infrastructure/api/OpenWeatherAPI', () => {
    return {
      OpenWeatherAPI: jest.fn(() => mockOpenWeatherAPI),
    };
  });
  


jest.mock('@application/services/OpenWeatherGeocodingService', () => {
  return {
    OpenWeatherGeocodingService: jest.fn().mockImplementation(() => ({
      searchCity: jest.fn(),
      searchByZip: jest.fn(),
    })),
  };
});

describe('CityUseCases', () => {
  let cityUseCases: CityUseCases;
  let mockGeocodingService: jest.Mocked<OpenWeatherGeocodingService>;

  beforeEach(() => {
    mockGeocodingService = new OpenWeatherGeocodingService(mockOpenWeatherAPI) as jest.Mocked<OpenWeatherGeocodingService>;
    cityUseCases = new CityUseCases(mockGeocodingService);
  });

  it('should return a list of CityViewModel when searchCityOrZip is called', async () => {
    const mockCities: CityDTO[] = [
      { name: 'Bangkok', country: 'Thailand', displayName: 'Bangkok, Thailand', latitude: 13.7563, longitude: 100.5018 },
      { name: 'Chiang Mai', country: 'Thailand', displayName: 'Chiang Mai, Thailand', latitude: 18.7883, longitude: 98.9853 },
    ];

    mockGeocodingService.searchCity.mockResolvedValue(mockCities);

    const result = await cityUseCases.searchCityOrZip('Bangkok');

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(CityViewModel);
    expect(result[0].getName()).toBe('Bangkok');
    expect(result[1].getName()).toBe('Chiang Mai');
  });

  it('should return an empty list if no cities are found', async () => {
    mockGeocodingService.searchCity.mockResolvedValue([]);

    const result = await cityUseCases.searchCityOrZip('UnknownCity');

    expect(result).toHaveLength(0);
  });
});
