import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
import BASEURl from '../services/Api'

export const clearFilter = createAsyncThunk('clearFilter', async () => {
  const access_token = await AsyncStorage.getItem('access_token')
  const Header={
    security_key:"SurfLokal52",
    access_token:access_token
  }
  
  return await getAPI( BASEURl + 'webapi/v1/AppFilter/clearfilter.php')
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

const clearFilterSlice = createSlice({
  name: 'clearFilter',
  initialState: {
    clearFilterData: [],
    status: null,
  },
  extraReducers: {
    [clearFilter.pending]: (state, action) => {
      state.status = 'loading';
    },
    [clearFilter.fulfilled]: (state, action) => {
      state.status = 'success';
      state.clearFilterData = action.payload;
    },
    [clearFilter.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default clearFilterSlice.reducer;
