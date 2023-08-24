import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI, uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'


export const addToFavorite = createAsyncThunk(
  'addToFavorite',
  async dispatch => {

  
    return await postAPI(
      BASEURl+'webapi/v1/favorites/addremovefavorite.php',
      dispatch,Header
    )
      .then(async response => {
        const {data} = response;
        console.log("favvv",data)
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
