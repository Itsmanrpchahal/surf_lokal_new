import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import {  uploadImageAPI } from '../config/apiMethod';
import { Platform } from 'react-native';

export const sendMessage = createAsyncThunk('sendMessage', async dispatch=> {
  try {
    const response = await uploadImageAPI(
      `https://www.surflokal.com/webapi/v1/chat/send_message.php`,
      dispatch,
   
    ).then((res) => {
      return res;
    }).catch((e) => {
      console.log('sendMessage catch ===> ', e)
      return e
    })

    console.log('sendMessage response', response);

    return response;
  } catch (error) {
    console.error('sendMessage error', error);
    throw error; // Re-throw the error so that it's captured by the rejected action
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
