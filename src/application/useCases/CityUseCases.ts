import { OpenWeatherGeocodingService } from '@application/services/OpenWeatherGeocodingService';
import { CityViewModel } from '@application/dtos/CityViewModel';
import { Logger } from '@infrastructure/utils/Logger';


export class CityUseCases {
  private geocodingService: OpenWeatherGeocodingService;

  constructor(geocodingService: OpenWeatherGeocodingService) {
    this.geocodingService = geocodingService;
  }

  public async searchCityOrZip(query: string): Promise<CityViewModel[]> {
    let results: CityViewModel[] = [];

    try {
      // Search by city name
      const cityResults = await this.geocodingService.searchCity(query);
      results = cityResults.map(dto => new CityViewModel(dto));

      // Search by ZIP code
      try {
        const zipResult = await this.geocodingService.searchByZip(query);
        Logger.log('zipResult: ', zipResult);

        if (zipResult) {
          zipResult.map(dto => results.push(new CityViewModel(dto)));
        }
      } catch (error) {
        Logger.logError('Error in searchByZip: ',null)
      }
      const uniqueResults = this.removeDuplicates(results);
      Logger.log("uniqueResults: ",uniqueResults)

      return uniqueResults;
    } catch (error) {
      console.error('Error in searchCityOrZip: ', error);
      throw error;
    }
  }

  private removeDuplicates(cities: CityViewModel[]): CityViewModel[] {
    const uniqueCities = new Map<string, CityViewModel>();
    
    for (const city of cities) {
      const key = `${city.getLatitude()},${city.getLongitude()}`;
      if (!uniqueCities.has(key)) {
        uniqueCities.set(key, city);
      }
    }

    return Array.from(uniqueCities.values());
  }

}
