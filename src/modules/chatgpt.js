import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postAPI, uploadImageAPI } from "../config/apiMethod";
import { useDispatch } from "react-redux";
import { create } from "react-test-renderer";



export const chatGpt = createAsyncThunk('chatGpt', async (payload) => {
    const urlDynamic =
      "https://surf.topsearchrealty.com/webapi/v1/chatgpt/";
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
const chatGptReducer = createSlice({
    name: 'chatGptReducer',
    initialState: {
        chatGpt: [],
        status: null,
    },
    extraReducers: {
        [chatGpt.pending]: (state, action) => {
            state.status = 'loading';
        },
        [chatGpt.fulfilled]: (state, action) => {
            state.status = 'success';
            state.postRatingData = action.payload;
        },
        [chatGpt.rejected]: (state, action) => {
            state.status = 'failed';
        },
    },
});
export default chatGptReducer.reducer