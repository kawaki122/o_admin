import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cities: [],
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCities: (state, action) => {
      state.cities = action.payload;
    },
    addCity: (state, action) => {
      state.cities.push(action.payload);
    },
    updateCity: (state, action) => {
      const index = state.cities.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.cities[index] = action.payload;
      }
    },
  },
});

export const { setCities, addCity, updateCity } = citySlice.actions;

export default citySlice.reducer;
