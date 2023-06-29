import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';

export const postUpdateRating = createAsyncThunk('postUpdateRating', async dispatch => {
  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/rating/update_rating.php',
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

const postUpdateRatingSlice = createSlice({
  name: 'postUpdateRating',
  initialState: {
    postUpdateRatingData: [],
    status: null,
  },
  extraReducers: {
    [postUpdateRating.pending]: (state, action) => {
      state.status = 'loading';
    },
    [postUpdateRating.fulfilled]: (state, action) => {
      state.status = 'success';
      state.postUpdateRatingData = action.payload;
    },
    [postUpdateRating.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default postUpdateRatingSlice.reducer;
