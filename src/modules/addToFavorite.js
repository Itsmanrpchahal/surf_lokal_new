import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  uploadImageAPI } from '../config/apiMethod';
export const addToFavorite = createAsyncThunk('addToFavorite', async (formData) => {
  try {
    const response = await uploadImageAPI(
      `https://www.surflokal.com/webapi/v1/favorites/addremovefavorite.php`,
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
const addToFavoriteSlice = createSlice({
  name: 'addToFavorite',
  initialState: {
    addToFavoriteData: [],
    status: null,
  },
  extraReducers: {
    [addToFavorite.pending]: (state, action) => {
      state.status = 'loading';
      state.addToFavoriteData = action.payload;

    },
    [addToFavorite.fulfilled]: (state, action) => {
      state.status = 'success';
      state.addToFavoriteData = action.payload;
    },
    [addToFavorite.rejected]: (state, action) => {
      state.status = 'failed';
      state.addToFavoriteData = action.payload;

    },
  },
});
export default addToFavoriteSlice.reducer;
