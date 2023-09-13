import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'

export const sortingFavoritelist = createAsyncThunk('sortingFavoritelist', async (payload) => {
   console.log(payload)
  return await getAPI(
    BASEURl+`webapi/v1/favorites/favoriteSorting.php?sort_by=${payload?.sort_by}&date_favorited=${payload?.date_favorited}&price_low_to_high=${payload?.price_low_to_high}&price_high_to_low=${payload?.price_high_to_low}&beds_high_to_low=${payload?.beds_high_to_low}&baths_high_to_low=${payload?.baths_high_to_low}&squraefeet_high_to_low=${payload?.squraefeet_high_to_low}`)
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
