import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { url } from "../config/url";
import { postAPI } from "../config/apiMethod";

export const makeOffer = createAsyncThunk("makeOffer", async (payload) => {
  const urlDynamic =
    "https://surf.topsearchrealty.com/webapi/v1/makeoffer/";
  try {
    const response = await postAPI(urlDynamic, payload);
    console.log(response, "res");
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.log("API issue", error.response);
    } else if (error.request) {
      console.log("API issue", error.request);
    } else {
      console.log("API issue", error.message);
    }
    throw error;
  }
});

const makeOfferSlice = createSlice({
  name: "makeOffer",
  initialState: {
    makeOffer: [],
    status: null,
  },
  extraReducers: {
    [makeOffer.pending]: (state, action) => {
      state.status = "loading";
    },
    [makeOffer.fulfilled]: (state, action) => {
      state.status = "success";
      state.addActivityTaskData = action.payload;
    },
    [makeOffer.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default makeOfferSlice.reducer;