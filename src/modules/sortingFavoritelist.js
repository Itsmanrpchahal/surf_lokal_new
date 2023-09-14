import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'

export const sortingFavoritelist = createAsyncThunk('sortingFavoritelist', async payload => {
  return payload.date_favorited 
  ? await getAPI(BASEURl + `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&date_favorited=${payload.date_favorited}`)
      .then(async response => {
        const { data } = response;
        return data;
      })
      .catch(e => {
      })
    : payload.days_on_market
      ? await getAPI(BASEURl +  `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&days_on_market=${payload.days_on_market}`)
      .then(async response => {
        const { data } = response;
        return data;
      })
      .catch(e => {
      })
      : payload.price_low_to_high 
       ? await getAPI(BASEURl + `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&price_low_to_high=${payload.price_low_to_high}`)
        .then(async response => {
          const { data } = response;
          return data;
        })
        .catch(e => {
        })
        : payload.price_high_to_low 
        ? await getAPI(BASEURl + `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&price_high_to_low=${payload.price_high_to_low}`)
         .then(async response => {
           const { data } = response;
           return data;
         })
         .catch(e => {
         })
         : payload.beds_high_to_low 
         ? await getAPI(BASEURl + `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&beds_high_to_low=${payload.beds_high_to_low}`)
          .then(async response => {
            const { data } = response;
            return data;
          })
          .catch(e => {
          })
          : payload.baths_high_to_low 
         ? await getAPI(BASEURl + `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&baths_high_to_low=${payload.baths_high_to_low}`)
          .then(async response => {
            const { data } = response;
            return data;
          })
          .catch(e => {
          })
          : payload.squraefeet_high_to_low 
         ? await getAPI(BASEURl + `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&squraefeet_high_to_low=${payload.squraefeet_high_to_low}`)
          .then(async response => {
            const { data } = response;
            return data;
          })
          .catch(e => {
          })
    :""
});

const sortingFavoritelistSlice = createSlice({
  name: 'sortingFavoritelist',
  initialState: {
    sortingFavoritelistData: [],
  },
  extraReducers: {
    [sortingFavoritelist.pending]: (state, action) => {
      state.satus;
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