import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const getChatDetail = createAsyncThunk('getChatDetail', async dispatch => {
    const id = await AsyncStorage.getItem('userId')
    const formData = new FormData()
    formData.append('user_id', id)
    formData.append('propid', dispatch.ID)
    return await uploadImageAPI(
        BASEURl + 'webapi/v1/chat/chatByproperty.php',
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
