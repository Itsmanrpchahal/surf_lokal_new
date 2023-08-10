import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const isRead = createAsyncThunk('isRead', async dispatch => {
    const id = await AsyncStorage.getItem('userId')
    const formData = new FormData()
    formData.append('user_id', id)
    formData.append('chatId', dispatch.ID)
    return await uploadImageAPI(
        BASEURl + 'webapi/v1/chat/Isread.php',
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

const isReadSlice = createSlice({
    name: 'isRead',
    initialState: {
        isReadData: [],
        status: null,
    },
    extraReducers: {
        [isRead.pending]: (state, action) => {
            state.status = 'loading';
        },
        [isRead.fulfilled]: (state, action) => {
            state.status = 'success';
            state.isReadData = action.payload;
        },
        [isRead.rejected]: (state, action) => {
            state.status = 'failed';
        },
    },
});

export default isReadSlice.reducer;
