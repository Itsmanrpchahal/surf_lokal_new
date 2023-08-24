import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI, postAPI} from '../config/apiMethod';
// import AsyncStorage from '@react-native-community/async-storage';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const getProfile = createAsyncThunk('getProfile', async () => {
  
  const access_token = await AsyncStorage.getItem('access_token')

  const Header={
    security_key:"SurfLokal52",
    access_token:access_token
  }
  return await getAPI(
    BASEURl+'webapi/v1/userprofile/',Header
  )
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
