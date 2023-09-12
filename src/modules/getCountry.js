import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethod';
export const getCountry = createAsyncThunk('getCountry', async () => {
  return await getAPI(
    'https://countriesnow.space/api/v0.1/countries/info?returns=currency,flag,unicodeFlag,dialCode',
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
