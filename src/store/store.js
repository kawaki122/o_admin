import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./slices/citySlice";
import brandSlice from "./slices/brandSlice";
import campaignSlice from "./slices/campaignSlice";
import locationSlice from "./slices/locationSlice";
import riderSlice from "./slices/riderSlice";
import taskSlice from "./slices/taskSlice";

const store = configureStore({
  reducer: {
    city: cityReducer,
    brand: brandSlice,
    campaign: campaignSlice,
    location: locationSlice,
    rider: riderSlice,
    task: taskSlice,
  },
});

export default store;