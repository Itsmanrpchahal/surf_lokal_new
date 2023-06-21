import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethod';
import { url } from '../config/url';

export const getCountry = createAsyncThunk('getCountry', async () => {
  return await getAPI(
    'https://countriesnow.space/api/v0.1/countries/info?returns=currency,flag,unicodeFlag,dialCode',
  )
    .then(async response => {
      const { data } = response;

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

const getCountrySlice = createSlice({
  name: 'getCountry',
  initialState: {
    getCountryData: [],
    status: null,
  },
  extraReducers: {
    [getCountry.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getCountry.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getCountryData = action.payload;
    },
    [getCountry.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getCountrySlice.reducer;
