import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';

export const addRemoveTrash = createAsyncThunk('addRemoveTrash', async dispatch => {
  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/trashlist/addremovetrash.php',
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

const addRemoveTrashSlice = createSlice({
  name: 'addRemoveTrash',
  initialState: {
    addRemoveTrashData: [],
    status: null,
  },
  extraReducers: {
    [addRemoveTrash.pending]: (state, action) => {
      state.status = 'loading';
    },
    [addRemoveTrash.fulfilled]: (state, action) => {
      state.status = 'success';
      state.addRemoveTrashData = action.payload;
    },
    [addRemoveTrash.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default addRemoveTrashSlice.reducer;
