import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locations: [],
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    addLocation: (state, action) => {
      state.locations.push(action.payload);
    },
    updateLocation: (state, action) => {
      const index = state.locations.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.locations[index] = action.payload;
      }
    },
  },
});

export const { setLocations, addLocation, updateLocation } = locationSlice.actions;

export default locationSlice.reducer;