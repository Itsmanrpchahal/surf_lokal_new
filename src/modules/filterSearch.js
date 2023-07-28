import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'

export const filterSearch = createAsyncThunk('filterSearch', async dispatch => {
  return await uploadImageAPI(
    BASEURl+'wp-json/search/FilterSearch',
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

const filterSearchSlice = createSlice({
  name: 'filterSearch',
  initialState: {
    filterSearchData: [],
    status: null,
  },
  extraReducers: {
    [filterSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [filterSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.filterSearchData = action.payload;
    },
    [filterSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default filterSearchSlice.reducer;
