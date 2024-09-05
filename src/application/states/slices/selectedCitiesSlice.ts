import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CityDTO } from '@application/dtos/CityDTO';
import { WeatherDTO } from '@application/dtos/WeatherDTO';
import { CityViewModel } from '@application/dtos/CityViewModel';
import { Logger } from '@infrastructure/utils/Logger';

interface SelectedCityState {
  cities: {
    city: CityViewModel;
    weather: WeatherDTO | null;
  }[];
  selectedCity: CityViewModel | null;
}

const loadStateFromLocalStorage = (): SelectedCityState => {
  if (typeof window === 'undefined') {
    return { cities: [], selectedCity: null };
  }

  try {
    const serializedState = localStorage.getItem('selectedCities');
    if (serializedState === null) {
      Logger.log('No state found in localStorage');
      return { cities: [], selectedCity: null };
    }

    const parsedState = JSON.parse(serializedState);

    if (parsedState.cities && Array.isArray(parsedState.cities)) {
      parsedState.cities = parsedState.cities.map((cityItem: { city: CityDTO, weather: WeatherDTO | null }) => ({
        city: new CityViewModel(cityItem.city),
        weather: cityItem.weather,
      }));
    } else {
      parsedState.cities = [];
    }

    if (parsedState.selectedCity && parsedState.cities.length > 0) {
      parsedState.selectedCity = new CityViewModel(parsedState.selectedCity);
    } else {
      parsedState.selectedCity = null; 
    }

    Logger.log('Loaded state from localStorage', parsedState);
    return parsedState;
  } catch (error) {
    Logger.logError("Failed to load state from localStorage", error);
    return { cities: [], selectedCity: null };
  }
};

const initialState: SelectedCityState = loadStateFromLocalStorage();

const selectedCitiesSlice = createSlice({
  name: 'selectedCities',
  initialState,
  reducers: {
    addCity(state, action: PayloadAction<{ city: CityViewModel; weather: WeatherDTO | null }>) {
      Logger.log('Adding city. Current state:', state);
      Logger.log('City to add:', action.payload);

      const cityExists = state.cities.some(existingCity => existingCity.city.getName() === action.payload.city.getName());
      if (!cityExists) {
        state.cities.push(action.payload);
        state.selectedCity = action.payload.city; 

        const newState = {
          ...state,
          cities: state.cities.map(cityItem => ({
            city: cityItem.city.serialize(),
            weather: cityItem.weather,
          })),
          selectedCity: state.selectedCity ? state.selectedCity.serialize() : null,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('selectedCities', JSON.stringify(newState));
        }
        Logger.log(`City ${action.payload.city.getName()} added to selected cities. New state:`, newState);
      } else {
        Logger.log(`City ${action.payload.city.getName()} already exists in state.`);
      }
    },
    removeCity(state, action: PayloadAction<{ name: string }>) {
      Logger.log('Removing city. Current state:', state);
      Logger.log('City to remove:', action.payload.name);

      state.cities = state.cities.filter(existingCity => existingCity.city.getName() !== action.payload.name);

      if (state.cities.length === 0 || state.selectedCity?.getName() === action.payload.name) {
        state.selectedCity = null;  
      }

      const newState = {
        ...state,
        cities: state.cities.map(cityItem => ({
          city: cityItem.city.serialize(),
          weather: cityItem.weather,
        })),
        selectedCity: state.selectedCity ? state.selectedCity.serialize() : null,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedCities', JSON.stringify(newState));
      }
      Logger.log(`City ${action.payload.name} removed from selected cities. New state:`, newState);
    },
    updateCityWeather(state, action: PayloadAction<{ cityName: string; weather: WeatherDTO }>) {
      Logger.log('Updating city weather. Current state:', state);
      Logger.log('Weather update payload:', action.payload);

      const cityToUpdate = state.cities.find(existingCity => existingCity.city.getName() === action.payload.cityName);
      if (cityToUpdate) {
        cityToUpdate.weather = action.payload.weather;
        Logger.log(`Updated weather for ${cityToUpdate.city.getName()}`, cityToUpdate.weather);

        if (state.selectedCity?.getName() === action.payload.cityName) {
          state.selectedCity = cityToUpdate.city;
          Logger.log(`Updated selected city to: ${state.selectedCity.getName()}`);
        }

        const newState = {
          ...state,
          cities: state.cities.map(cityItem => ({
            city: cityItem.city.serialize(),
            weather: cityItem.weather,
          })),
          selectedCity: state.selectedCity ? state.selectedCity.serialize() : null,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('selectedCities', JSON.stringify(newState));
        }
        Logger.log('New state after weather update:', newState);
      } else {
        Logger.log(`City ${action.payload.cityName} not found in state.`);
      }
    },
    clearCities(state) {
      Logger.log('Clearing all cities. Current state:', state);

      state.cities = [];
      state.selectedCity = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedCities');
      }
      Logger.log("Cleared all selected cities from localStorage. New state:", state);
    },
    setSelectedCity(state, action: PayloadAction<CityViewModel | null>) {
      Logger.log('Setting selected city. Current state:', state);
      Logger.log('New selected city:', action.payload);

      state.selectedCity = action.payload;

      const newState = {
        ...state,
        cities: state.cities.map(cityItem => ({
          city: cityItem.city.serialize(),
          weather: cityItem.weather,
        })),
        selectedCity: state.selectedCity ? state.selectedCity.serialize() : null,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedCities', JSON.stringify(newState));
      }
      Logger.log(`Selected city set to ${action.payload ? action.payload.getName() : 'null'}. New state:`, newState);
    },
  },
});

export const { addCity, removeCity, updateCityWeather, clearCities, setSelectedCity } = selectedCitiesSlice.actions;
export default selectedCitiesSlice.reducer;
