import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
// import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';
const BASEURL = "https://www.surflokal.com/"

export const verifyOTP = createAsyncThunk('verifyOTP', async dispatch => {
    
 
  return await uploadImageAPI(
    BASEURL + 'webapi/v1/login/verify_otp.php',
    dispatch,
  )
    .then(async response => {
      const { data } = response;
      if (data.status) {
        
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

const verifyOTPSlice = createSlice({
  name: 'verifyOTP',
  initialState: {
    verifyOTPData: {},
    status: null,
  },
  extraReducers: {
    [verifyOTP.pending]: (state, action) => {
      state.status = 'loading';
    },
    [verifyOTP.fulfilled]: (state, action) => {
      state.status = 'success';
      state.loginData = action.payload;
    },
    [verifyOTP.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default verifyOTPSlice.reducer;
