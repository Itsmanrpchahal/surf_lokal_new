import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import { url } from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const makeOffer = createAsyncThunk('makeOffer', async dispatch => {
  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/makeoffer/',
    dispatch,
  )
    .then(async response => {
      const { data } = response;
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

const makeOfferSlice = createSlice({
  name: 'makeOffer',
  initialState: {
    makeOfferData: [],
    status: null,
  },
  extraReducers: {
    [makeOffer.pending]: (state, action) => {
      state.status = 'loading';
    },
    [makeOffer.fulfilled]: (state, action) => {
      state.status = 'success';
      state.makeOfferData = action.payload;
    },
    [makeOffer.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default makeOfferSlice.reducer;
