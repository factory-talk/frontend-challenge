import  { setSearchResults, clearSearchResults } from '@application/states/slices/searchResultsSlice';
import  { addCity, removeCity } from '@application/states/slices/selectedCitiesSlice';
import { setCoordinates, clearCoordinates } from '@application/states/slices/coordinatesSlice';
import { setTemperatureUnit } from '@application/states/slices/temperatureUnitSlice';
import { store, RootState, AppDispatch } from '@application/states/store';
import { CityViewModel } from '@application/dtos/CityViewModel';
import { CityDTO } from '@application/dtos/CityDTO';

const mockCityDTO = new CityDTO('Bangkok', 'Thailand'
    , 'Bangkok, Thailand', 13.7563, 100.5018);
const mockCityViewModel = new CityViewModel(mockCityDTO);

describe('Redux Store', () => {
  it('should have the correct initial state', () => {
    const initialState: RootState = store.getState();
    
    expect(initialState.searchResults).toEqual({ searchResults: [] });
    expect(initialState.selectedCities).toEqual({ cities: [], selectedCity: null });
    expect(initialState.coordinates).toEqual({ latitude: null, longitude: null });
    expect(initialState.temperatureUnit).toEqual({ unit: 'Celsius' });
  });

  it('should handle dispatching actions correctly', () => {
    const dispatch: AppDispatch = store.dispatch;

    // Test searchResults slice actions
    dispatch(setSearchResults([mockCityViewModel]));
    let state = store.getState();
    expect(state.searchResults.searchResults).toHaveLength(1);

    dispatch(clearSearchResults());
    state = store.getState();
    expect(state.searchResults.searchResults).toHaveLength(0);

    // Test selectedCities slice actions
    dispatch(addCity({ city: mockCityViewModel, weather: null }));
    state = store.getState();
    expect(state.selectedCities.cities).toHaveLength(1);

    dispatch(removeCity({ name: 'Bangkok' }));
    state = store.getState();
    expect(state.selectedCities.cities).toHaveLength(0);

    // Test coordinates slice actions
    dispatch(setCoordinates({ latitude: 13.7563, longitude: 100.5018 }));
    state = store.getState();
    expect(state.coordinates).toEqual({ latitude: 13.7563, longitude: 100.5018 });

    dispatch(clearCoordinates());
    state = store.getState();
    expect(state.coordinates).toEqual({ latitude: null, longitude: null });

    // Test temperatureUnit slice actions
    dispatch(setTemperatureUnit('Fahrenheit'));
    state = store.getState();
    expect(state.temperatureUnit.unit).toBe('Fahrenheit');
  });
});
