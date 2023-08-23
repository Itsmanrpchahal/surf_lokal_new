import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI, uploadImageAPI } from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
import BASEURl from '../services/Api'



export const getPoperties = createAsyncThunk('getPoperties', async type => {
  // const id = await AsyncStorage.getItem('userId')
  const access_token = await AsyncStorage.getItem('acces_token')

  const Header={
    security_key:"SurfLokal52",
    access_token:access_token
  }
  return type.type === 0
    ? await getAPI(BASEURl + "webapi/v1/property/?limit="  +type.data.limit,Header)
      .then(async response => {
        const { data } = response;
        console.log ("Data come ffrom Api ",data)
        return data;
      })
      .catch(e => {
      })
    : type.type === 1
      ?
      await uploadImageAPI(
        BASEURl + 'webapi/v1/nearby/',
        type.latLng,
      )
        .then(async response => {
          console.log("payload latLng", type.latLng)
          const { data } = response;
          console.log('latlng ===+> ', data)
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
            console.log("acces_token", acces_token)

            return data;
          })
          .catch(e => {
          })
        :
        await getAPI(
          BASEURl + `webapi/v1/AppFilter?UserId=${type.data.UserId}&data_custom_taxonomy=${type.data.data_custom_taxonomy}&data_customvalue=${type.data.data_customvalue}`
        )
          .then(async response => {
            console.log("payload data", type.data)
            console.log("acces_token", acces_token)

            console.log("payload data_custom_taxonomy", type.data.data_custom_taxonomy)
            console.log("payload data_customvalue", type.data.data_customvalue)

            console.log("payload response", response)
            const { data } = response;
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