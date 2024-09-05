import { configureStore } from '@reduxjs/toolkit';
import searchResultsReducer from '@application/states/slices/searchResultsSlice';
import selectedCityReducer from '@application/states/slices/selectedCitiesSlice';
import coordinatesReducer from '@application/states/slices/coordinatesSlice';
import temperatureUnitReducer from '@application/states/slices/temperatureUnitSlice';

export const store = configureStore({
  reducer: {
    searchResults: searchResultsReducer,
    selectedCities: selectedCityReducer,
    coordinates: coordinatesReducer,
    temperatureUnit: temperatureUnitReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
