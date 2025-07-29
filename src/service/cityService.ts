import { City } from '@/model/CityModel';
import { SuggestionResult } from '@/model/SuggestionResult';
import { WeatherData } from '@/model/WeatherData';
export class CityService {
  private static cities: City[] = [];
  private static weatherData: WeatherData[] = [];
  private static isLoaded: boolean = false;
  static async loadCities(): Promise<void> {
    try {
      const citiesResponse = await fetch('/data/city.list.json');
      const citiesData = await citiesResponse.json() as City[];
      const citiesMap = new Map<number, City>();
      citiesData.forEach(city => {
        citiesMap.set(city.id, city);
      });
      this.cities = citiesData;
      try {
        const weatherResponse = await fetch('/data/weather_16.json');
        const weatherText = await weatherResponse.text();
        const lines = weatherText.trim().split('\n');
        const weatherDataArray: WeatherData[] = [];
        for (const line of lines) {
          try {
            const weatherEntry = JSON.parse(line) as any;
            const cityId = weatherEntry.city.id;
            const city = citiesMap.get(cityId);
            if (city) {
              const weatherData: WeatherData = {
                city,
                time: weatherEntry.time,
                main: weatherEntry.main,
                weather: weatherEntry.weather,
                wind: weatherEntry.wind,
                clouds: weatherEntry.clouds
              };
              weatherDataArray.push(weatherData);
            }
          } catch (lineError) {
            console.warn('Failed to parse weather data line:', lineError);
          }
        }
        this.weatherData = weatherDataArray;
        console.log(`Loaded ${this.cities.length} cities and ${this.weatherData.length} weather records`);
      } catch (weatherError) {
        console.warn('Failed to load weather data:', weatherError);
        this.weatherData = [];
      }
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load city data:', error);
      this.cities = [];
      this.weatherData = [];
      this.isLoaded = false;
    }
  }
  static getWeatherData(cityId: number): WeatherData | undefined {
    return this.weatherData.find(data => data.city.id === cityId);
  }
  static getAllWeatherData(): WeatherData[] {
    return [...this.weatherData];
  }
  static isDataLoaded(): boolean {
    return this.isLoaded;
  }
  static getCitiesCount(): number {
    return this.cities.length;
  }
  static searchCities(
    query: string,
    limit: number = 10,
    offset: number = 0
  ): SuggestionResult {
    if (!query.trim()) {
      return {
        cities: [],
        hasMore: false,
        total: 0
      };
    }
    const searchTerm = query.toLowerCase().trim();
    const filteredCities = this.cities.filter(city => 
      city.name.toLowerCase().includes(searchTerm) ||
      city.country.toLowerCase().includes(searchTerm)
    );
    const sortedCities = filteredCities.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName === searchTerm) return -1;
      if (bName === searchTerm) return 1;
      if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
      if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
      return aName.localeCompare(bName);
    });
    const paginatedCities = sortedCities.slice(offset, offset + limit);
    return {
      cities: paginatedCities,
      hasMore: sortedCities.length > offset + limit,
      total: sortedCities.length
    };
  }
  static getCityById(id: number): City | undefined {
    return this.cities.find(city => city.id === id);
  }
  static getAllCities(): City[] {
    return [...this.cities];
  }
}

