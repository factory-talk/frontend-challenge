import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { WeatherViewModel } from '@application/dtos/WeatherViewModel';
import { WeatherConditions } from '@infrastructure/utils/definitions/WeatherConditions';
import { Logger } from '@infrastructure/utils/Logger';
import moment from 'moment-timezone';

export class WeatherUseCases {


  static convertToBangkokDateTime(unixTime: number, timeZone: number) {
    Logger.log("unixTime: ",unixTime)
    const timezoneOffsetInMinutes = timeZone / 60;
    const formattedTime = moment.unix(unixTime).utcOffset(timezoneOffsetInMinutes).format('dddd, MMMM DD');
    return formattedTime;
  }


  static convertToBangkokTime(unixTime: number, timeZone: number) {
    Logger.log("timezone: ",timeZone)
    const timezoneOffsetInMinutes = timeZone / 60;

    const time = moment.unix(unixTime).utcOffset(timezoneOffsetInMinutes).startOf('hour');
    return time.format('hh:mm A');
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
      const bangkokDateTime = WeatherUseCases.convertToBangkokDateTime(weatherDTO.dateTime || 0, weatherDTO.timeZone || 0);
      const bangkokTime = WeatherUseCases.convertToBangkokTime(weatherDTO.dateTime || 0, weatherDTO.timeZone || 0);
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
