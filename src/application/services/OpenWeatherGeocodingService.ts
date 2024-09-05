import { IOpenWeatherGeocoding } from '@application/interfaces/IOpenWeatherGeocoding';
import { CityDTO } from '@application/dtos/CityDTO';
import { OpenWeatherAPI } from '@infrastructure/api/OpenWeatherAPI';
import { Logger } from '@infrastructure/utils/Logger';
import { WeatherUseCases } from '@application/useCases/WeatherUseCases';

export class OpenWeatherGeocodingService implements IOpenWeatherGeocoding {
  private geocodingAPI: OpenWeatherAPI;

  constructor(geocodingAPI: OpenWeatherAPI) {
    this.geocodingAPI = geocodingAPI;
  }

  async searchCity(query: string): Promise<CityDTO[]> {
    try {
      Logger.log(`searchCity called with query: ${query}`);
      const results = await this.geocodingAPI.searchCity(query);
      Logger.log(`Received ${results.length} results for query: ${query}`);
      return results;
    } catch (error) {
      Logger.logError('Error in searchCity:', error);
      throw error;
    }
  }

  async searchByZip(zip: string): Promise<CityDTO> {
    try {
      Logger.log(`searchByZip called with zip: ${zip}`);
      const result = await this.geocodingAPI.searchByZip(zip);
      Logger.log(`Received result for zip: ${zip}`);
      return result;
    } catch (error) {
      Logger.logError('Error in searchByZip:', error);
      throw error;
    }
  }

  async getWeatherData(latitude: number, longitude: number): Promise<any> {
    try {
      const weatherData = await this.geocodingAPI.getWeatherData(latitude, longitude);
      
      if (!weatherData) {
        throw new Error("Received null or undefined weather data from API");
      }
  
      Logger.log(`Received weather data for coordinates: ${latitude}, ${longitude} \n`);
      const mappedData = WeatherUseCases.mapWeatherDTOToViewModel(weatherData);
      return mappedData;
    } catch (error) {
      Logger.logError('Error in getWeatherData:', error);
      throw error;
    }
  }

  async getHourlyForecast(latitude: number, longitude: number): Promise<any[]> {
    try {
      const hourlyForecast = await this.geocodingAPI.getHourlyForecast(latitude, longitude);
      return hourlyForecast;
    } catch (error) {
      Logger.logError('Error in getHourlyForecast:', error);
      throw error;
    }
  }
}
