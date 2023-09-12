import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
export const getFavoriteProperties = createAsyncThunk('getFavoriteProperties', async () => {
  return await getAPI(
    BASEURl+'webapi/v1/favorites/ '
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
