import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI} from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
import BASEURl from '../services/Api'

export const getBookTour = createAsyncThunk('getBookTour', async () => {
  const id = await AsyncStorage.getItem('userId');

  return await postAPI(
    BASEURl+'webapi/v1/userprofile?userID=' + id,
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

const getBookTourSlice = createSlice({
  name: 'getBookTour',
  initialState: {
    getBookTourData: [],
    status: null,
  },
  extraReducers: {
    [getBookTour.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getBookTour.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getBookTourData = action.payload;
    },
    [getBookTour.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getBookTourSlice.reducer;
