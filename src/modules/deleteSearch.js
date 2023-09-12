import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { uploadImageAPI} from '../config/apiMethod';
export const deleteSearch = createAsyncThunk('deleteSearch',async (formData) => {
try {
  const response = await uploadImageAPI(
    `https://www.surflokal.com/webapi/v1/search/delete_searchlist.php `,
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

const deleteSearchSlice = createSlice({
  name: 'deleteSearch',
  initialState: {
    deleteSearchData: [],
    status: null,
  },
  extraReducers: {
    [deleteSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [deleteSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.deleteSearchData = action.payload;
    },
    [deleteSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});
export default deleteSearchSlice.reducer;
