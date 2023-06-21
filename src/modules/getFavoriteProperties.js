import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI} from '../config/apiMethod';
import {url} from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const getFavoriteProperties = createAsyncThunk(
  'getFavoriteProperties',
  async () => {
    const id = await AsyncStorage.getItem('userId');
    return await postAPI(
      'https://surf.topsearchrealty.com/webapi/v1/favorites?userID=' + id,
    )
      .then(async response => {
        const {data} = response;
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

const getFavoritePropertiesSlice = createSlice({
  name: 'getFavoriteProperties',
  initialState: {
    getFavoritePropertiesData: [],
    status: null,
  },
  extraReducers: {
    [getFavoriteProperties.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getFavoriteProperties.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getFavoritePropertiesData = action.payload;
    },
    [getFavoriteProperties.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getFavoritePropertiesSlice.reducer;
