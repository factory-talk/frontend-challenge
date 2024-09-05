import selectedCitiesReducer, { addCity, removeCity, updateCityWeather, clearCities, setSelectedCity } from '@application/states/slices/selectedCitiesSlice';
import { CityViewModel } from '@application/dtos/CityViewModel';
import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { Logger } from '@infrastructure/utils/Logger';
import { skip } from 'node:test';

jest.mock('@infrastructure/utils/Logger', () => ({
  Logger: {
    log: jest.fn(),
    logAPIRequest: jest.fn(),
    logAPIResponse: jest.fn(),
    logError: jest.fn(),
  },
}));

describe('selectedCitiesSlice', () => {
  const initialState = {
    cities: [],
    selectedCity: null,
  };

  const mockCityDTO = { name: 'Bangkok', country: 'Thailand', displayName: 'Bangkok, Thailand', latitude: 13.7563, longitude: 100.5018 };
  const mockCity = new CityViewModel(mockCityDTO);
  const mockWeather = new WeatherDTO(
    'Clear',
    'Bangkok',
    0,
    30,
    28,
    32,
    70,
    5,
    1012,
    'Clear',
    'clear sky',
    '01d',
    1627550400,
    25200
  );

  beforeEach(() => {
    // Mock localStorage state
    const mockState = {
      cities: [{ city: mockCityDTO, weather: mockWeather }],
      selectedCity: mockCityDTO,
    };
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(mockState));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    const state = selectedCitiesReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('should handle addCity action', () => {
    const state = selectedCitiesReducer(initialState, addCity({ city: mockCity, weather: mockWeather }));
    expect(state.cities.length).toBe(1);
    expect(state.selectedCity).toEqual(mockCity);
  });

  it('should handle addCity when city already exists', () => {
    const modifiedState = {
      cities: [{ city: mockCity, weather: mockWeather }],
      selectedCity: mockCity,
    };
    const state = selectedCitiesReducer(modifiedState, addCity({ city: mockCity, weather: mockWeather }));
    expect(state.cities.length).toBe(1);
    expect(Logger.log).toHaveBeenCalledWith(`City ${mockCity.getName()} already exists in state.`);
  });

  it('should handle removeCity action', () => {
    const modifiedState = {
      cities: [{ city: mockCity, weather: mockWeather }],
      selectedCity: mockCity,
    };
    const state = selectedCitiesReducer(modifiedState, removeCity({ name: 'Bangkok' }));
    expect(state.cities.length).toBe(0);
    expect(state.selectedCity).toBeNull();
  });

  it('should handle updateCityWeather action', () => {
    const modifiedState = {
      cities: [{ city: mockCity, weather: null }],
      selectedCity: mockCity,
    };
    const state = selectedCitiesReducer(modifiedState, updateCityWeather({ cityName: 'Bangkok', weather: mockWeather }));
    expect(state.cities[0].weather).toEqual(mockWeather);
  });

  it('should handle clearCities action', () => {
    const modifiedState = {
      cities: [{ city: mockCity, weather: mockWeather }],
      selectedCity: mockCity,
    };
    const state = selectedCitiesReducer(modifiedState, clearCities());
    expect(state.cities).toEqual([]);
    expect(state.selectedCity).toBeNull();
  });

  it('should handle setSelectedCity action', () => {
    const modifiedState = {
      cities: [{ city: mockCity, weather: mockWeather }],
      selectedCity: null,
    };
    const state = selectedCitiesReducer(modifiedState, setSelectedCity(mockCity));
    expect(state.selectedCity).toEqual(mockCity);
  });

  it('should return the initial state if window is undefined', () => {
    const originalWindow = global.window;

    // Temporarily set global.window to undefined
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
    });

    const state = selectedCitiesReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);

    // Restore original window object
    global.window = originalWindow;
  });

  skip('should load state from localStorage correctly', () => {
    // Mock the state loaded from localStorage
    const serializedState = JSON.stringify({
      cities: [{ city: mockCityDTO, weather: mockWeather }],
      selectedCity: mockCityDTO,
    });

    // Set up the localStorage mock to return the serialized state
    Storage.prototype.getItem = jest.fn(() => serializedState);

    // Trigger the reducer initialization
    const state = selectedCitiesReducer(undefined, { type: '@@INIT' });

    // Ensure the cities array has been properly deserialized
    const expectedCity = new CityViewModel(mockCityDTO);

    // Expect cities and selectedCity to be deserialized correctly
    expect(state.cities.length).toBe(1);
    expect(state.cities[0].city.getName()).toBe('Bangkok');
    expect(state.selectedCity).toEqual(expectedCity);
  });

  it('should handle errors in loadStateFromLocalStorage', () => {
    // Simulate an error during state loading
    Storage.prototype.getItem = jest.fn(() => {
      throw new Error('localStorage error');
    });

    // Trigger the reducer initialization
    const state = selectedCitiesReducer(undefined, { type: '@@INIT' });

    // Expect empty state when there is an error
    expect(state.cities.length).toBe(0);
    expect(state.selectedCity).toBeNull();
  });
});
