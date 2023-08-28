import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  brands: [],
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    addBrand: (state, action) => {
      state.brands.push(action.payload);
    },
    updateBrand: (state, action) => {
      const index = state.brands.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.brands[index] = action.payload;
      }
    },

    setClients: (state, action) => {
      state.clients = action.payload;
    },
    addClient: (state, action) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action) => {
      const index = state.clients.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
  },
});

export const { setBrands, addBrand, updateBrand, setClients, addClient, updateClient } = brandSlice.actions;

export default brandSlice.reducer;
