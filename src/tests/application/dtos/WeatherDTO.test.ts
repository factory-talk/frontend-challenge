import { Logger } from '@infrastructure/utils/Logger';
import { WeatherDTO } from '@application/dtos/WeatherDTO';

jest.mock('@infrastructure/utils/Logger', () => ({
  Logger: {
    logError: jest.fn(),
  }
}));

describe('WeatherDTO', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should create an instance with provided values', () => {
    const weather = new WeatherDTO(
      1,
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
    );
    expect(weather.id).toBe(1);
    expect(weather.cityName).toBe('Bangkok');
    expect(weather.rainVolumn).toBe(0);
    expect(weather.avgTemp).toBe(30);
    expect(weather.minTemp).toBe(28);
    expect(weather.maxTemp).toBe(32);
    expect(weather.humidity).toBe(70);
    expect(weather.windSpeed).toBe(5);
    expect(weather.pressure).toBe(1012);
    expect(weather.mainWeather).toBe('Clear');
    expect(weather.descWeather).toBe('clear sky');
    expect(weather.icon).toBe('01d');
    expect(weather.dateTime).toBe(1627550400);
  });

  it('should serialize the WeatherDTO instance to an object', () => {
    const weather = new WeatherDTO(
      1,
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
    );
    const serialized = weather.serializeWeatherDTO();
    expect(serialized).toEqual({
      id: 1,
      cityName: 'Bangkok',
      rainVolumn: 0,
      avgTemp: 30,
      minTemp: 28,
      maxTemp: 32,
      humidity: 70,
      windSpeed: 5,
      pressure: 1012,
      mainWeather: 'Clear',
      descWeather: 'clear sky',
      icon: '01d',
      dateTime: 1627550400
    });
  });

  it('should deserialize valid data into a WeatherDTO instance', () => {
    const data = {
      id: 1,
      cityName: 'Bangkok',
      rainVolumn: 0,
      avgTemp: 30,
      minTemp: 28,
      maxTemp: 32,
      humidity: 70,
      windSpeed: 5,
      pressure: 1012,
      mainWeather: 'Clear',
      descWeather: 'clear sky',
      icon: '01d',
      dateTime: 1627550400,
    };
    const weather = WeatherDTO.deserializeWeatherDTO(data);
    expect(weather.id).toBe(1);
    expect(weather.cityName).toBe('Bangkok');
    expect(weather.rainVolumn).toBe(0);
    expect(weather.avgTemp).toBe(30);
    expect(weather.minTemp).toBe(28);
    expect(weather.maxTemp).toBe(32);
    expect(weather.humidity).toBe(70);
    expect(weather.windSpeed).toBe(5);
    expect(weather.pressure).toBe(1012);
    expect(weather.mainWeather).toBe('Clear');
    expect(weather.descWeather).toBe('clear sky');
    expect(weather.icon).toBe('01d');
    expect(weather.dateTime).toBe(1627550400);
  });

  it('should log an error and return a default instance when deserializing invalid data', () => {
    const invalidData = null;
    const weather = WeatherDTO.deserializeWeatherDTO(invalidData);
    expect(Logger.logError).toHaveBeenCalledWith(
      'Cannot deserialize null, undefined, or non-object data into WeatherDTO',
      invalidData
    );
    expect(weather.id).toBe(0);
    expect(weather.cityName).toBe('Unknown Location');
    expect(weather.mainWeather).toBe('Unknown Main Weather');
    expect(weather.descWeather).toBe('Unknown Desc Weather');
  });

 
});
