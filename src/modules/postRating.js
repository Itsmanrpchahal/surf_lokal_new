import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  uploadImageAPI } from '../config/apiMethod';

export const postRating = createAsyncThunk('postRating', async (formData) => {
  try {
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
    throw error;
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
