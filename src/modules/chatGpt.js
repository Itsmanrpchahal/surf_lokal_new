import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';

export const chatGpt = createAsyncThunk('chatGpt', async payload => {
  console.log("ddd", payload)
  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/chatgpt/',
    payload,
  )
    .then(async response => {
      const { data } = response;
      console.log('value res', response.data.data[0].answere);
      return data;
    })
    .catch(e => {
      console.log(e);
      if (e.response) {
        console.log('api issue', e.response);
      } else if (e.request) {
        console.log('api issue', e.response);
      } else {
        console.log('api issue', e.response);
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
