import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    addCampaign: (state, action) => {
      state.campaigns.push(action.payload);
    },
    updateCampaign: (state, action) => {
      const index = state.campaigns.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.campaigns[index] = action.payload;
      }
    },
  },
});

export const { setCampaigns, addCampaign, updateCampaign } = campaignSlice.actions;

export default campaignSlice.reducer;
