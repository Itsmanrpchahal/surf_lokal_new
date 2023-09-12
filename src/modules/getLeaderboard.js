import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI, postAPI } from '../config/apiMethod';

import BASEURl from '../services/Api'


export const getLeaderboard = createAsyncThunk('getLeaderboard', async () => {

  return await getAPI(
    BASEURl + 'webapi/v1/rewards/leaderboard.php '
  )
    .then(async response => {
      const { data } = response;
      console.log('leaderbopard',data)
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const getLeaderboardSlice = createSlice({
  name: 'getLeaderboard',
  initialState: {
    getLeaderboardData: [],
    status: null,
  },
  extraReducers: {
    [getLeaderboard.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getLeaderboard.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getLeaderboardData = action.payload;
    },
    [getLeaderboard.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getLeaderboardSlice.reducer;
