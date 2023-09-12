import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'


export const makeOffer = createAsyncThunk('makeOffer', async dispatch => {
  return await uploadImageAPI(
    BASEURl+'webapi/v1/makeoffer/',
    dispatch,
  )
    .then(async response => {
      const { data } = response;
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
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
