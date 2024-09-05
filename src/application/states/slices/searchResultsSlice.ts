import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CityViewModel } from '@application/dtos/CityViewModel';

interface SearchResultsState {
  searchResults: CityViewModel[];
}

const initialState: SearchResultsState = {
  searchResults: [],
};

const searchResultsSlice = createSlice({
  name: 'searchResults',
  initialState,
  reducers: {
    setSearchResults(state, action: PayloadAction<CityViewModel[]>) {
      state.searchResults = action.payload;
    },
    clearSearchResults(state) {
      state.searchResults = [];
    },
  },
});

export const { setSearchResults, clearSearchResults } = searchResultsSlice.actions;
export default searchResultsSlice.reducer;
