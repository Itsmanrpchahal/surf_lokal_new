import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';

export const deleteSearch = createAsyncThunk('deleteSearch', async dispatch => {
  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/search/delete_searchlist.php',
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

const deleteSearchSlice = createSlice({
  name: 'deleteSearch',
  initialState: {
    deleteSearchData: [],
    status: null,
  },
  extraReducers: {
    [deleteSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [deleteSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.deleteSearchData = action.payload;
    },
    [deleteSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default deleteSearchSlice.reducer;
