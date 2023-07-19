import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI, uploadImageAPI} from '../config/apiMethod';

export const getPoperties = createAsyncThunk('getPoperties', async type => {
  console.log(JSON.stringify(type) + '======', 'typppppppppppppp');
  return type.type === 0
    ? await getAPI('https://surf.topsearchrealty.com/webapi/v1/property')
        .then(async response => {
          const {data} = response;
          console.log('property datat', response.data.data);
          return data;
        })
        .catch(e => {
          console.log(e, 'getPoperties');
        })
    : type.type === 1
    ? await uploadImageAPI(
        'https://surf.topsearchrealty.com/webapi/v1/nearby/',
        type.latLng,
      )
        .then(async response => {
          const {data} = response;
          console.log('value1', response.data);
          return data;
        })
        .catch(e => {
          console.log('tyep 1', e, 'nearby gps');
        })
    : await getAPI(
        'https://surf.topsearchrealty.com/webapi/v1/search/insert_search.php',
        type.data,
      )
        .then(async response => {
          const {data} = response;
          return data;
        })
        .catch(e => {
          console.log(e, 'search');
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