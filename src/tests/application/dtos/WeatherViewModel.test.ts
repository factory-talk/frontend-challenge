import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { WeatherViewModel } from '@application/dtos/WeatherViewModel';
import { Logger } from '@infrastructure/utils/Logger';

jest.mock('@infrastructure/utils/Logger', () => ({
    Logger: {
      log: jest.fn(),
      logError: jest.fn(),
    }
  }));
  
  jest.mock('@application/dtos/WeatherDTO', () => ({
    WeatherDTO: {
      deserializeWeatherDTO: jest.fn(),
    }
  }));

describe('WeatherViewModel', () => {
    const mockWeatherDTO = {
        id: 800,
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
        timezone: 25200,
        serializeWeatherDTO: jest.fn().mockReturnValue({
          id: 800,
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
        }),
      };

    beforeEach(() => {
        jest.clearAllMocks();
        (WeatherDTO.deserializeWeatherDTO as jest.Mock).mockReturnValue(mockWeatherDTO);
    });

  it('should create an instance of WeatherViewModel', () => {
    const weatherViewModel = new WeatherViewModel(mockWeatherDTO, 'Monday, July 26, 2021, 9:00 PM', '9:00 PM', '01d');
    expect(weatherViewModel.getWeatherDTO()).toBe(mockWeatherDTO);
    expect(weatherViewModel.bangkokDateTime).toBe('Monday, July 26, 2021, 9:00 PM');
    expect(weatherViewModel.bangkokTime).toBe('9:00 PM');
    expect(weatherViewModel.weatherIcon).toBe('01d');
  });

  it('should serialize the WeatherViewModel to an object', () => {
    const weatherViewModel = new WeatherViewModel(mockWeatherDTO, 'Monday, July 26, 2021, 9:00 PM', '9:00 PM', '01d');
    const serialized = weatherViewModel.serialize();
    expect(mockWeatherDTO.serializeWeatherDTO).toHaveBeenCalled();
    expect(serialized).toEqual({
      weatherDTO: mockWeatherDTO.serializeWeatherDTO(),
      bangkokDateTime: 'Monday, July 26, 2021, 9:00 PM',
      bangkokTime: '9:00 PM',
      weatherIcon: '01d',
    });
  });
  
  it('should deserialize valid data into a WeatherViewModel', () => {
    const data = {
      weatherDTO: mockWeatherDTO,
      bangkokDateTime: 'Monday, July 26, 2021, 9:00 PM',
      bangkokTime: '9:00 PM',
      weatherIcon: '01d',
    };
    const weatherViewModel = WeatherViewModel.deserialize(data);
    expect(Logger.log).toHaveBeenCalled();
    expect(WeatherDTO.deserializeWeatherDTO).toHaveBeenCalledWith(mockWeatherDTO);
    expect(weatherViewModel.getWeatherDTO()).toBe(mockWeatherDTO);
    expect(weatherViewModel.bangkokDateTime).toBe('Monday, July 26, 2021, 9:00 PM');
    expect(weatherViewModel.bangkokTime).toBe('4:20 PM');
    expect(weatherViewModel.weatherIcon).toBe('01d');
  });
  
  it('should log an error and return a default instance when deserializing invalid data', () => {
    const invalidData = null;
    const weatherViewModel = WeatherViewModel.deserialize(invalidData);
    expect(Logger.logError).toHaveBeenCalledWith('Failed to deserialize WeatherViewModel: data is null or not an object', invalidData);
    expect(WeatherDTO.deserializeWeatherDTO).toHaveBeenCalledWith(null);
    expect(weatherViewModel.getWeatherDTO()).toBe(mockWeatherDTO);
    expect(weatherViewModel.weatherIcon).toBe('01d');
  });
});
