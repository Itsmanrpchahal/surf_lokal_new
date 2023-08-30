import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import {  uploadImageAPI } from '../config/apiMethod';
import { Platform } from 'react-native';

export const logOut = createAsyncThunk('logOut', async () => {
  try {
    const access_token = await AsyncStorage.getItem('access_token');
    const header = Platform.OS === 'android' ?
      {
        security_key: "SurfLokal52",
        access_token: access_token,
        'Content-Type': 'multipart/form-data'
      } :
      {
        security_key: "SurfLokal52",
        access_token: access_token,
      };
    const response = await uploadImageAPI(
      `https://www.surflokal.com/wp-json/custom-plugin/logout/`,
       header,
    ).then((res) => {
      console.log('logOut ====> ', res)
      return res;
    }).catch((e) => {
      console.log('logOut catch ===> ', e)
      return e
    })

    console.log('logOut response', response);

    return response;
  } catch (error) {
    console.error('logOut error', error);
    throw error; // Re-throw the error so that it's captured by the rejected action
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
