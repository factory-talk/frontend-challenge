import searchResultsReducer, { setSearchResults, clearSearchResults } from '@application/states/slices/searchResultsSlice';
import { CityViewModel } from '@application/dtos/CityViewModel';

describe('searchResultsSlice', () => {
  const initialState = {
    searchResults: [],
  };

  const mockCity = new CityViewModel({ name: 'Bangkok', country: 'Thailand', displayName: 'Bangkok, Thailand', latitude: 13.7563, longitude: 100.5018 });

  it('should return the initial state', () => {
    // Fix: Pass "@@INIT" instead of undefined for the initial state test
    const state = searchResultsReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('should handle setSearchResults action', () => {
    const state = searchResultsReducer(initialState, setSearchResults([mockCity]));
    expect(state.searchResults).toEqual([mockCity]);
  });

  it('should handle clearSearchResults action', () => {
    const modifiedState = { searchResults: [mockCity] };
    const state = searchResultsReducer(modifiedState, clearSearchResults());
    expect(state.searchResults).toEqual([]);
  });
});
