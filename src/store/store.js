import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./slices/citySlice";
import brandSlice from "./slices/brandSlice";
import campaignSlice from "./slices/campaignSlice";

const store = configureStore({
  reducer: {
    city: cityReducer,
    brand: brandSlice,
    campaign: campaignSlice
  },
});

export default store;