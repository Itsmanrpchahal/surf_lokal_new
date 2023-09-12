import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { uploadImageAPI} from '../config/apiMethod';

export const editSearch = createAsyncThunk('editSearch',  async (formData) => {
  try {
    const response = await uploadImageAPI(
      `https://www.surflokal.com/webapi/v1/search/edit_search.php `,
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
const editSearchSlice = createSlice({
  name: 'editSearch',
  initialState: {
    editSearchData: [],
    status: null,
  },
  extraReducers: {
    [editSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [editSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.editSearchData = action.payload;
    },
    [editSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});
export default editSearchSlice.reducer;
