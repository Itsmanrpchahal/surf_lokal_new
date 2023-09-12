import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'



export const propertyChatList = createAsyncThunk('propertyChatList', async dispatch => {
   
    return await uploadImageAPI(
        BASEURl + 'webapi/v1/chat/chatpropertylisting.php',
  
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

const propertyChatListSlice = createSlice({
    name: 'propertyChatList',
    initialState: {
        propertyChatListData: [],
        status: null,
    },
    extraReducers: {
        [propertyChatList.pending]: (state, action) => {
            state.status = 'loading';
        },
        [propertyChatList.fulfilled]: (state, action) => {
            state.status = 'success';
            state.likeDisLikeData = action.payload;
        },
        [propertyChatList.rejected]: (state, action) => {
            state.status = 'failed';
        },
    },
});

export default propertyChatListSlice.reducer;
