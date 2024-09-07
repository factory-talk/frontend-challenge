import { CityDTO } from '@application/dtos/CityDTO';
import { WeatherDTO } from '@application/dtos/WeatherDTO'; 

export interface IOpenWeatherGeocoding {
  searchCity(query: string): Promise<CityDTO[]>;
  searchByZip(zip: string): Promise<CityDTO[]>;
  getWeatherData(latitude: number, longitude: number): Promise<WeatherDTO>; 
  getHourlyForecast(latitude: number, longitude: number): Promise<WeatherDTO[]>; 
}
