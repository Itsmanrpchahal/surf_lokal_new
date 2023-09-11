import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  uploadImageAPI } from '../config/apiMethod';

export const filterSearch = createAsyncThunk('filterSearch', async (formData) => {
  try {
    const response = await uploadImageAPI(
      `http://www.surflokal.com/wp-json/search/FilterSearch`,
      formData,
      
    ).then((res) => {
      console.log('filterSearch====> ', res)
      return res;
    }).catch((e) => {
      console.log('filterSearch catch ===> ', e)
      return e
    })

    console.log('filterSearch response', response);

    return response;
  } catch (error) {
    console.error('filterSearch error', error);
    throw error; 
  }
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
      state.filterSearchData = action.payload;
    },
    [filterSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.filterSearchData = action.payload;
    },
    [filterSearch.rejected]: (state, action) => {
      state.status = 'failed';
      state.filterSearchData = action.payload;
    },
  },
});

export default filterSearchSlice.reducer;
