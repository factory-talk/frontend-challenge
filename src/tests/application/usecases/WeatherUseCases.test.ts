import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { WeatherViewModel } from '@application/dtos/WeatherViewModel';
import { WeatherUseCases } from '@application/useCases/WeatherUseCases';
import { Logger } from '@infrastructure/utils/Logger';

jest.mock('@infrastructure/utils/Logger', () => ({
  Logger: {
    log: jest.fn(),
    logAPIRequest: jest.fn(),
    logAPIResponse: jest.fn(),
    logError: jest.fn(),
  },
}));

const mockWeatherDTO = new WeatherDTO(
  800,
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

describe('WeatherUseCases', () => {
  it('should convert UTC time to Bangkok DateTime', () => {
    const result = WeatherUseCases.convertToBangkokDateTime(1627550400);
    expect(result).toBe('Thursday, July 29, 2021');
  });

  it('should convert UTC time to Bangkok Time', () => {
    const result = WeatherUseCases.convertToBangkokTime(1627550400);
    expect(result).toBe('4:20 PM');
  });

  it('should return a default formatted date string when invalid formatType is provided', () => {
    const result = WeatherUseCases.convertToBangkokDateTime(1627550400);
    expect(result).toBe('Thursday, July 29, 2021');
  });

  it('should get the correct weather icons based on weather ID (Single icon)', () => {
    const result = WeatherUseCases.getWeatherIcon(230, '01d');
    expect(result).toBe('11d');
  });

  it('should get the correct weather icons based on weather ID (List of icon)', () => {
    const result = WeatherUseCases.getWeatherIcon(800, '01d');
    expect(result).toBe('01d');
  });

  it('should map an array of WeatherDTO to WeatherViewModel[]', () => {
    const mockWeatherDTOs: WeatherDTO[] = [mockWeatherDTO, mockWeatherDTO];
    const result = WeatherUseCases.mapWeatherDTOToViewModel(mockWeatherDTOs) as WeatherViewModel[];

    expect(result).toHaveLength(2);
    result.forEach((viewModel) => {
      expect(viewModel.bangkokTime).toBeDefined();
      expect(viewModel.weatherIcon).toBe('01d');
    });
  });

  it('should map WeatherDTO to WeatherViewModel', () => {
    const result = WeatherUseCases.mapWeatherDTOToViewModel(mockWeatherDTO) as WeatherViewModel;
    expect(result).toBeInstanceOf(WeatherViewModel);
    expect(result.bangkokDateTime).toBeDefined();
    expect(result.bangkokTime).toBeDefined();
    expect(result.weatherIcon).toBe('01d');
  });

  it('should log an error and return a default instance when mapping null WeatherDTO', () => {
    const result = WeatherUseCases.mapWeatherDTOToViewModel(null);
    expect(Logger.logError).toHaveBeenCalledWith('Cannot map null or undefined WeatherDTO', null);
    expect(result).toBeInstanceOf(WeatherViewModel);
  });

  it('should parse weatherDTO.id as a string and convert to number', () => {
    const mockWeatherDTOWithStringId: WeatherDTO = new WeatherDTO(
      '800',
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
    const result = WeatherUseCases.mapWeatherDTOToViewModel(mockWeatherDTOWithStringId) as WeatherViewModel;

    expect(result).toBeInstanceOf(WeatherViewModel);
    expect(result.weatherIcon).toBe('01d');
  });

  it('should return an empty array when weatherDTO array is empty', () => {
    const result = WeatherUseCases.mapWeatherDTOToViewModel([]) as WeatherViewModel[];
    expect(result).toHaveLength(0);
  });

  it('should log mapped array of WeatherDTOs correctly', () => {
    const mockWeatherDTOs: WeatherDTO[] = [mockWeatherDTO, mockWeatherDTO];
    WeatherUseCases.mapWeatherDTOToViewModel(mockWeatherDTOs);
    expect(Logger.log).toHaveBeenCalledWith('finalView: ', expect.any(Array));
  });
});
