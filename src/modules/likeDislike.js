import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'

export const likeDisLike = createAsyncThunk('likeDisLike', async dispatch => {
  return await uploadImageAPI(
    BASEURl+'webapi/v1/rewards/like_dislike_challenge.php',
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

const likeDisLikeSlice = createSlice({
  name: 'likeDisLike',
  initialState: {
    likeDisLikeData: [],
    status: null,
  },
  extraReducers: {
    [likeDisLike.pending]: (state, action) => {
      state.status = 'loading';
    },
    [likeDisLike.fulfilled]: (state, action) => {
      state.status = 'success';
      state.likeDisLikeData = action.payload;
    },
    [likeDisLike.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default likeDisLikeSlice.reducer;
