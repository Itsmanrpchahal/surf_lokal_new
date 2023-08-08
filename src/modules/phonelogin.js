import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postAPI } from '../config/apiMethod';
// import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';
const BASEURL = "https://www.surflokal.com/"
export const loginPhoneUser = createAsyncThunk('loginPhoneUser', async dispatch => {

  return await postAPI(
    BASEURL + 'webapi/v1/login/send_otp.php',
    dispatch,
  )
    .then(async response => {
      const { data } = response;
        console.log('loginrespo',data)
      if (data.success) {
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

const loginPhoneUserSlice = createSlice({
  name: 'loginPhone',
  initialState: {
    loginPhoneUserData: {},
    status: null,
  },
  extraReducers: {
    [loginPhoneUser.pending]: (state, action) => {
      state.status = 'loading';
    },
    [loginPhoneUser.fulfilled]: (state, action) => {
      state.status = 'success';
      state.loginData = action.payload;
    },
    [loginPhoneUser.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default loginPhoneUserSlice.reducer;
