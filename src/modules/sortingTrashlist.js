import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'

export const sortingTrashlist = createAsyncThunk('sortingTrashlist', async (post_id) => {

  return await getAPI(BASEURl+`webapi/v1/rating/user_rating.php?post_id=${post_id}`)
    .then(async response => {
      const {data} = response;
      // console.log(" sortingTrashlist response data", response)
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const sortingTrashlistSlice = createSlice({
  name: 'sortingTrashlist',
  initialState: {
    sortingTrashlistData: [],
    status: null,
  },
  extraReducers: {
    [sortingTrashlist.pending]: (state, action) => {
      state.status = 'loading';
    },
    [sortingTrashlist.fulfilled]: (state, action) => {
      state.status = 'success';
      state.sortingTrashlistData = action.payload;
    },
    [sortingTrashlist.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default sortingTrashlistSlice.reducer;
