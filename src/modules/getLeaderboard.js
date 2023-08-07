import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI, postAPI } from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
import BASEURl from '../services/Api'


export const getLeaderboard = createAsyncThunk('getLeaderboard', async () => {
  const id = await AsyncStorage.getItem('userId');

  return await getAPI(
    BASEURl + 'webapi/v1/rewards/user_leaderboard.php?user_id=' + id,
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
