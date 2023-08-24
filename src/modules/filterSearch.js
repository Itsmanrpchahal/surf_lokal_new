import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postAPI, uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-community/async-storage';

export const filterSearch = createAsyncThunk('filterSearch', async dispatch => {
  const access_token = await AsyncStorage.getItem('access_token')

  const Header={
    security_key:"SurfLokal52",
    access_token:access_token
  }
  console.log('hhhhh',Header)
  return await postAPI(
    BASEURl+'wp-json/search/FilterSearch',dispatch , Header
  )
    .then(async response => {
      const { data } = response;
      console.log("filrterr",data)
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const filterSearchSlice = createSlice({
  name: 'filterSearch',
  initialState: {
    filterSearchData: [],
    status: null,
  },
  extraReducers: {
    [filterSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [filterSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.filterSearchData = action.payload;
    },
    [filterSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default filterSearchSlice.reducer;
