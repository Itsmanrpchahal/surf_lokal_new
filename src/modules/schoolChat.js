import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'

export const schoolChat = createAsyncThunk('schoolChat', async payload => {
  return await uploadImageAPI(
    BASEURl+'wp-json/chatbot/SchoolChatBot',
    payload,
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

const schoolChatSlice = createSlice({
  name: 'schoolChat',
  initialState: {
    schoolChatData: [],
    status: null,
  },
  extraReducers: {
    [schoolChat.pending]: (state, action) => {
      state.status = 'loading';
    },
    [schoolChat.fulfilled]: (state, action) => {
      state.status = 'success';
      state.schoolChatData = action.payload;
    },
    [schoolChat.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default schoolChatSlice.reducer;
