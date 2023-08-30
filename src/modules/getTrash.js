import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI, postAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-community/async-storage';


export const getTrash = createAsyncThunk('getTrash', async () => {
  // const id = await AsyncStorage.getItem('userId');
  const access_token = await AsyncStorage.getItem('access_token')

  const Header={
    security_key:"SurfLokal52",
    access_token:access_token
  }
console.log("getTrash access_token",access_token)
  return await getAPI(
    BASEURl+'webapi/v1/trashlist',Header
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

const getTrashSlice = createSlice({
  name: 'getTrash',
  initialState: {
    getTrashData: [],
    status: null,
  },
  extraReducers: {
    [getTrash.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getTrash.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getTrashData = action.payload;
    },
    [getTrash.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getTrashSlice.reducer;
