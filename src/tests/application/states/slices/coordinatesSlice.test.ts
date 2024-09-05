import coordinatesReducer, { setCoordinates, clearCoordinates } from '@application/states/slices/coordinatesSlice';

describe('coordinatesSlice', () => {
  const initialState = {
    latitude: null,
    longitude: null,
  };

  it('should return the initial state', () => {
    // Fix: Pass "@@INIT" instead of undefined for the initial state test
    const state = coordinatesReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('should handle setCoordinates action', () => {
    const state = coordinatesReducer(initialState, setCoordinates({ latitude: 13.7563, longitude: 100.5018 }));
    expect(state.latitude).toEqual(13.7563);
    expect(state.longitude).toEqual(100.5018);
  });

  it('should handle clearCoordinates action', () => {
    const modifiedState = { latitude: 13.7563, longitude: 100.5018 };
    const state = coordinatesReducer(modifiedState, clearCoordinates());
    expect(state.latitude).toBeNull();
    expect(state.longitude).toBeNull();
  });
});
