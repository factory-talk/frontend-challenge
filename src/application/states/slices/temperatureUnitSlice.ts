import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Logger } from '@infrastructure/utils/Logger';

export type TemperatureUnit = 'Celsius' | 'Fahrenheit' | 'Kelvin';

interface TemperatureUnitState {
  unit: TemperatureUnit;
}

const initialState: TemperatureUnitState = {
  unit: 'Celsius',
};

const temperatureUnitSlice = createSlice({
  name: 'temperatureUnit',
  initialState,
  reducers: {
    setTemperatureUnit: (state, action: PayloadAction<TemperatureUnit>) => {
      state.unit = action.payload;
      Logger.log(`Temperature unit set to: ${state.unit}`);
    },
    updateTemperatureUnit: (state, action: PayloadAction<TemperatureUnit>) => {
      state.unit = action.payload;
      Logger.log(`Temperature unit updated to: ${state.unit}`);
    },
  },
});

export const { setTemperatureUnit, updateTemperatureUnit } = temperatureUnitSlice.actions;
export default temperatureUnitSlice.reducer;
