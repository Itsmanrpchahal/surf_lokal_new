import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postAPI } from "../config/apiMethod";
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';


export const chat = createAsyncThunk("chat", async (payload) => {
    const id = await AsyncStorage.getItem('userId');

    const urlDynamic =
    BASEURl+"wp-json/chatbot/chatgpt?user_id="+id;
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

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chatData: {},
        status: null,
    },
    extraReducers: {
        [chat.pending]: (state, action) => {
            state.status = "loading";
        },
        [chat.fulfilled]: (state, action) => {
            state.status = "success";
            state.contactData = action.payload;
        },
        [chat.rejected]: (state, action) => {
            state.status = "failed";
        },
    },
});

export default chatSlice.reducer;