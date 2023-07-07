import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';

export const addToFavorite = createAsyncThunk(
  'addToFavorite',
  async dispatch => {
    return await uploadImageAPI(
      'https://surf.topsearchrealty.com/webapi/v1/favorites/addremovefavorite.php',
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
  },
);

const addToFavoriteSlice = createSlice({
  name: 'addToFavorite',
  initialState: {
    addToFavoriteData: [],
    status: null,
  },
  extraReducers: {
    [addToFavorite.pending]: (state, action) => {
      state.status = 'loading';
    },
    [addToFavorite.fulfilled]: (state, action) => {
      state.status = 'success';
      state.addToFavoriteData = action.payload;
    },
    [addToFavorite.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default addToFavoriteSlice.reducer;
