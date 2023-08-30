import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';


export const getChatDetail = createAsyncThunk('getChatDetail', async dispatch => {
   
    const formData = new FormData()
    formData.append('propid', dispatch.ID)
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
        console.log("Header cd25ab6d7ee9f9daf09447f25ee48d60", formData)
        const response = await uploadImageAPI(
          `https://www.surflokal.com/webapi/v1/chat/chatByproperty.php `,
          formData,
          header,
        ).then((res) => {
          console.log('getChatDetail ====> ', res)
          return res;
        }).catch((e) => {
          console.log('getChatDetail catch ===> ', e)
          return e
        })
      
        console.log(' getChatDetail', response);
      
        return response;
      } catch (error) {
        console.error('getChatDetail', error);
        throw error; // Re-throw the error so that it's captured by the rejected action
      }
      });
      

const getChatDetailSlice = createSlice({
    name: 'getChatDetail',
    initialState: {
        getChatDetailData: [],
        status: null,
    },
    extraReducers: {
        [getChatDetail.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getChatDetail.fulfilled]: (state, action) => {
            state.status = 'success';
            state.isReadData = action.payload;
        },
        [getChatDetail.rejected]: (state, action) => {
            state.status = 'failed';
        },
    },
});

export default getChatDetailSlice.reducer;
