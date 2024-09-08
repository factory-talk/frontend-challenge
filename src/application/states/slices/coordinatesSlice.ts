import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CoordinatesState {
  latitude: number | null;
  longitude: number | null;
}

const initialState: CoordinatesState = {
  latitude: null,
  longitude: null,
};

const coordinatesSlice = createSlice({
  name: 'coordinates',
  initialState,
  reducers: {
    setCoordinates(state, action: PayloadAction<{ latitude: number; longitude: number }>) {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    clearCoordinates(state) {
      state.latitude = null;
      state.longitude = null;
    },
  },
});

export const { setCoordinates, clearCoordinates } = coordinatesSlice.actions;
export default coordinatesSlice.reducer;
