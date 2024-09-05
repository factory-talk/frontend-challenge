import { IOpenWeatherGeocoding } from '@application/interfaces/IOpenWeatherGeocoding';
import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { Logger } from '@infrastructure/utils/Logger';

export class WeatherController {
  private geocodingService: IOpenWeatherGeocoding;

  constructor(geocodingService: IOpenWeatherGeocoding) {
    this.geocodingService = geocodingService;
  }

  async getWeatherForCity(latitude: number, longitude: number): Promise<WeatherDTO> {
    try {
      return await this.geocodingService.getWeatherData(latitude, longitude);
    } catch (error) {
      Logger.logError('Error in WeatherController:', error);
      throw new Error('Could not retrieve weather data');
    }
  }

  async getTwentyFourHourForecast(latitude: number, longitude: number): Promise<WeatherDTO[]> {
    try {
      return await this.geocodingService.getHourlyForecast(latitude, longitude);
    } catch (error) {
      Logger.logError('Error in WeatherController:', error);
      throw new Error('Could not retrieve forcast data');
    }
  }
}
