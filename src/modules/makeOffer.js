import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI, uploadImageAPI} from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';

export const makeOffer = createAsyncThunk('makeOffer', async dispatch => {
  const id = await AsyncStorage.getItem('userId');
  return await postAPI(
    'https://surf.topsearchrealty.com/webapi/v1/makeoffer/?userID='+ id,
    dispatch,
  )
    .then(async response => {
      const {data} = response;
      if (data.status) {
        return data;
      } else {
        return data;
      }
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
  
});

const makeOfferSlice = createSlice({
  name: 'makeOffer',
  initialState: {
    makeOfferData: [],
    status: null,
  },
  extraReducers: {
    [makeOffer.pending]: (state, action) => {
      state.status = 'loading';
    },
    [makeOffer.fulfilled]: (state, action) => {
      state.status = 'success';
      state.makeOfferData = action.payload;
    },
    [makeOffer.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default makeOfferSlice.reducer;
