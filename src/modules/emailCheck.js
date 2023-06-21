import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import {url} from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const emailCheck = createAsyncThunk('emailCheck', async dispatch => {
  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/emailcheck/',
    dispatch,
  )
    .then(async response => {
      const {data} = response;
      console.log('value', response);
      return data;
    })
    .catch(e => {
      console.log(e);
      if (e.response) {
        console.log('api issue', e.response);
      } else if (e.request) {
        console.log('api issue', e.response);
      } else {
        console.log('api issue', e.response);
      }
    });
});

const emailCheckSlice = createSlice({
  name: 'emailCheck',
  initialState: {
    emailCheckData: [],
    status: null,
  },
  extraReducers: {
    [emailCheck.pending]: (state, action) => {
      state.status = 'loading';
    },
    [emailCheck.fulfilled]: (state, action) => {
      state.status = 'success';
      state.emailCheckData = action.payload;
    },
    [emailCheck.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default emailCheckSlice.reducer;
