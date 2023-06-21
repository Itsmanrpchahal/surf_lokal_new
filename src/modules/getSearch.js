import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import {url} from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const getSearch = createAsyncThunk('getSearch', async dispatch => {
  const id = await AsyncStorage.getItem('userId');
  let data = {
    userID: id,
    SearchParameters: dispatch,
  };
  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/search/insert_search.php',
    data,
  )
    .then(async response => {
      const {data} = response;
      return data;
    })
    .catch(e => {
      console.log(e);
      if (e.response) {
        console.log('api issue', e.response);
      } else if (e.request) {
        console.log('api issue', e.response);
      } else {
        console.log('api issue', e.response);
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
