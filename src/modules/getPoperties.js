import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethod';
import { url } from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const getPoperties = createAsyncThunk('getPoperties', async () => {
  return await getAPI('https://surf.topsearchrealty.com/webapi/v1/property')
    .then(async response => {
      console.log("HOme response", response)
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

const getPopertiesSlice = createSlice({
  name: 'getPoperties',
  initialState: {
    getPopertiesData: [],
    status: null,
  },
  extraReducers: {
    [getPoperties.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getPoperties.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getPopertiesData = action.payload;
    },
    [getPoperties.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getPopertiesSlice.reducer;
