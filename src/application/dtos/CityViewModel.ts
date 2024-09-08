import { CityDTO } from '@application/dtos/CityDTO';

export class CityViewModel {
  private cityDTO: CityDTO;

  public getCityDTO() {
    return this.cityDTO;
  }

  constructor(cityDTO: CityDTO) {
    this.cityDTO = cityDTO;
  }

  public getName(): string {
    return this.cityDTO.name;
  }

  public getCountry(): string {
    return this.cityDTO.country;
  }

  public getDisplayName(): string {
    return this.cityDTO.displayName;
  }

  public getLatitude(): number {
    return this.cityDTO.latitude;
  }

  public getLongitude(): number {
    return this.cityDTO.longitude;
  }

  public serialize(): CityDTO {
    return this.cityDTO;
  }
}
