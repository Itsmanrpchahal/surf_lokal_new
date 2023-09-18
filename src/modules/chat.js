import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'

export const chat = createAsyncThunk('chat', async payload => {
  return await uploadImageAPI(
    BASEURl+'wp-json/chatbot/chatgpt',
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

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatData: [],
    status: null,
  },
  extraReducers: {
    [chat.pending]: (state, action) => {
      state.status = 'loading';
    },
    [chat.fulfilled]: (state, action) => {
      state.status = 'success';
      state.chatData = action.payload;
    },
    [chat.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default chatSlice.reducer;
