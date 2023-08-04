import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
import BASEURl from '../services/Api'

export const getBookTour = createAsyncThunk('getBookTour', async (data) => {
  console.log("datadata",data)
  const id = await AsyncStorage.getItem('userId');
 
  return await getAPI (
   BASEURl+`webapi/v1/push_notification/push.php?user_id=${data.user_id}&propid=${data.propid}&schedule_hour= ${data.schedule_hour} &schedule_day=${data.schedule_day}&user_mobile= '${data.user_mobile}'`
  )
    .then(async response => {
      const {data} = response;
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
