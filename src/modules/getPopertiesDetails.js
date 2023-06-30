import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI } from "../config/apiMethod";
import { url } from "../config/url";

export const getPopertiesDetails = createAsyncThunk(
  "getPropertiesDetails",
  async (postid) => {
    console.log(postid, "getPropertiesDetails postid");
    const urlDynamic =
      "https://surf.topsearchrealty.com/webapi/v1/singleproperty/?Post_Id=" + postid;
    return await getAPI(urlDynamic)
      .then(async (response) => {
        const { data } = response;
        return data;
      })
      .catch((e) => {
        console.log(e);
        if (e.response) {
          console.log("api issue", e.response);
        } else if (e.request) {
          console.log("api issue", e.response);
        } else {
          console.log("api issue", e.response);
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