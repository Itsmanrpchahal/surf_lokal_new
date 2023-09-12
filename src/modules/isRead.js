import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';

export const isRead = createAsyncThunk('isRead', async dispatch => {
    const formData = new FormData()
    formData.append('chatId', dispatch.ID)

 try {
        const response = await uploadImageAPI(
          `https://www.surflokal.com/webapi/v1/chat/Isread.php`,
          formData,
         
        ).then((res) => {
          return res;
        }).catch((e) => {
          return e
        })
      
        return response;
      } catch (error) {
        throw error; 
      }
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
