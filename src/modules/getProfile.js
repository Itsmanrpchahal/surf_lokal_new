import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
export const getProfile = createAsyncThunk('getProfile', async () => {
  return await getAPI( BASEURl+'webapi/v1/userprofile/')
    .then(async response => {
      const {data} = response;
      console.log('uploadprofile',data)
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
