import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import {url} from '../config/url';

export const getFilter = createAsyncThunk('getFilter', async () => {
  return await getAPI('https://surf.topsearchrealty.com/webapi/v1/GetFilter')
    .then(async response => {
      const {data} = response;

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

const getFilterSlice = createSlice({
  name: 'getFilter',
  initialState: {
    getFilterData: [],
    status: null,
  },
  extraReducers: {
    [getFilter.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getFilter.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getFilterData = action.payload;
    },
    [getFilter.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getFilterSlice.reducer;
