import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
export const getNotifications = createAsyncThunk('getNotifications', async () => {
  return await getAPI( BASEURl + 'webapi/v1/notifications')
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

const getNotificationsSlice = createSlice({
  name: 'getNotifications',
  initialState: {
    getNotificationsData: [],
    status: null,
  },
  extraReducers: {
    [getNotifications.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getNotifications.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getNotificationsData = action.payload;
    },
    [getNotifications.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getNotificationsSlice.reducer;
