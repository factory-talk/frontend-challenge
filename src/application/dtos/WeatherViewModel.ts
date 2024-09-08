import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { Logger } from '@infrastructure/utils/Logger';
import { WeatherUseCases } from '@application/useCases/WeatherUseCases';


export class WeatherViewModel {
  private weatherDTO: WeatherDTO;
  bangkokDateTime: string;
  bangkokTime: string;
  weatherIcon: string;

  constructor(weatherDTO: WeatherDTO, bangkokDateTime: string, bangkokTime: string, weatherIcon: string) {
    this.weatherDTO = weatherDTO;
    this.bangkokDateTime = bangkokDateTime;
    this.bangkokTime = bangkokTime;
    this.weatherIcon = weatherIcon;
  }

  public getWeatherDTO() {
    return this.weatherDTO;
  }

  public serialize() {
    return {
      weatherDTO: this.weatherDTO.serializeWeatherDTO(),
      bangkokDateTime: this.bangkokDateTime,
      bangkokTime: this.bangkokTime,
      weatherIcon: this.weatherIcon,
    };
  }

  public static deserialize(data: any): WeatherViewModel {
    if (!data || typeof data !== 'object') {
      Logger.logError('Failed to deserialize WeatherViewModel: data is null or not an object', data);
      const defaultDTO = WeatherDTO.deserializeWeatherDTO(null);
      return new WeatherViewModel(defaultDTO, '', '', '01d');
    }

    Logger.log(`WeatherViewModel data before deserialized: ${JSON.stringify(data)}`);
    
    const weatherDTO = WeatherDTO.deserializeWeatherDTO(data.weatherDTO);
    const bangkokDateTime = data.bangkokDateTime ?? '';
    const bangkokTime = WeatherUseCases.convertToBangkokTime(weatherDTO.dateTime || 0, weatherDTO.timeZone || 0);
    const weatherIcon = data.weatherIcon ?? '01d';

    Logger.log(`WeatherDTO after deserialized: ${JSON.stringify(weatherDTO)}`);

    return new WeatherViewModel(
      weatherDTO,
      bangkokDateTime,
      bangkokTime,
      weatherIcon
    );
  }
}
