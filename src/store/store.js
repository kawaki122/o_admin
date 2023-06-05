import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./slices/citySlice";
import brandSlice from "./slices/brandSlice";

const store = configureStore({
  reducer: {
    city: cityReducer,
    brand: brandSlice,
  },
});

export default store;