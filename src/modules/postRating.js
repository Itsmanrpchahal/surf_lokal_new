import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import {  uploadImageAPI } from '../config/apiMethod';
import { Platform } from 'react-native';

export const postRating = createAsyncThunk('postRating', async (formData) => {
  try {
    const accesToken = await AsyncStorage.getItem('access_token');
    const header = Platform.OS === 'android' ?
      {
        security_key: "SurfLokal52",
        access_token: accesToken,
        'Content-Type': 'multipart/form-data'
      } :
      {
        security_key: "SurfLokal52",
        access_token: accesToken,
      };
    const response = await uploadImageAPI(
      `https://www.surflokal.com/webapi/v1/rating/`,
      formData,
      
    ).then((res) => {
      console.log('Post Ratinmg ====> ', res)
      return res;
    }).catch((e) => {
      console.log('Post rating catch ===> ', e)
      return e
    })

    console.log('postRating response', response);

    return response;
  } catch (error) {
    console.error('postRating error', error);
    throw error; // Re-throw the error so that it's captured by the rejected action
  }
});

const postRatingSlice = createSlice({
  name: 'postRating',
  initialState: {
    postRatingData: [],
    status: null,
  },
  extraReducers: {
    [postRating.pending]: (state, action) => {
      state.status = 'loading';
      state.postRatingData = action.payload;

    },
    [postRating.fulfilled]: (state, action) => {
      state.status = 'success';
      state.postRatingData = action.payload;
    },
    [postRating.rejected]: (state, action) => {
      state.status = 'failed';
      state.postRatingData = action.payload;

    },
  },
});

export default postRatingSlice.reducer;
