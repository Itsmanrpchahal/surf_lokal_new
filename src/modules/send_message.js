import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';


export const sendMessage = createAsyncThunk('sendMessage', async dispatch => {
    const id = await AsyncStorage.getItem('userId')
    const formdata = new FormData()
    formdata.append('user_id',id)
    formdata.append('user2_id',id)
    formdata.append('propid',id)
    formdata.append('message',id)
    return await uploadImageAPI(
        BASEURl + 'webapi/v1/chat/send_message.php',
       formdata,
    )
        .then(async response => {
            const { data } = response;
            return data;
        })
        .catch(e => {
            if (e.response) {
            } else if (e.request) {
            } else {
            }
        });
});

const sendMessageSlice = createSlice({
    name: 'sendMessage',
    initialState: {
        sendMessageData: [],
        status: null,
    },
    extraReducers: {
        [sendMessage.pending]: (state, action) => {
            state.status = 'loading';
        },
        [sendMessage.fulfilled]: (state, action) => {
            state.status = 'success';
            state.likeDisLikeData = action.payload;
        },
        [sendMessage.rejected]: (state, action) => {
            state.status = 'failed';
        },
    },
});

export default sendMessageSlice.reducer;
