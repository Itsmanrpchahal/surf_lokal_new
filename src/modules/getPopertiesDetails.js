import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethod';
import { url } from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const getPopertiesDetails = createAsyncThunk(
  'getPopertiesDetails',
  async (id) => {
    console.log("id",id);
    return await getAPI(
      "https://surf.topsearchrealty.com/webapi/v1/singleproperty/?Post_Id=" + id)
      .then(async response => {
        const { data } = response;
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

const getPopertiesDetailsSlice = createSlice({
  name: 'getPopertiesDetails',
  initialState: {
    getPopertiesDetailsData: [],
    status: null,
  },
  extraReducers: {
    [getPopertiesDetails.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getPopertiesDetails.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getPopertiesDetailsData = action.payload;
    },
    [getPopertiesDetails.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getPopertiesDetailsSlice.reducer;
