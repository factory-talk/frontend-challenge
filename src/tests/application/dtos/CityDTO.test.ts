import { CityDTO } from '@application/dtos/CityDTO';

describe('CityDTO', () => {
  it('should create an instance with default values when no parameters are provided', () => {
    const city = new CityDTO();
    expect(city.name).toBe('');
    expect(city.country).toBe('');
    expect(city.displayName).toBe('');
    expect(city.latitude).toBe(0);
    expect(city.longitude).toBe(0);
  });

  it('should create an instance with the provided values', () => {
    const city = new CityDTO('Bangkok', 'TH', 'Bangkok, TH', 13.7563, 100.5018);
    expect(city.name).toBe('Bangkok');
    expect(city.country).toBe('TH');
    expect(city.displayName).toBe('Bangkok, TH');
    expect(city.latitude).toBe(13.7563);
    expect(city.longitude).toBe(100.5018);
  });
});
