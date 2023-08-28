import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI } from "../config/apiMethod";
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';


export const getRewardListing = createAsyncThunk(
  "getRewardListings",
  async () => {
    const access_token = await AsyncStorage.getItem('access_token')
    const Header={
      security_key:"SurfLokal52",
      access_token:access_token
    }
  
    const urlDynamic =
      BASEURl + "webapi/v1/rewards/reward_listing.php " ;
    return await getAPI(urlDynamic,Header)
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