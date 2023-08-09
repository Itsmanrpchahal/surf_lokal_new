import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postAPI } from "../config/apiMethod";
import AsyncStorage from '@react-native-community/async-storage';

import BASEURl from '../services/Api'


export const bookChat = createAsyncThunk("bookChat", async (payload) => {
    const id = await AsyncStorage.getItem('userId');
    const urlDynamic =
    "https://www.surflokal.com/wp-json/chatbot/chatgpt?user_id="+id;
    try {
        const response = await postAPI(urlDynamic, payload);
        const { data } = response;
        return data;
    } catch (error) {
        if (error.response) {
        } else if (error.request) {
        } else {
        }
        throw error;
    }
});

const bookChatSlice = createSlice({
    name: "bookChat",
    initialState: {
        bookChatData: {},
        status: null,
    },
    extraReducers: {
        [bookChat.pending]: (state, action) => {
            state.status = "loading";
        },
        [bookChat.fulfilled]: (state, action) => {
            state.status = "success";
            state.contactData = action.payload;
        },
        [bookChat.rejected]: (state, action) => {
            state.status = "failed";
        },
    },
});

export default bookChatSlice.reducer;