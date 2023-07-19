import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import {url} from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const getSavedSearch = createAsyncThunk(
  'getSavedSearch',
  async dispatch => {
    const id = await AsyncStorage.getItem('userId');
    return await getAPI(
      'https://surf.topsearchrealty.com/webapi/v1/search/?userID=' + id,
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
  },
);

const getSavedSearchSlice = createSlice({
  name: 'getSavedSearch',
  initialState: {
    getSavedSearchData: [],
    status: null,
  },
  extraReducers: {
    [getSavedSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getSavedSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getSavedSearchData = action.payload;
    },
    [getSavedSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getSavedSearchSlice.reducer;
