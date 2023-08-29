import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

const Header = {
  security_key: "SurfLokal52"
}
export const loginUser = createAsyncThunk('loginUser', async dispatch => {
  return await uploadImageAPI(
    BASEURl + 'wp-json/custom-plugin/login/',
    dispatch, Header
  )
    .then(async response => {
      const { data } = response;

      if (data.data.status) {
        const ids = data.data.ID;
        await AsyncStorage.setItem('userId', ids);
        await AsyncStorage.setItem('userDetails', JSON.stringify(data.data));
        await AsyncStorage.setItem(
          'imageUri',
          JSON.stringify(data.metadata.custom_picture),
        );
        return data;
      } else {
        return data;
      }
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const loginUserSlice = createSlice({
  name: 'login',
  initialState: {
    loginData: [],
    status: null,
    isLoading: false, 
  },
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      state.status = 'loading';
      state.isLoading = true; 
    },
    [loginUser.fulfilled]: (state, action) => {
      state.status = 'success';
      state.loginData = action.payload;
      state.isLoading = false
    },
    [loginUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.isLoading = false;
    },
  },
});

export default loginUserSlice.reducer;