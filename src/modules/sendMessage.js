import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const sendMessage = createAsyncThunk('sendMessage', async dispatch => {

    const formData = new FormData()
    formData.append('user_id', dispatch.user_id)
    formData.append('user2_id', dispatch.user2_id)
    formData.append('propid', dispatch.propid)
    formData.append('message', dispatch.message)
    return await uploadImageAPI(
        BASEURl + 'webapi/v1/chat/send_message.php',
        formData,
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
