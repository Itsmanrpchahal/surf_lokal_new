import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import {url} from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const forgotPassword = createAsyncThunk(
  'forgotPassword',
  async dispatch => {
    return await uploadImageAPI(
      'https://surf.topsearchrealty.com/webapi/v1/password/reset_pass.php',
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
  },
);

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState: {
    forgotPasswordData: [],
    status: null,
  },
  extraReducers: {
    [forgotPassword.pending]: (state, action) => {
      state.status = 'loading';
    },
    [forgotPassword.fulfilled]: (state, action) => {
      state.status = 'success';
      state.forgotPasswordData = action.payload;
    },
    [forgotPassword.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default forgotPasswordSlice.reducer;
