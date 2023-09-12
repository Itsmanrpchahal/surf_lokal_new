import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  uploadImageAPI } from '../config/apiMethod';
export const addRemoveTrash = createAsyncThunk('addRemoveTrash', async (formData) => {
  try {
    const response = await uploadImageAPI(
      `https://www.surflokal.com/webapi/v1/trashlist/addremovetrash.php`,
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

const addRemoveTrashSlice = createSlice({
  name: 'addRemoveTrash',
  initialState: {
    addRemoveTrashData: [],
    status: null,
  },
  extraReducers: {
    [addRemoveTrash.pending]: (state, action) => {
      state.status = 'loading';
      state.addRemoveTrashData = action.payload;

    },
    [addRemoveTrash.fulfilled]: (state, action) => {
      state.status = 'success';
      state.addRemoveTrashData = action.payload;
    },
    [addRemoveTrash.rejected]: (state, action) => {
      state.status = 'failed';
      state.addRemoveTrashData = action.payload;

    },
  },
});

export default addRemoveTrashSlice.reducer;
