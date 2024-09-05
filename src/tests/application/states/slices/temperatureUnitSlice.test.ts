import temperatureUnitReducer, { setTemperatureUnit, updateTemperatureUnit } from '@application/states/slices/temperatureUnitSlice';
import { Logger } from '@infrastructure/utils/Logger';

jest.mock('@infrastructure/utils/Logger', () => ({
  Logger: {
    log: jest.fn(),
    logAPIRequest: jest.fn(),
    logAPIResponse: jest.fn(),
    logError: jest.fn(),
  },
}));

interface TemperatureUnitState {
  unit: 'Celsius' | 'Fahrenheit' | 'Kelvin';
}

describe('temperatureUnitSlice', () => {
  const initialState: TemperatureUnitState = {
    unit: 'Celsius',
  };

  it('should return the initial state', () => {
    const state = temperatureUnitReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('should handle setTemperatureUnit action', () => {
    const state = temperatureUnitReducer(initialState, setTemperatureUnit('Fahrenheit'));
    expect(state.unit).toEqual('Fahrenheit');
    expect(Logger.log).toHaveBeenCalledWith('Temperature unit set to: Fahrenheit');
  });

  it('should handle updateTemperatureUnit action', () => {
    const state = temperatureUnitReducer(initialState, updateTemperatureUnit('Kelvin'));
    expect(state.unit).toEqual('Kelvin');
    expect(Logger.log).toHaveBeenCalledWith('Temperature unit updated to: Kelvin');
  });
});
