import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { url } from "../config/url";
import { postAPI } from "../config/apiMethod";

export const chat = createAsyncThunk("chat", async (payload) => {
  const urlDynamic =
    "https://surf.topsearchrealty.com/wp-json/chatbot/chatgpt";
  try {
    const response = await postAPI(urlDynamic, payload);
    console.log(response, "chat res");
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

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatData: {},
    status: null,
  },
  extraReducers: {
    [chat.pending]: (state, action) => {
      state.status = "loading";
    },
    [chat.fulfilled]: (state, action) => {
      state.status = "success";
      state.contactData = action.payload;
    },
    [chat.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default chatSlice.reducer;
