import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const getNearBy = createAsyncThunk('getNearBy', async dispatch => {
  let data = {
    latitude: 26.4898,
    longitude: -80.174854,
  };

  return await uploadImageAPI(
    BASEURl+'webapi/v1/nearby/',
    data,
  )
    .then(async response => {
      const {data} = response;
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
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
