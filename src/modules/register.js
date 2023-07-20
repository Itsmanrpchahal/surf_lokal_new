import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import { url } from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const register = createAsyncThunk('register', async dispatch => {
  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/register/',
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

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    registerData: [],
    status: null,
  },
  extraReducers: {
    [register.pending]: (state, action) => {
      state.status = 'loading';
    },
    [register.fulfilled]: (state, action) => {
      state.status = 'success';
      state.registerData = action.payload;
    },
    [register.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default registerSlice.reducer;
