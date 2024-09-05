import { OpenWeatherGeocodingService } from '@application/services/OpenWeatherGeocodingService';
import { CityViewModel } from '@application/dtos/CityViewModel';

export class CityUseCases {
  private geocodingService: OpenWeatherGeocodingService;

  constructor(geocodingService: OpenWeatherGeocodingService) {
    this.geocodingService = geocodingService;
  }

  public async searchCityOrZip(query: string): Promise<CityViewModel[]> {
    const cities = await this.geocodingService.searchCity(query);
    return cities.map(city => new CityViewModel(city));
  }

}
