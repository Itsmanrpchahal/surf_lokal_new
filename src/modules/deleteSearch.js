import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import BASEURl from '../services/Api'
import {postAPI, uploadImageAPI} from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
 

export const deleteSearch = createAsyncThunk('deleteSearch',
 async (dispatch)  => {
  const access_token = await AsyncStorage.getItem('access_token')

  const Header={
    security_key:"SurfLokal52",
    access_token:access_token
  }
  console.log('header',dispatch)
  return await postAPI(
    BASEURl+'webapi/v1/search/delete_searchlist.php',dispatch
    ,Header
  )
    .then(async response => {
      const {data} = response;
      console.log('delete',data)
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const deleteSearchSlice = createSlice({
  name: 'deleteSearch',
  initialState: {
    deleteSearchData: [],
    status: null,
  },
  extraReducers: {
    [deleteSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [deleteSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.deleteSearchData = action.payload;
    },
    [deleteSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default deleteSearchSlice.reducer;
