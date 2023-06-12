import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  riders: [],
};

const riderSlice = createSlice({
  name: "rider",
  initialState,
  reducers: {
    setRiders: (state, action) => {
      state.riders = action.payload;
    },
    addRider: (state, action) => {
      state.riders.push(action.payload);
    },
    updateRider: (state, action) => {
      const index = state.riders.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.riders[index] = action.payload;
      }
    },
  },
});

export const { setRiders, addRider, updateRider } = riderSlice.actions;

export default riderSlice.reducer;
