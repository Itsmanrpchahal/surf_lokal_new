import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI, uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';


export const getPoperties = createAsyncThunk('getPoperties', async type => {
  const access_token = await AsyncStorage.getItem('access_token');
  const header = Platform.OS === 'android' ?
  {
    security_key: "SurfLokal52",
    access_token: access_token,
    'Content-Type': 'multipart/form-data'
  } :
  {
    security_key: "SurfLokal52",
    access_token: access_token,
  };

  return type.type === 0
    ? await getAPI(BASEURl + "webapi/v1/property/?limit="  +type?.data?.limit)
      .then(async response => {
        const { data } = response;
        return data;
      })
      .catch(e => {
      })
    : type.type === 1
      ?
      await uploadImageAPI(
        BASEURl + 'webapi/v1/nearby/',
        type.latLng,
        header
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
          header
        )
          .then(async response => {
            const { data } = response;
            console.log("websearch response", data)

            return data;
          })
          .catch(e => {
          })
        :
        await getAPI(
          BASEURl + `webapi/v1/AppFilter?data_custom_taxonomy=${type.data.data_custom_taxonomy}&data_customvalue=${type.data.data_customvalue}`,
        )
          .then(async response => {

            const { data } = response;
             console.log("type.data.data_custom_taxonomy",type.data.data_custom_taxonomy)
             console.log("type.data.data_customvalue",type.data.data_customvalue)
             console.log("type.data.response",response)
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