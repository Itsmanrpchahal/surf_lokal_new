import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI, uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';
export const editSearch = createAsyncThunk('editSearch', async dispatch => {
  const access_token = await AsyncStorage.getItem('access_token')

  const Header={
    security_key:"SurfLokal52",
    access_token:access_token
  }

  return await postAPI(
    BASEURl+'webapi/v1/search/edit_search.php',
    dispatch,Header
  )
    .then(async response => {
      const {data} = response;
      console.log('sssss',data)
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const editSearchSlice = createSlice({
  name: 'editSearch',
  initialState: {
    editSearchData: [],
    status: null,
  },
  extraReducers: {
    [editSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [editSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.editSearchData = action.payload;
    },
    [editSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default editSearchSlice.reducer;
