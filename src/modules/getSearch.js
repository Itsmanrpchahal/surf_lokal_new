import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const getSearch = createAsyncThunk('getSearch', async dispatch => {
  const id = await AsyncStorage.getItem('userId');
  let data = {
    userID: id,
    SearchParameters: dispatch,
  };
  return await uploadImageAPI(
    BASEURl+'webapi/v1/search/insert_search.php',
    data,
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

const getSearchSlice = createSlice({
  name: 'getSearch',
  initialState: {
    getSearchData: [],
    status: null,
  },
  extraReducers: {
    [getSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getSearchData = action.payload;
    },
    [getSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getSearchSlice.reducer;
