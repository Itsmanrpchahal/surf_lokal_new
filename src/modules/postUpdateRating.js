import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import {url} from '../config/url';
import AsyncStorage from '@react-native-community/async-storage';

export const postUpdateRating = createAsyncThunk(
  'postUpdateRating',
  async dispatch => {
    let data = {
      userID: 3,
      postid: 882045,
      comment_content: 'testin dummy ',
      review_title: 'review title',
      review_stars: 1,
      description_review_stars: 2,
      price_review_stars: 3,
      interest_review_stars: 4,
    };

    return await uploadImageAPI(
      'https://surf.topsearchrealty.com/webapi/v1/rating/',
      data,
    )
      .then(async response => {
        const {data} = response;
        console.log('value', response);
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
  },
);

const postUpdateRatingSlice = createSlice({
  name: 'postUpdateRating',
  initialState: {
    postUpdateRatingData: [],
    status: null,
  },
  extraReducers: {
    [postUpdateRating.pending]: (state, action) => {
      state.status = 'loading';
    },
    [postUpdateRating.fulfilled]: (state, action) => {
      state.status = 'success';
      state.postUpdateRatingData = action.payload;
    },
    [postUpdateRating.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default postUpdateRatingSlice.reducer;
