import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';

export const chatGpt = createAsyncThunk('chatGpt', async payload => {
  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/chatgpt/',
    payload,
  )
    .then(async response => {
      const { data } = response;
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const chatGptSlice = createSlice({
  name: 'chatGpt',
  initialState: {
    chatGptData: [],
    status: null,
  },
  extraReducers: {
    [chatGpt.pending]: (state, action) => {
      state.status = 'loading';
    },
    [chatGpt.fulfilled]: (state, action) => {
      state.status = 'success';
      state.chatGptData = action.payload;
    },
    [chatGpt.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default chatGptSlice.reducer;
