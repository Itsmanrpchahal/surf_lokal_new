import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  uploadImageAPI } from '../config/apiMethod';

export const sendMessage = createAsyncThunk('sendMessage', async dispatch=> {
  try {
    const response = await uploadImageAPI(
      `https://www.surflokal.com/webapi/v1/chat/send_message.php`,
      dispatch,
   
    ).then((res) => {
      return res;
    }).catch((e) => {
      return e
    })


    return response;
  } catch (error) {
    throw error; 
  }
});

const sendMessageSlice = createSlice({
  name: 'sendMessage',
  initialState: {
    sendMessageData: [],
    status: null,
  },
  extraReducers: {
    [sendMessage.pending]: (state, action) => {
      state.status = 'loading';
      state.sendMessageData = action.payload;

    },
    [sendMessage.fulfilled]: (state, action) => {
      state.status = 'success';
      state.sendMessageData = action.payload;
    },
    [sendMessage.rejected]: (state, action) => {
      state.status = 'failed';
      state.sendMessageData = action.payload;

    },
  },
});

export default sendMessageSlice.reducer;
