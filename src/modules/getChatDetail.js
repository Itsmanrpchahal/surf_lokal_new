import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import {  uploadImageAPI } from '../config/apiMethod';
import { Platform } from 'react-native';

export const getChatDetail = createAsyncThunk('getChatDetail', async (dispatch) => {
  const formData = new FormData()
  formData.append(' propid', dispatch.ID)
  try {
    const accesToken = await AsyncStorage.getItem('access_token');
    const header = Platform.OS === 'android' ?
      {
        security_key: "SurfLokal52",
        access_token: accesToken,
        'Content-Type': 'multipart/form-data'
      } :
      {
        security_key: "SurfLokal52",
        access_token: accesToken,
      };
      console.log(formData,accesToken)

    const response = await uploadImageAPI(
      `https://www.surflokal.com/webapi/v1/chat/chatByproperty.php`,
      formData,
 
    ).then((res) => {
      console.log('getChatDetail res ====> ', res)
      return res;
    }).catch((e) => {
      console.log('getChatDetail catch ===> ', e)
      return e
    })

    console.log('getChatDetaildata', response);

    return response;
  } catch (error) {
    console.error('getChatDetail error', error);
    throw error; // Re-throw the error so that it's captured by the rejected action
  }
});

const getChatDetailSlice = createSlice({
  name: 'getChatDetail',
  initialState: {
    getChatDetailData: [],
    status: null,
  },
  extraReducers: {
    [getChatDetail.pending]: (state, action) => {
      state.status = 'loading';
      state.getChatDetailData = action.payload;

    },
    [getChatDetail.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getChatDetailData = action.payload;
    },
    [getChatDetail.rejected]: (state, action) => {
      state.status = 'failed';
      state.getChatDetailData = action.payload;

    },
  },
});

export default getChatDetailSlice.reducer;
