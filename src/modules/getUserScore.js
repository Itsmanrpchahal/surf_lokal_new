import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI, postAPI } from '../config/apiMethod';

import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';


export const getUserScore = createAsyncThunk('getUserScore', async () => {

  const access_token = await AsyncStorage.getItem('access_token')

  const Header={
    security_key:"SurfLokal52",
    access_token:access_token
  }
  return await getAPI(
    BASEURl + 'webapi/v1/rewards/user_leaderboard.php',
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