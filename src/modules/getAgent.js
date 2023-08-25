import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI, postAPI } from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
import BASEURl from '../services/Api'


export const getAgent = createAsyncThunk('getAgent', async () => {
  const access_token = await AsyncStorage.getItem('access_token')
  const Header={
    security_key:"SurfLokal52",
    access_token:access_token
  }

  return await getAPI(
    BASEURl + 'webapi/v1/agent/' ,Header
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
