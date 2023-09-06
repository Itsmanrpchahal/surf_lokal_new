import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI, uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
export const editSearch = createAsyncThunk('editSearch',  async (formData) => {
  try {
    const access_token = await AsyncStorage.getItem('access_token');
    const header = Platform.OS === 'android' ?
      {
        security_key: "SurfLokal52",
        access_token: access_token,
        'Content-Type': 'multipart/form-data'
      } :
      {
        security_key: "SurfLokal52",
        access_token:access_token,
      };
    console.log("Header cd25ab6d7ee9f9daf09447f25ee48d60", formData)
    const response = await uploadImageAPI(
      `https://www.surflokal.com/webapi/v1/search/edit_search.php `,
      formData,
     
    ).then((res) => {
      console.log('edit search ====> ', res)
      return res;
    }).catch((e) => {
      console.log('edit search catch ===> ', e)
      return e
    })

    console.log('edit search response', response);

    return response;
  } catch (error) {
    console.error('edit search error', error);
    throw error; // Re-throw the error so that it's captured by the rejected action
  }
});

const editSearchSlice = createSlice({
  name: 'editSearch',
  initialState: {
    editSearchData: [],
    status: null,
  },
  extraReducers: {
    [editSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [editSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.editSearchData = action.payload;
    },
    [editSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default editSearchSlice.reducer;
