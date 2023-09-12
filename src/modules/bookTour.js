import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'


export const bookTour = createAsyncThunk('bookTour', async dispatch => {
  return await uploadImageAPI(
    BASEURl+'webapi/v1/rating/',
    dispatch,
  )
    .then(async response => {
      const { data } = response;
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const bookTourSlice = createSlice({
  name: 'bookTour',
  initialState: {
    bookTourData: [],
    status: null,
  },
  extraReducers: {
    [bookTour.pending]: (state, action) => {
      state.status = 'loading';
    },
    [bookTour.fulfilled]: (state, action) => {
      state.status = 'success';
      state.bookTourData = action.payload;
    },
    [bookTour.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default bookTourSlice.reducer;
