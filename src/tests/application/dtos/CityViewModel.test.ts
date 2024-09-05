import { CityDTO } from '@application/dtos/CityDTO';
import { CityViewModel } from '@application/dtos/CityViewModel';

describe('CityViewModel', () => {
  const mockCityDTO: CityDTO = {
    name: 'Bangkok',
    country: 'Thailand',
    displayName: 'Bangkok, Thailand',
    latitude: 13.7563,
    longitude: 100.5018,
  };

  it('should create an instance of CityViewModel', () => {
    const cityViewModel = new CityViewModel(mockCityDTO);
    expect(cityViewModel.getCityDTO()).toBe(mockCityDTO);
  });

  it('should return the correct name from getName()', () => {
    const cityViewModel = new CityViewModel(mockCityDTO);
    expect(cityViewModel.getName()).toBe('Bangkok');
  });

  it('should return the correct country from getCountry()', () => {
    const cityViewModel = new CityViewModel(mockCityDTO);
    expect(cityViewModel.getCountry()).toBe('Thailand');
  });

  it('should return the correct display name from getDisplayName()', () => {
    const cityViewModel = new CityViewModel(mockCityDTO);
    expect(cityViewModel.getDisplayName()).toBe('Bangkok, Thailand');
  });

  it('should return the correct latitude from getLatitude()', () => {
    const cityViewModel = new CityViewModel(mockCityDTO);
    expect(cityViewModel.getLatitude()).toBe(13.7563);
  });

  it('should return the correct longitude from getLongitude()', () => {
    const cityViewModel = new CityViewModel(mockCityDTO);
    expect(cityViewModel.getLongitude()).toBe(100.5018);
  });

  it('should serialize the CityViewModel to a CityDTO', () => {
    const cityViewModel = new CityViewModel(mockCityDTO);
    expect(cityViewModel.serialize()).toEqual(mockCityDTO);
  });
});
