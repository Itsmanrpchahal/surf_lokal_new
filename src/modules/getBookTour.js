import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';

import BASEURl from '../services/Api'

export const getBookTour = createAsyncThunk('getBookTour', async (data) => {
 

 
  return await getAPI (
   BASEURl+`webapi/v1/push_notification/push.php?propid=${data.propid}&schedule_hour= ${data.schedule_hour} &schedule_day=${data.schedule_day}&user_mobile= '${data.user_mobile}'`
  )
    .then(async response => {
      const {data} = response;
      console.log('pushhhh',data)
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const getBookTourSlice = createSlice({
  name: 'getBookTour',
  initialState: {
    getBookTourData: [],
    status: null,
  },
  extraReducers: {
    [getBookTour.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getBookTour.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getBookTourData = action.payload;
    },
    [getBookTour.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getBookTourSlice.reducer;
