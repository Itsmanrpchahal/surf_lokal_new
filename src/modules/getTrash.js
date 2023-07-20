import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI} from '../config/apiMethod';
import {url} from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const getTrash = createAsyncThunk('getTrash', async () => {
  const id = await AsyncStorage.getItem('userId');
  return await postAPI(
    'https://surf.topsearchrealty.com/webapi/v1/trashlist?userID=' + id,
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
