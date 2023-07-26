import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI, uploadImageAPI } from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
import BASEURl from '../services/Api'

export const getPoperties = createAsyncThunk('getPoperties', async type => {
  const id = await AsyncStorage.getItem('userId')
  return type.type === 0
    ? await getAPI(BASEURl + 'webapi/v1/property?userID=' + id)
      .then(async response => {
        const { data } = response;
        return data;
      })
      .catch(e => {
      })
    : type.type === 1
      ? await uploadImageAPI(
        BASEURl + 'webapi/v1/nearby/',
        type.latLng,
      )
        .then(async response => {
          const { data } = response;
          return data;
        })
        .catch(e => {
        })
      : type.type === 2
        ?
        await uploadImageAPI(
          BASEURl + 'wp-json/search/websearch',
          type.data,
        )
          .then(async response => {
            const { data } = response;
            return data;
          })
          .catch(e => {
          })
        :
        await getAPI(
          BASEURl + `webapi/v1/AppFilter?UserId=${type.data.UserId}&data_custom_taxonomy=${type.data.data_custom_taxonomy}&data_customvalue=${type.data.data_customvalue}`
        )
          .then(async response => {
            console.log("payload data_custom_taxonomy", type.data.data_custom_taxonomy)
            console.log("payload data_customvalue", type.data.data_customvalue)

            console.log("payload type", type.type)
            const { data } = response;
            console.log("Filter Api response", JSON.stringify(response.data.data.length))
            return data;
          })
          .catch(e => {
            console.log("Filter Api error", e)
          });
});

const getPopertiesSlice = createSlice({
  name: 'getPoperties',
  initialState: {
    getPopertiesData: [],
    status: null,
  },
  extraReducers: {
    [getPoperties.pending]: (state, action) => {
      state.satus;
      satus = 'loading';
    },
    [getPoperties.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getPopertiesData = action.payload;
    },
    [getPoperties.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getPopertiesSlice.reducer;