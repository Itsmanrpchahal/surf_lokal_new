import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { postAPI, uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'


export const postRating = createAsyncThunk('postRating', async formData => {
  try {
    const access_token = await AsyncStorage.getItem('access_token');
    const header = {
      security_key: "SurfLokal52",
      access_token: access_token,
    };
   return await postAPI(
    BASEURl + 'webapi/v1/rating/',
      formData,
      header
    ).then((res)=>{
      console.log('Post Ratinmg ====> ',res)
    return res;

    }).catch((e) => {
      console.log('Post rating catch ===> ',e)
    })
  } catch (error) {
      console.log('Post rating Error==> ',error)
  }
});

const postRatingSlice = createSlice({
  name: 'postRating',
  initialState: {
    postRatingData: [],
    status: 'loading',
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
