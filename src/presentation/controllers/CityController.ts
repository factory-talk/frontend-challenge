import { IOpenWeatherGeocoding } from '@application/interfaces/IOpenWeatherGeocoding';
import { CityDTO } from '@application/dtos/CityDTO';
import { Logger } from '@infrastructure/utils/Logger';

export class CityController {
  private geocodingService: IOpenWeatherGeocoding;
  private iso3166CountryCodes: string[] = ['US', 'CA', 'GB', 'DE'];

  constructor(geocodingService: IOpenWeatherGeocoding) {
    this.geocodingService = geocodingService;
  }

  private isValidZipcode(query: string): boolean {
    const regex = /^[0-9]{5}(-[0-9]{4})?,[A-Z]{2}$/;
    const [zipcode, countryCode] = query.split(',');

    return regex.test(query) && this.iso3166CountryCodes.includes(countryCode);
  }

  async searchCityOrZip(query: string): Promise<CityDTO[]> {
    try {
      if (this.isValidZipcode(query)) {
        const city = await this.geocodingService.searchByZip(query);
        return [city];
      } else {
        return await this.geocodingService.searchCity(query);
      }
    } catch (error) {
      Logger.logError('Error in CityController:', error);
      throw new Error('Could not retrieve city data');
    }
  }
}
