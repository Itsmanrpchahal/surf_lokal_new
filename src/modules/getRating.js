import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import {url} from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const getRating = createAsyncThunk('getRating', async dispatch => {
  let data = {
    post_id: 882045,
  };

  return await uploadImageAPI(
    'https://surf.topsearchrealty.com/webapi/v1/rating/getrating.php',
    data,
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
});

const getRatingSlice = createSlice({
  name: 'getRating',
  initialState: {
    getRatingData: [],
    status: null,
  },
  extraReducers: {
    [getRating.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getRating.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getRatingData = action.payload;
    },
    [getRating.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getRatingSlice.reducer;
