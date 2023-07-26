import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const loginUser = createAsyncThunk('loginUser', async dispatch => {
 
  return await postAPI(
    BASEURl + 'wp-json/custom-plugin/login/',
    dispatch,
  )
    .then(async response => {
      const {data} = response;
      if (data.status) {
        const ids = data.data.ID;
        await AsyncStorage.setItem('userId', ids);
        await AsyncStorage.setItem('userDetails', JSON.stringify(data.data));
        await AsyncStorage.setItem(
          'imageUri',
          JSON.stringify(data.metadata.custom_picture),
        );
        return data;
      } else {
        return data;
      }
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const loginUserSlice = createSlice({
  name: 'login',
  initialState: {
    loginData: [],
    status: null,
  },
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      state.status = 'loading';
    },
    [loginUser.fulfilled]: (state, action) => {
      state.status = 'success';
      state.loginData = action.payload;
    },
    [loginUser.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default loginUserSlice.reducer;
