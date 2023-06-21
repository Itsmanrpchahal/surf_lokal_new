import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import {url} from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const getNearBy = createAsyncThunk('getNearBy', async dispatch => {
  let data = {
    latitude: 26.4898,
    longitude: -80.174854,
  };

  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/nearby/',
    data,
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

const getNearBySlice = createSlice({
  name: 'getNearBy',
  initialState: {
    getNearByData: [],
    status: null,
  },
  extraReducers: {
    [getNearBy.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getNearBy.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getNearByData = action.payload;
    },
    [getNearBy.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getNearBySlice.reducer;
