import { configureStore } from '@reduxjs/toolkit';
import loginUserReducer from '../modules/loginUser';
import googleUserReducer from '../modules/googleLogin';
import getCountryReducer from '../modules/getCountry';
import getPopertiesReducer from '../modules/getPoperties';
import getFavoritePropertiesReducer from '../modules/getFavoriteProperties';
import getTrashReducer from '../modules/getTrash';
import getProfileReducer from '../modules/getProfile';
import postRatingReducer from '../modules/postRating';
import postUpdateRatingReducer from '../modules/postUpdateRating';
import getPopertiesDetailsReducer from '../modules/getPopertiesDetails';
import registerReducer from '../modules/register';
import emailCheckReducer from '../modules/emailCheck';
import forgotPasswordReducer from '../modules/forgotPassword';
import getSavedSearchReducer from '../modules/getSavedSearch';
import deleteSearchReducer from '../modules/deleteSearch';
import getSearchReducer from '../modules/getSearch';
// 16 May 2023
import getFilterReducer from '../modules/getFilter';
import getNearByReducer from '../modules/getNearBy';
import editSearchReducer from '../modules/editSearch';
import chatGptReducer from '../modules/chatgpt';
import makeOfferReducer from '../modules/makeOffer';
export const store = configureStore({
  reducer: {
    loginUser: loginUserReducer,
    getCountry: getCountryReducer,
    getPoperties: getPopertiesReducer,
    getFavoriteProperties: getFavoritePropertiesReducer,
    getTrash: getTrashReducer,
    getProfile: getProfileReducer,
    postRating: postRatingReducer,
    postUpdateRating: postUpdateRatingReducer,
    getPopertiesDetails: getPopertiesDetailsReducer,
    register: registerReducer,
    emailCheck: emailCheckReducer,
    forgotPassword: forgotPasswordReducer,
    getSavedSearch: getSavedSearchReducer,
    deleteSearch: deleteSearchReducer,
    getSearch: getSearchReducer,
    // 16 May 2023
    getFilter: getFilterReducer,
    getNearBy: getNearByReducer,
    editSearch: editSearchReducer,
    googleUser: googleUserReducer,
    chatGpt:chatGptReducer,
    makeOffer:makeOfferReducer,    
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      hasError: true,
      errorName: 'ValidationError',
      errorMessage: 'Foo must be greater than Bar',
    }),
});
