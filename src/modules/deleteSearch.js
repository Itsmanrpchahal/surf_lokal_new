import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import BASEURl from '../services/Api'
import {uploadImageAPI} from '../config/apiMethod';

export const deleteSearch = createAsyncThunk('deleteSearch', async dispatch => {
  return await uploadImageAPI(
    BASEURl+'webapi/v1/search/delete_searchlist.php',
    dispatch,
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
