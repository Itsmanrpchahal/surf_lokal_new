import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI, postAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-community/async-storage';

export const getFavoriteProperties = createAsyncThunk(
  'getFavoriteProperties',
  async () => {
    const access_token = await AsyncStorage.getItem('access_token')

    const Header={
      security_key:"SurfLokal52",
      access_token:access_token
    }
    return await getAPI(
      BASEURl+'webapi/v1/favorites',Header
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
