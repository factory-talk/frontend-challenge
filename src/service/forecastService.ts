import { City } from '@/model/CityModel';
export interface CurrentWeatherCoord {
  lon: number;
  lat: number;
}
export interface CurrentWeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}
export interface CurrentWeatherWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}
export interface CurrentWeatherClouds {
  all: number;
}
export interface CurrentWeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}
export interface CurrentWeatherSys {
  country: string;
  sunrise: number;
  sunset: number;
}
export interface CurrentWeatherResponse {
  coord: CurrentWeatherCoord;
  weather: CurrentWeatherWeather[];
  base: string;
  main: CurrentWeatherMain;
  visibility: number;
  wind: CurrentWeatherWind;
  clouds: CurrentWeatherClouds;
  dt: number;
  sys: CurrentWeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
export interface ForecastMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}
export interface ForecastWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}
export interface ForecastClouds {
  all: number;
}
export interface ForecastWind {
  speed: number;
  deg: number;
  gust?: number;
}
export interface ForecastRain {
  '3h': number;
}
export interface ForecastSys {
  pod: string;
}
export interface ForecastItem {
  dt: number;
  main: ForecastMain;
  weather: ForecastWeather[];
  clouds: ForecastClouds;
  wind: ForecastWind;
  visibility: number;
  pop: number;
  rain?: ForecastRain;
  sys: ForecastSys;
  dt_txt: string;
}
export interface ForecastCity {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}
export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: ForecastCity;
}
export interface DailyForecast {
  date: string;
  items: ForecastItem[];
  minTemp: number;
  maxTemp: number;
  averageHumidity: number;
  mainWeather: string;
  weatherIcon: string;
  rainProbability: number;
}
export class ForecastService {
  private static readonly API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  private static readonly FORECAST_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';
  private static readonly CURRENT_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
  static async getCurrentWeather(city: City): Promise<CurrentWeatherResponse | null> {
    try {
      if (!this.API_KEY) {
        throw new Error('OpenWeatherMap API key is not configured');
      }
      const { lat, lon } = city.coord;
      const url = `${this.CURRENT_WEATHER_BASE_URL}?appid=${this.API_KEY}&lat=${lat}&lon=${lon}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      const data: CurrentWeatherResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch current weather data:', error);
      return null;
    }
  }
  static async getCurrentWeatherByCoordinates(lat: number, lon: number): Promise<CurrentWeatherResponse | null> {
    try {
      if (!this.API_KEY) {
        throw new Error('OpenWeatherMap API key is not configured');
      }
      const url = `${this.CURRENT_WEATHER_BASE_URL}?appid=${this.API_KEY}&lat=${lat}&lon=${lon}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      const data: CurrentWeatherResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch current weather data:', error);
      return null;
    }
  }
  static async getForecast(city: City): Promise<ForecastResponse | null> {
    try {
      if (!this.API_KEY) {
        throw new Error('OpenWeatherMap API key is not configured');
      }
      const { lat, lon } = city.coord;
      const url = `${this.FORECAST_BASE_URL}?appid=${this.API_KEY}&lat=${lat}&lon=${lon}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      const data: ForecastResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch forecast data:', error);
      return null;
    }
  }
  static async getForecastByCoordinates(lat: number, lon: number): Promise<ForecastResponse | null> {
    try {
      if (!this.API_KEY) {
        throw new Error('OpenWeatherMap API key is not configured');
      }
      const url = `${this.FORECAST_BASE_URL}?appid=${this.API_KEY}&lat=${lat}&lon=${lon}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      const data: ForecastResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch forecast data:', error);
      return null;
    }
  }
  static groupForecastByDay(forecastData: ForecastResponse, currentWeather?: CurrentWeatherResponse): DailyForecast[] {
    const grouped = new Map<string, ForecastItem[]>();
    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(item);
    });
    const dailyForecasts: DailyForecast[] = [];
    if (currentWeather) {
      const today = new Date().toISOString().split('T')[0];
      if (!grouped.has(today)) {
        const mockTodayItem: ForecastItem = {
          dt: currentWeather.dt,
          main: {
            temp: currentWeather.main.temp,
            feels_like: currentWeather.main.feels_like,
            temp_min: currentWeather.main.temp_min,
            temp_max: currentWeather.main.temp_max,
            pressure: currentWeather.main.pressure,
            sea_level: currentWeather.main.sea_level,
            grnd_level: currentWeather.main.grnd_level,
            humidity: currentWeather.main.humidity,
            temp_kf: 0
          },
          weather: currentWeather.weather,
          clouds: currentWeather.clouds,
          wind: currentWeather.wind,
          visibility: currentWeather.visibility,
          pop: 0,
          sys: { pod: currentWeather.sys.sunrise < currentWeather.dt && currentWeather.dt < currentWeather.sys.sunset ? 'd' : 'n' },
          dt_txt: new Date(currentWeather.dt * 1000).toISOString().replace('T', ' ').substring(0, 19)
        };
        dailyForecasts.push({
          date: today,
          items: [mockTodayItem],
          minTemp: currentWeather.main.temp_min,
          maxTemp: currentWeather.main.temp_max,
          averageHumidity: currentWeather.main.humidity,
          mainWeather: currentWeather.weather[0].main,
          weatherIcon: currentWeather.weather[0].icon,
          rainProbability: 0
        });
      }
    }
    grouped.forEach((items, date) => {
      const temperatures = items.map(item => item.main.temp);
      const minTemp = Math.min(...temperatures);
      const maxTemp = Math.max(...temperatures);
      const averageHumidity = items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length;
      const weatherCounts = new Map<string, number>();
      const iconCounts = new Map<string, number>();
      items.forEach(item => {
        const weather = item.weather[0];
        weatherCounts.set(weather.main, (weatherCounts.get(weather.main) || 0) + 1);
        iconCounts.set(weather.icon, (iconCounts.get(weather.icon) || 0) + 1);
      });
      const mainWeather = Array.from(weatherCounts.entries())
        .sort((a, b) => b[1] - a[1])[0][0];
      const weatherIcon = Array.from(iconCounts.entries())
        .sort((a, b) => b[1] - a[1])[0][0];
      const rainProbability = items.reduce((sum, item) => sum + (item.pop * 100), 0) / items.length;
      dailyForecasts.push({
        date,
        items,
        minTemp,
        maxTemp,
        averageHumidity: Math.round(averageHumidity),
        mainWeather,
        weatherIcon,
        rainProbability: Math.round(rainProbability)
      });
    });
    return dailyForecasts.sort((a, b) => a.date.localeCompare(b.date));
  }
  static getHourlyForecastForDay(forecastData: ForecastResponse, targetDate: string): ForecastItem[] {
    const hourlyData = forecastData.list.filter(item => {
      const itemDate = item.dt_txt.split(' ')[0];
      return itemDate === targetDate;
    });
    if (hourlyData.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      if (targetDate === today) {
        return forecastData.list.slice(0, 8);
      }
    }
    return hourlyData;
  }
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric'
    });
  }
  static formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
}

