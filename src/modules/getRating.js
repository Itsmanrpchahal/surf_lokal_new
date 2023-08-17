import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI } from "../config/apiMethod";
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';



export const getRating = createAsyncThunk(
  "getRating",
  async (post_id) => {
    const userId = await AsyncStorage.getItem('userId')

    const urlDynamic =
      BASEURl + 'webapi/v1/rating/user_rating.php?userID=${userId}&post_id=' + post_id;
    return await getAPI(urlDynamic)
      .then(async (response) => {
        const { data } = response;
        console.log("getRating getRating",  userId, post_id,response)
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

const getRatingSlice = createSlice({
  name: "getRating",
  initialState: {
    getRating: [],
    status: null,
  },
  extraReducers: {
    [getRating.pending]: (state, action) => {
      state.status = "loading";
    },
    [getRating.fulfilled]: (state, action) => {
      state.status = "success";
      state.getRating = action.payload;
    },
    [getRating.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default getRatingSlice.reducer;