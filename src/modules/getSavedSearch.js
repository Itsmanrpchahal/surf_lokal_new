import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
export const getSavedSearch = createAsyncThunk( 'getSavedSearch',async dispatch => {
    return await getAPI(BASEURl + 'webapi/v1/search/' )
      .then(async response => {
        const { data } = response;
         console.log("getSavedSearch response",response)
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
