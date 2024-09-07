import { IOpenWeatherGeocoding } from '@application/interfaces/IOpenWeatherGeocoding';


export class CityController {
  private geocodingService: IOpenWeatherGeocoding;

  constructor(geocodingService: IOpenWeatherGeocoding) {
    this.geocodingService = geocodingService;
  }

  private isValidZipcode(query: string): boolean {
    const regex = /^[0-9]{5},[A-Z]{2}$/;
    return regex.test(query);
  }
}
