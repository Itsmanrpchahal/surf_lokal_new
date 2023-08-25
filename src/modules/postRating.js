import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { uploadImageAPI } from '../config/apiMethod';

export const postRating = createAsyncThunk('postRating', async (_, { dispatch, getState }) => {
  try {
    const access_token = await AsyncStorage.getItem('access_token');
    const header = {
      security_key: "SurfLokal52",
      access_token: access_token,
    };

    "access_token,postid,photo_quality_rating,desc_stars,price_stars,interest_stars,content,reviewtitle fields are required!"

    const formData = new FormData();
    formData.append('userID', 100);
    formData.append('postid', 1609047);
    formData.append('reviewtitle', 'hjvjbm');
    formData.append('photo_quality_rating', 4);
    formData.append('desc_stars', 2);
    formData.append('price_stars', 1);
    formData.append('interest_stars', 5);
    formData.append('content', 'hjvhjhjb');
    const response = await uploadImageAPI(
      'https://www.surflokal.com/webapi/v1/rating/',
      formData,
      header
    ).then((res)=>{
      console.log('Post Ratinmg ====> ',res)
    }).catch((e) => {
      console.log('Post rating catch ===> ',e)
    })

    const { data } = response;
    console.log('postRating response', response);

    return data;
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
    },
    [postRating.fulfilled]: (state, action) => {
      state.status = 'success';
      state.postRatingData = action.payload;
    },
    [postRating.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default postRatingSlice.reducer;
