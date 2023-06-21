import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import {url} from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const editSearch = createAsyncThunk('editSearch', async dispatch => {
  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/search/edit_search.php',
    dispatch,
  )
    .then(async response => {
      const {data} = response;
      console.log('value', response);
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

const editSearchSlice = createSlice({
  name: 'editSearch',
  initialState: {
    editSearchData: [],
    status: null,
  },
  extraReducers: {
    [editSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [editSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.editSearchData = action.payload;
    },
    [editSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default editSearchSlice.reducer;
