import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI } from "../config/apiMethod";
import BASEURl from '../services/Api'



export const getRewardListing = createAsyncThunk(
  "getRewardListings",
  async () => {
    const urlDynamic =
      BASEURl + "webapi/v1/rewards/reward_listing.php " ;
    return await getAPI(urlDynamic)
      .then(async (response) => {
        const { data } = response;
  console.log('hkkkk',data)
        return data;
      })
      .catch((e) => {
        if (e.response) {
        } else if (e.request) {
        } else {
        }
      });
  }
);

const getRewardListingSlice = createSlice({
  name: "getRewardListing",
  initialState: {
    getRewardListing: [],
    status: null,
  },
  extraReducers: {
    [getRewardListing.pending]: (state, action) => {
      state.status = "loading";
    },
    [getRewardListing.fulfilled]: (state, action) => {
      state.status = "success";
      state.getRewardListing = action.payload;
    },
    [getRewardListing.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default getRewardListingSlice.reducer;