import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI} from '../config/apiMethod';
import {url} from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const loginUser = createAsyncThunk('loginUser', async dispatch => {
  console.log(
    'value check',
    'https://surf.topsearchrealty.com/' + 'wp-json/custom-plugin/login/',
    dispatch,
  );
  return await postAPI(
    'https://surf.topsearchrealty.com/' + 'wp-json/custom-plugin/login/',
    dispatch,
  )
    .then(async response => {
      const {data} = response;
      if (data.status) {
        console.log('------...', data);
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
