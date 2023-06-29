import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import { url } from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const postRating = createAsyncThunk('postRating', async dispatch => {
  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/rating/',
    dispatch,
  )
    .then(async response => {
      const { data } = response;
      console.log('value', response);
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
