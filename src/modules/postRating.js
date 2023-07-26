import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const postRating = createAsyncThunk('postRating', async dispatch => {
  return await uploadImageAPI(
    BASEURl+'webapi/v1/rating/',
    dispatch,
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
