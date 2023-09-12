import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'

export const getUserScore = createAsyncThunk('getUserScore', async () => {
  return await getAPI( BASEURl + 'webapi/v1/rewards/user_leaderboard.php',)
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

const getUserScoreSlice = createSlice({
  name: 'getUserScore',
  initialState: {
    getUserScoreData: [],
    status: null,
  },
  extraReducers: {
    [getUserScore.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getUserScore.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getUserScoreData = action.payload;
    },
    [getUserScore.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getUserScoreSlice.reducer;