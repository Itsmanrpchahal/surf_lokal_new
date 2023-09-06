import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const getRating = createAsyncThunk('getRating', async (post_id) => {
  const access_token = await AsyncStorage.getItem('access_token')
  const Header={
    security_key:"SurfLokal52",
    access_token:access_token
  }
  return await getAPI(BASEURl+`webapi/v1/rating/user_rating.php?post_id=${post_id}`)
    .then(async response => {
      const {data} = response;
      // console.log(" getRating response data", response)
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
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
