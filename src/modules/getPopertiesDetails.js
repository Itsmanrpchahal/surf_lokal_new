import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI } from "../config/apiMethod";
import BASEURl from '../services/Api'
export const getPopertiesDetails = createAsyncThunk( "getPropertiesDetails",  async (postid) => {
    const urlDynamic =
      BASEURl+"webapi/v1/singleproperty/?post_id=" + postid;
    return await getAPI(urlDynamic)
      .then(async (response) => {
        const { data } = response;
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

const getPopertiesDetailsSlice = createSlice({
  name: "getPopertiesDetails",
  initialState: {
    getPopertiesDetails: [],
    status: null,
  },
  extraReducers: {
    [getPopertiesDetails.pending]: (state, action) => {
      state.status = "loading";
    },
    [getPopertiesDetails.fulfilled]: (state, action) => {
      state.status = "success";
      state.getPopertiesDetails = action.payload;
    },
    [getPopertiesDetails.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default getPopertiesDetailsSlice.reducer;