import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI } from "../config/apiMethod";
import { url } from "../config/url";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../utils/utils";

export const getVedioCallToken = createAsyncThunk(
  "getTodayDipos",
  async (id) => {
    const urlDynamic =
      `https://www.surflokal.com/webapi/v1/twilio/generate_token.php?userid=${id.userID}&friendid=${id.friend}`

    return await getAPI(urlDynamic)
      .then(async (response) => {
        const { data } = response;
        console.log('videoResp', data)
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

const getVedioCallTokenSlice = createSlice({
  name: "getVedioCallToken",
  initialState: {
    getVedioCallTokenData: {},
    status: null,
  },
  extraReducers: {
    [getVedioCallToken.pending]: (state, action) => {
      state.status = "loading";
    },
    [getVedioCallToken.fulfilled]: (state, action) => {
      state.status = "success";
      state.getTodayDiposData = action.payload;
    },
    [getVedioCallToken.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default getVedioCallTokenSlice.reducer;
