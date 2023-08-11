import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
import BASEURl from '../services/Api'

export const clearFilter = createAsyncThunk('clearFilter', async () => {
  const id = await AsyncStorage.getItem('userId');
  console.log("AsyncStorage Id response",id)
  
  return await getAPI( BASEURl + 'webapi/v1/AppFilter/clearfilter.php?Userid=' + id,)
    .then(async response => {
      const { data } = response;
       console.log("clearFilter response",response)
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
