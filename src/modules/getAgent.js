import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postAPI } from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
import BASEURl from '../services/Api'


export const getAgent = createAsyncThunk('getAgent', async () => {
  const id = await AsyncStorage.getItem('userId');

  return await postAPI(
    BASEURl + 'webapi/v1/agent/?userID=' + id,
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
