import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { WeatherViewModel } from '@application/dtos/WeatherViewModel';
import { WeatherConditions } from '@infrastructure/utils/definitions/WeatherConditions';
import { Logger } from '@infrastructure/utils/Logger';

export class WeatherUseCases {

  static convertToBangkokDateTime(utcTime: number): string {
    return new Date(utcTime * 1000).toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static convertToBangkokTime(utcTime: number): string {
    const convertedTime = new Date(utcTime * 1000).toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    
    Logger.log(`Converted UTC time ${utcTime} to Bangkok time: ${convertedTime}`);
    return convertedTime;
  }
  
  static getWeatherIcon(weatherId: number, weatherIcon: string): string {
    
    const condition = WeatherConditions[weatherId] || {};
  
    if (Array.isArray(condition.icon)) {
      return condition.icon[0]; 
    }
    
    return condition.icon ? condition.icon : weatherIcon;
  }

  static mapWeatherDTOToViewModel(weather: WeatherDTO | WeatherDTO[] | null): WeatherViewModel | WeatherViewModel[] {
    Logger.log(`Mapping WeatherDTO to ViewModel: ${JSON.stringify(weather)}`);
  
    if (!weather) {
      Logger.logError('Cannot map null or undefined WeatherDTO', null);
      return WeatherViewModel.deserialize(null);
    }
  
    const mapSingleDTO = (weatherDTO: WeatherDTO): WeatherViewModel => {
      const weatherId = typeof weatherDTO.id === 'number' ? weatherDTO.id : parseInt(weatherDTO.id as string, 10) || 0;
      const bangkokDateTime = WeatherUseCases.convertToBangkokDateTime(weatherDTO.dateTime || Date.now());
      const bangkokTime = WeatherUseCases.convertToBangkokTime(weatherDTO.dateTime || Date.now());
      const weatherIcon = WeatherUseCases.getWeatherIcon(weatherId, weatherDTO.icon || '01d');
      
      return new WeatherViewModel(weatherDTO, bangkokDateTime, bangkokTime, weatherIcon);
    };
  
    if (Array.isArray(weather)) {
      const finalView = weather.map(mapSingleDTO);
      Logger.log('finalView: ', finalView);
      return finalView;
    } else {
      return mapSingleDTO(weather);
    }
  }
  

}
