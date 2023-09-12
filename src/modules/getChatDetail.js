import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  uploadImageAPI } from '../config/apiMethod';

export const getChatDetail = createAsyncThunk('getChatDetail', async (dispatch) => {
  const formData = new FormData()
  formData.append(' propid', dispatch.ID)
  try {
    const response = await uploadImageAPI(
      `https://www.surflokal.com/webapi/v1/chat/chatByproperty.php`,
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

const getChatDetailSlice = createSlice({
  name: 'getChatDetail',
  initialState: {
    getChatDetailData: [],
    status: null,
  },
  extraReducers: {
    [getChatDetail.pending]: (state, action) => {
      state.status = 'loading';
      state.getChatDetailData = action.payload;

    },
    [getChatDetail.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getChatDetailData = action.payload;
    },
    [getChatDetail.rejected]: (state, action) => {
      state.status = 'failed';
      state.getChatDetailData = action.payload;

    },
  },
});

export default getChatDetailSlice.reducer;
