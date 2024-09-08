 import { Logger } from '@infrastructure/utils/Logger';


export class WeatherDTO {
  id: string | number;
  cityName: string;
  rainVolumn: number;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  mainWeather: string;
  descWeather: string;
  icon: string;  
  dateTime: number;
  timeZone: number;

  constructor(
    id: string | number,
    cityName: string,
    rainVolumn: number,
    avgTemp: number,
    minTemp: number,
    maxTemp: number,
    humidity: number,
    windSpeed: number,
    pressure: number,
    mainWeather: string,
    descWeather: string,
    icon: string,
    dateTime: number,
    timeZone: number
    ) {
    this.id = id;
    this.cityName = cityName;
    this.rainVolumn = rainVolumn;
    this.avgTemp = avgTemp;
    this.minTemp = minTemp;
    this.maxTemp = maxTemp;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.pressure = pressure;
    this.mainWeather = mainWeather;
    this.descWeather = descWeather;
    this.icon = icon;
    this.dateTime = dateTime;
    this.timeZone = timeZone;
  }

  public static deserializeWeatherDTO(data: any): WeatherDTO {
    if (!data || typeof data !== 'object') {
      Logger.logError("Cannot deserialize null, undefined, or non-object data into WeatherDTO", data);
      return new WeatherDTO(
        0,
        "Unknown Location",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        "Unknown Main Weather",
        "Unknown Desc Weather",
        "01d",
        0,
        0
      );
    }

    return new WeatherDTO(
      data.id ?? 0,
      data.cityName ?? "Unknown Location",
      data.rainVolumn ?? 0,
      data.avgTemp ?? 0,
      data.minTemp ?? 0,
      data.maxTemp ?? 0,
      data.humidity ?? 0,
      data.windSpeed ?? 0,
      data.pressure ?? 0,
      data.mainWeather ?? "Unknown Main Weather",
      data.descWeather ?? "Unknown Desc Weather",
      data.icon ?? "01d",
      data.dateTime ?? 0,
      data.timeZone ?? 0
    );
  } 

  public serializeWeatherDTO() {
    return {
      id: this.id,
      cityName: this.cityName,
      rainVolumn: this.rainVolumn,
      avgTemp: this.avgTemp,
      minTemp: this.minTemp,
      maxTemp: this.maxTemp,
      humidity: this.humidity,
      windSpeed: this.windSpeed,
      pressure: this.pressure,
      mainWeather: this.mainWeather,
      descWeather: this.descWeather,
      icon: this.icon,
      dateTime: this.dateTime,
      timeZone: this.timeZone
    };
  }
}
