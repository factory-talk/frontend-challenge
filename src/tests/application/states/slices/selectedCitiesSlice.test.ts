import selectedCitiesReducer, { addCity, removeCity, updateCityWeather, clearCities, setSelectedCity } from '@application/states/slices/selectedCitiesSlice';
import { CityViewModel } from '@application/dtos/CityViewModel';
import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { Logger } from '@infrastructure/utils/Logger';

jest.mock('@infrastructure/utils/Logger', () => ({
  Logger: {
    log: jest.fn(),
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
    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();  
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    const state = selectedCitiesReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  
  it('should return the initial state when window is undefined', () => {
    const originalWindow = global.window;
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
    });

    const state = selectedCitiesReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);

    global.window = originalWindow;
  });

  it('should return the initial state when there is no state in localStorage', () => {
    Storage.prototype.getItem = jest.fn(() => null);
    const state = selectedCitiesReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  
  it('should handle addCity action and store the new state in localStorage', () => {
    const state = selectedCitiesReducer(initialState, addCity({ city: mockCity, weather: mockWeather }));
    expect(state.cities.length).toBe(1);
    expect(state.selectedCity).toEqual(mockCity);

    
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      'selectedCities',
      JSON.stringify({
        cities: [{ city: mockCity.serialize(), weather: mockWeather }],
        selectedCity: mockCity.serialize(),
      })
    );
  });

  it('should not add a city if it already exists and log the event', () => {
    const modifiedState = {
      cities: [{ city: mockCity, weather: mockWeather }],
      selectedCity: mockCity,
    };
    const state = selectedCitiesReducer(modifiedState, addCity({ city: mockCity, weather: mockWeather }));
    expect(state.cities.length).toBe(1); 

    expect(Logger.log).toHaveBeenCalledWith(`City ${mockCity.getName()} already exists in state.`);
    expect(Storage.prototype.setItem).not.toHaveBeenCalled(); 
  });

  
  it('should update the weather for an existing city and update localStorage', () => {
    const modifiedState = {
      cities: [{ city: mockCity, weather: null }],
      selectedCity: mockCity,
    };
    const state = selectedCitiesReducer(modifiedState, updateCityWeather({ cityName: 'Bangkok', weather: mockWeather }));
    expect(state.cities[0].weather).toEqual(mockWeather);

    
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      'selectedCities',
      JSON.stringify({
        cities: [{ city: mockCity.serialize(), weather: mockWeather }],
        selectedCity: mockCity.serialize(),
      })
    );
  });

  it('should log if the city is not found when updating weather', () => {
    const modifiedState = {
      cities: [],
      selectedCity: null,
    };
    const state = selectedCitiesReducer(modifiedState, updateCityWeather({ cityName: 'Bangkok', weather: mockWeather }));
    expect(state.cities.length).toBe(0); 

    expect(Logger.log).toHaveBeenCalledWith('City Bangkok not found in state.');
    expect(Storage.prototype.setItem).not.toHaveBeenCalled(); 
  });

  it('should handle setSelectedCity action and store the new state in localStorage', () => {
    const modifiedState = {
      cities: [{ city: mockCity, weather: mockWeather }],
      selectedCity: null,
    };
    const state = selectedCitiesReducer(modifiedState, setSelectedCity(mockCity));
    expect(state.selectedCity).toEqual(mockCity);

    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      'selectedCities',
      JSON.stringify({
        cities: [{ city: mockCity.serialize(), weather: mockWeather }],
        selectedCity: mockCity.serialize(),
      })
    );
  });

  it('should handle removeCity action and update localStorage', () => {
    const modifiedState = {
      cities: [{ city: mockCity, weather: mockWeather }],
      selectedCity: mockCity,
    };
    const state = selectedCitiesReducer(modifiedState, removeCity({ name: 'Bangkok' }));
    expect(state.cities.length).toBe(0);
    expect(state.selectedCity).toBeNull();

    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      'selectedCities',
      JSON.stringify({ cities: [], selectedCity: null })
    );
  });

  it('should handle clearCities action and remove from localStorage', () => {
    const modifiedState = {
      cities: [{ city: mockCity, weather: mockWeather }],
      selectedCity: mockCity,
    };
    const state = selectedCitiesReducer(modifiedState, clearCities());
    expect(state.cities).toEqual([]);
    expect(state.selectedCity).toBeNull();

    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('selectedCities');
  });
});
