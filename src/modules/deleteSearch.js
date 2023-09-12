import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import BASEURl from '../services/Api'
import {postAPI, uploadImageAPI} from '../config/apiMethod';
;
 

export const deleteSearch = createAsyncThunk('deleteSearch',async (formData) => {
try {
  
  const response = await uploadImageAPI(
    `https://www.surflokal.com/webapi/v1/search/delete_searchlist.php `,
    formData,
  
  ).then((res) => {
    console.log('Post Ratinmg ====> ', res)
    return res;
  }).catch((e) => {
    console.log('Post rating catch ===> ', e)
    return e
  })

  console.log(' response', response);

  return response;
} catch (error) {
  console.error('addRemoveTrash error', error);
  throw error; // Re-throw the error so that it's captured by the rejected action
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
