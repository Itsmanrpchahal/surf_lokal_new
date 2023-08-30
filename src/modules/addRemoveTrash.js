import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import { postAPI, uploadImageAPI } from '../config/apiMethod';
import { Platform } from 'react-native';

export const addRemoveTrash = createAsyncThunk('addRemoveTrash', async (formData) => {
  try {
    const access_token = await AsyncStorage.getItem('access_token');
    const header = Platform.OS === 'android' ?
      {
        security_key: "SurfLokal52",
        access_token:access_token,
        'Content-Type': 'multipart/form-data'
      } :
      {
        security_key: "SurfLokal52",
        access_token: access_token,
      };
    const response = await uploadImageAPI(
      `https://www.surflokal.com/webapi/v1/trashlist/addremovetrash.php`,
      formData,
      header,
    ).then((res) => {
      console.log('Post Ratinmg ====> ', res)
      return res;
    }).catch((e) => {
      console.log('Post rating catch ===> ', e)
      return e
    })

    console.log('addRemoveTrash response', response);

    return response;
  } catch (error) {
    console.error('addRemoveTrash error', error);
    throw error; // Re-throw the error so that it's captured by the rejected action
  }
});

const addRemoveTrashSlice = createSlice({
  name: 'addRemoveTrash',
  initialState: {
    addRemoveTrashData: [],
    status: null,
  },
  extraReducers: {
    [addRemoveTrash.pending]: (state, action) => {
      state.status = 'loading';
      state.addRemoveTrashData = action.payload;

    },
    [addRemoveTrash.fulfilled]: (state, action) => {
      state.status = 'success';
      state.addRemoveTrashData = action.payload;
    },
    [addRemoveTrash.rejected]: (state, action) => {
      state.status = 'failed';
      state.addRemoveTrashData = action.payload;

    },
  },
});

export default addRemoveTrashSlice.reducer;
