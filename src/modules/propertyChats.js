import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useIsFocused, useRoute } from "@react-navigation/native";


export const propertyChatList = createAsyncThunk('propertyChatList', async dispatch => {
    const id = await AsyncStorage.getItem('userId')
    const formdata = new FormData()
    formdata.append('user_id', id)
    return await uploadImageAPI(
        BASEURl + 'webapi/v1/chat/chatpropertylisting.php',
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
