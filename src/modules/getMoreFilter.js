import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'

export const getMoreFilter = createAsyncThunk('getMoreFilter', async () => {

  return await getAPI(BASEURl+'webapi/v1/SubFilter/')
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
const getMoreFilterSlice = createSlice({
  name: 'getMoreFilter',
  initialState: {
    getMoreFilterData: [],
    status: null,
  },
  extraReducers: {
    [getMoreFilter.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getMoreFilter.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getMoreFilterData = action.payload;
    },
    [getMoreFilter.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getMoreFilterSlice.reducer;
