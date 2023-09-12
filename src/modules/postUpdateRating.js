import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'

export const postUpdateRating = createAsyncThunk('postUpdateRating', async dispatch => {
  


  return await uploadImageAPI(
    BASEURl + 'webapi/v1/rating/update_rating.php',
    dispatch,

  )
    .then(async response => {
      console.log("dispatch ==> ", response)
      return response;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
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
      state.postUpdateRatingData = action.payload;
    },
    [postUpdateRating.fulfilled]: (state, action) => {
      state.status = 'success';
      state.postUpdateRatingData = action.payload;
    },
    [postUpdateRating.rejected]: (state, action) => {
      state.status = 'failed';
      state.postUpdateRatingData = action.payload;
    },
  },
});

export default postUpdateRatingSlice.reducer;
