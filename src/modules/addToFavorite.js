import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import { postAPI, uploadImageAPI } from '../config/apiMethod';
import { Platform } from 'react-native';

export const addToFavorite = createAsyncThunk('addToFavorite', async (formData) => {
  try {
    const access_token = await AsyncStorage.getItem('access_token');
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
    console.log("Header cd25ab6d7ee9f9daf09447f25ee48d60", formData)
    const response = await uploadImageAPI(
      `https://www.surflokal.com/webapi/v1/favorites/addremovefavorite.php`,
      formData,
      header,
    ).then((res) => {
      console.log('Post Ratinmg ====> ', res)
      return res;
    }).catch((e) => {
      console.log('Post rating catch ===> ', e)
      return e
    })

    console.log('addToFavorite response', response);

    return response;
  } catch (error) {
    console.error('addToFavorite error', error);
    throw error; // Re-throw the error so that it's captured by the rejected action
  }
});

const addToFavoriteSlice = createSlice({
  name: 'addToFavorite',
  initialState: {
    addToFavoriteData: [],
    status: null,
  },
  extraReducers: {
    [addToFavorite.pending]: (state, action) => {
      state.status = 'loading';
      state.addToFavoriteData = action.payload;

    },
    [addToFavorite.fulfilled]: (state, action) => {
      state.status = 'success';
      state.addToFavoriteData = action.payload;
    },
    [addToFavorite.rejected]: (state, action) => {
      state.status = 'failed';
      state.addToFavoriteData = action.payload;

    },
  },
});

export default addToFavoriteSlice.reducer;
