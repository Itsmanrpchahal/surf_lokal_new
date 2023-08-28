import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'

export const getNearBy = createAsyncThunk('getNearBy', async (payload) => {


  return await uploadImageAPI(
    BASEURl+'webapi/v1/nearby/',
    payload,
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
