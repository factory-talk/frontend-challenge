import { HttpClient, APIError } from '@infrastructure/utils/HttpClient';
import { appConfig } from '../config/appConfig';
import { apiKeys } from '../config/apiKeys';
import { CityDTO } from '@application/dtos/CityDTO';
import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { store } from '@application/states/store';
import { Logger } from '@infrastructure/utils/Logger';

export class OpenWeatherAPI {
  private geoClient: HttpClient;
  private weatherClient: HttpClient;

  constructor() {
    this.geoClient = new HttpClient(appConfig.geoCodingBaseUrl); 
    this.weatherClient = new HttpClient(appConfig.weatherBaseUrl); 
  }

  async searchCity(query: string): Promise<CityDTO[]> {
    const endpoint = '/direct';
    const params = { q: query, limit: 10, appid: apiKeys.openWeatherMapApiKey };

    try {
      const data = await this.geoClient.get(endpoint, params);
      Logger.logAPIResponse(endpoint, data); 

      return data.map((result: any) => {
        return new CityDTO(
          result.name,
          result.country,
          `${result.name}, ${result.country}`,
          result.lat,
          result.lon
        );
      });
    } catch (error) {
      if (error instanceof APIError) {
        Logger.logError(`API error in searchCity: API error`, error);
        return [];
      } else {
        Logger.logError(`Error searching city: ${error.message || 'Unknown error'}`, error);
        return [];
      }
    }
  }

  async searchByZip(zip: string): Promise<CityDTO[]> {
    const endpoint = '/zip';
    const params = { zip, appid: apiKeys.openWeatherMapApiKey };

    try {
      const data = await this.geoClient.get(endpoint, params);
      Logger.logAPIResponse(endpoint, data); 

      return [
        new CityDTO(
          data.name,
          data.country,
          `${data.name}, ${data.country}`,
          data.lat,
          data.lon
        )
      ];
    } catch (error) {
      if (error instanceof APIError) {
        Logger.logError(`API error in searchByZip: API error`, error); 
        return [];
      } else {
        Logger.logError(`Error searching by zip: ${error.message || 'Unknown error'}`, error);
        return [];
      }
    }
  }

  async getWeatherData(latitude: number, longitude: number): Promise<WeatherDTO> {
  const state = store.getState();
  const unit = state.temperatureUnit.unit.toLowerCase();

  const endpoint = '/weather';
  const params: any = { lat: latitude, lon: longitude, appid: apiKeys.openWeatherMapApiKey };

  if (unit === 'celsius') {
    params['units'] = 'metric';
  } else if (unit === 'fahrenheit') {
    params['units'] = 'imperial';
  }

  Logger.logAPIRequest(endpoint, params);

  try {
    const data = await this.weatherClient.get(endpoint, params);
    Logger.logAPIResponse(endpoint, data);

    const { name, main, weather, wind, dt, rain, timezone } = data;

    return new WeatherDTO(
      weather && weather[0] ? weather[0].main : 'Unknown Main',
      name || 'Unknown Location',
      rain && rain['3h'] !== undefined ? rain['3h'] : 0,
      main && main.temp != null ? main.temp : 0,
      main && main.temp_min != null ? main.temp_min : 0,
      main && main.temp_max != null ? main.temp_max : 0,
      main && main.humidity !== undefined ? main.humidity : 0,
      wind && wind.speed !== undefined ? wind.speed : 0,
      main && main.pressure !== undefined ? main.pressure : 0,
      weather && weather[0] ? weather[0].main : 'Unknown Main',
      weather && weather[0] ? weather[0].description : 'No description available',
      weather && weather[0] ? weather[0].icon : '01d',
      dt || 0,
      timezone || 0
    );
  } catch (error) {
    if (error instanceof APIError) {
      Logger.logError(`API error in getWeatherData: ${error.message || 'Unknown error'}`, error);
    } else {
      Logger.logError(`Error fetching weather data: ${error.message || 'Unknown error'}`, error);
    }
    throw error;  
  }
}

  

async getHourlyForecast(latitude: number, longitude: number): Promise<WeatherDTO[]> {
  const state = store.getState();
  const unit = state.temperatureUnit.unit.toLowerCase();

  const endpoint = '/forecast';
  const params: any = { lat: latitude, lon: longitude, appid: apiKeys.openWeatherMapApiKey, cnt: 8 };

  if (unit === 'celsius') {
    params['units'] = 'metric';
  } else if (unit === 'fahrenheit') {
    params['units'] = 'imperial';
  }

  Logger.logAPIRequest(endpoint, params);

  try {
    const data = await this.weatherClient.get(endpoint, params);
    Logger.logAPIResponse(endpoint, data);

    const forecasts = data.list;

    if (!forecasts || !Array.isArray(forecasts) || forecasts.length === 0) {
      throw new Error('No forecast data received from API');
    }

    const hourlyForecasts: WeatherDTO[] = forecasts.map((forecast) => {
      return new WeatherDTO(
        forecast.weather && forecast.weather[0] ? forecast.weather[0].main : "Unknown",
        data.city.name || "Unknown Location",
        forecast.rain && forecast.rain['3h'] !== undefined ? forecast.rain['3h'] : 0,
        forecast.main && forecast.main.temp !== undefined ? forecast.main.temp : null,
        forecast.main && forecast.main.temp_min !== undefined ? forecast.main.temp_min : null,
        forecast.main && forecast.main.temp_max !== undefined ? forecast.main.temp_max : null,
        forecast.main && forecast.main.humidity !== undefined ? forecast.main.humidity : 0,
        forecast.wind && forecast.wind.speed !== undefined ? forecast.wind.speed : 0,
        forecast.main && forecast.main.pressure !== undefined ? forecast.main.pressure : 0,
        forecast.weather && forecast.weather[0] ? forecast.weather[0].main : "Unknown",
        forecast.weather && forecast.weather[0] ? forecast.weather[0].description : "No description available",
        forecast.weather && forecast.weather[0] ? forecast.weather[0].icon : "01d",
        forecast.dt !== undefined ? forecast.dt : 0, 
        data.city.timezone !== undefined ? data.city.timezone : 0, 
      );
    });

    Logger.log("Forecast items:", hourlyForecasts);
    return hourlyForecasts;
  } catch (error) {
    Logger.logError('Error fetching hourly forecast data', error);
    throw new Error('No forecast data received from API');
  }
}

  
  
}
