import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import { store } from '../redux/store';
import { AccessToken } from 'react-native-fbsdk';
export const sendMessage = createAsyncThunk('sendMessage', async dispatch => {

    const formData = new FormData()
   
    formData.append('user2_id', dispatch.user2_id)
    formData.append('propid', dispatch.propid)
    formData.append('message', dispatch.message)


     try {
        const access_token = await AsyncStorage.getItem('access_token');
        const header = Platform.OS === 'android' ?
          {
            security_key: "SurfLokal52",
            access_token:access_token,
            'Content-Type': 'multipart/form-data'
          } :
          {
            security_key: "SurfLokal52",
            access_token:access_token,
          };
        console.log("Header cd25ab6d7ee9f9daf09447f25ee48d60",header)
        const response = await uploadImageAPI(
          `https://www.surflokal.com/webapi/v1/chat/send_message.php`,
          formData,
          header,
        ).then((res) => {
          console.log('sendMessage ====> ', res)
          return res;
        }).catch((e) => {
          console.log('sendMessage catch ===> ', e)
          return e
        })
      
        console.log(' sendMessage', response);
      
        return response;
      } catch (error) {
        console.error('sendMessage', error);
        throw error; // Re-throw the error so that it's captured by the rejected action
      }
      });

const sendMessageSlice = createSlice({
    name: 'sendMessage',
    initialState: {
        sendMessageData: {},
        status: null,
    },
    extraReducers: {
        [sendMessage.pending]: (state, action) => {
            state.status = 'loading';
        },
        [sendMessage.fulfilled]: (state, action) => {
            state.status = 'success';
            state.isReadData = action.payload;
        },
        [sendMessage.rejected]: (state, action) => {
            state.status = 'failed';
        },
    },
});

export default sendMessageSlice.reducer;
