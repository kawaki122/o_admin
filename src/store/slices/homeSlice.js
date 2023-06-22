import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  initializing: true,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.initializing = false;
    },
  },
});

export const { setCurrentUser } = homeSlice.actions;

export default homeSlice.reducer;
