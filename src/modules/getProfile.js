import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI} from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';

export const getProfile = createAsyncThunk('getProfile', async () => {
  const id = await AsyncStorage.getItem('userId');

  return await postAPI(
    'https://surf.topsearchrealty.com/webapi/v1/userprofile?userID=' + id,
  )
    .then(async response => {
      const {data} = response;
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const getProfileSlice = createSlice({
  name: 'getProfile',
  initialState: {
    getProfileData: [],
    status: null,
  },
  extraReducers: {
    [getProfile.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getProfile.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getProfileData = action.payload;
    },
    [getProfile.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getProfileSlice.reducer;
