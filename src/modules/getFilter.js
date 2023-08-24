import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const getFilter = createAsyncThunk('getFilter', async () => {
  const access_token = await AsyncStorage.getItem('access_token')

  const Header={
    security_key:"SurfLokal52",
    access_token:access_token
  }
  return await getAPI(BASEURl+'webapi/v1/GetFilter',Header)
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

const getFilterSlice = createSlice({
  name: 'getFilter',
  initialState: {
    getFilterData: [],
    status: null,
  },
  extraReducers: {
    [getFilter.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getFilter.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getFilterData = action.payload;
    },
    [getFilter.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getFilterSlice.reducer;
