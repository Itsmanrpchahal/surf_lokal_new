import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'

export const sortingFavoritelist = createAsyncThunk('sortingFavoritelist', async (payload) => {
 
  return await getAPI(BASEURl+`webapi/v1/rating/user_rating.php?post_id=${payload}`)
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

const sortingFavoritelistSlice = createSlice({
  name: 'sortingFavoritelist',
  initialState: {
    sortingFavoritelistData: [],
    status: null,
  },
  extraReducers: {
    [sortingFavoritelist.pending]: (state, action) => {
      state.status = 'loading';
    },
    [sortingFavoritelist.fulfilled]: (state, action) => {
      state.status = 'success';
      state.sortingFavoritelistData = action.payload;
    },
    [sortingFavoritelist.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default sortingFavoritelistSlice.reducer;
