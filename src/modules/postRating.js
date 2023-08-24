import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const postRating = createAsyncThunk('postRating', async (_, { dispatch }) => {
  try {
    const access_token = await AsyncStorage.getItem('access_token');
    const Header = {
      security_key: "SurfLokal52",
      access_token: access_token
    };
    console.log("postRating access_token", access_token);

    const response = await postAPI(BASEURl + 'webapi/v1/rating/',dispatch, Header);
    const { data } = response;
    console.log("postRating response", response);

    return data;
  } catch (error) {
    console.error("postRating error", error);
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
