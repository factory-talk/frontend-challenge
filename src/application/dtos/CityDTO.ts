export class CityDTO {
  name: string = '';
  country: string = '';
  displayName: string = '';
  latitude: number = 0;
  longitude: number = 0;

  constructor(
    name?: string,
    country?: string,
    displayName?: string,
    latitude?: number,
    longitude?: number
  ) {
    if (name) this.name = name;
    if (country) this.country = country;
    if (displayName) this.displayName = displayName;
    if (latitude) this.latitude = latitude;
    if (longitude) this.longitude = longitude;
  }
}
