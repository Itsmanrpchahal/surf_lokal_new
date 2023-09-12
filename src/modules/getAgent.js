import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'

export const getAgent = createAsyncThunk('getAgent', async () => {
  return await getAPI(
    BASEURl + 'webapi/v1/agent/' 
  )
    .then(async response => {
      const { data } = response;
      console.log('agent',data)
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const getAgentSlice = createSlice({
  name: 'getAgent',
  initialState: {
    getAgentData: [],
    status: null,
  },
  extraReducers: {
    [getAgent.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getAgent.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getAgentData = action.payload;
    },
    [getAgent.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getAgentSlice.reducer;
