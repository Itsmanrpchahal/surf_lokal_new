import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI} from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';

export const getAgent = createAsyncThunk('getAgent', async () => {
  const id = await AsyncStorage.getItem('userId');

  return await postAPI(
    'https://surf.topsearchrealty.com/webapi/v1/agent/?userID='+ id,
  )
    .then(async response => {
      const {data} = response;
      return data;
    })
    .catch(e => {
      console.log(e);
      if (e.response) {
        console.log('api issue', e.response);
      } else if (e.request) {
        console.log('api issue', e.response);
      } else {
        console.log('api issue', e.response);
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
