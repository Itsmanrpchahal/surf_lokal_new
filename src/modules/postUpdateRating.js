import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'

export const postUpdateRating = createAsyncThunk('postUpdateRating', async dispatch => {
  const header = Platform.OS === 'android' ?
    {
      security_key: "SurfLokal52",
      access_token: '1f925480b75052134e842fc4f0970407',
      'Content-Type': 'multipart/form-data'
    } :
    {
      security_key: "SurfLokal52",
      access_token: '1f925480b75052134e842fc4f0970407',
    };
  return await uploadImageAPI(
    BASEURl + 'webapi/v1/rating/update_rating.php',
    dispatch,
    header,
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
