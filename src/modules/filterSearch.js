import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  uploadImageAPI } from '../config/apiMethod';
export const filterSearch = createAsyncThunk('filterSearch', async (formData) => {
  try {
    const response = await uploadImageAPI(
      `https://www.surflokal.com/wp-json/search/FilterSearch`,
      formData,
      
    ).then((res) => {
      return res;
    }).catch((e) => {
      return e
    })

    return response;
  } catch (error) {
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
