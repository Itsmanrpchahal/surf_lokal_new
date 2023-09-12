import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'

export const getFilter = createAsyncThunk('getFilter', async () => {
  return await getAPI(BASEURl+'webapi/v1/GetFilter')
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
