import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import { postAPI } from '../config/apiMethod';

export const postRating = createAsyncThunk('postRating', async (formData) => {
  try {
    const access_token = await AsyncStorage.getItem('access_token');
    const header = {
      security_key: "SurfLokal52",
      access_token: access_token,
    };
    console.log("Header cd25ab6d7ee9f9daf09447f25ee48d60",header.access_token, formData)
    const response = await postAPI(
      `https://www.surflokal.com/webapi/v1/rating/`,
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
