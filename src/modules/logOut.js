import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  uploadImageAPI } from '../config/apiMethod';

export const logOut = createAsyncThunk('logOut', async () => {
  try {
    const response = await uploadImageAPI( `https://www.surflokal.com/wp-json/custom-plugin/logout/`)
    .then((res) => {
      return res;
    }).catch((e) => {
      return e
    })
    return response;
  } catch (error) {
    throw error; 
  }
});

const logOutSlice = createSlice({
  name: 'logOut',
  initialState: {
    logOutData: [],
    status: null,
  },
  extraReducers: {
    [logOut.pending]: (state, action) => {
      state.status = 'loading';
      state.logOutData = action.payload;

    },
    [logOut.fulfilled]: (state, action) => {
      state.status = 'success';
      state.logOutData = action.payload;
    },
    [logOut.rejected]: (state, action) => {
      state.status = 'failed';
      state.logOutData = action.payload;

    },
  },
});

export default logOutSlice.reducer;
