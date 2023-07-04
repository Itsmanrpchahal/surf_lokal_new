import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postAPI } from "../config/apiMethod";

export const addFavorite = createAsyncThunk("addFavorite",async(payload)=>{
  console.log(payload,"ppppppppp");
    const urlDynamic =
      "https://surf.topsearchrealty.com/webapi/v1/favorites/addremovefavorite.php";
    try {
      const response = await postAPI(urlDynamic, payload);
      const { data } = response
      ;

      console.log(data,"payload data");
      return data;
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log("API issue", error.response);
      } else if (error.request) {
        console.log("API issue", error.request);
      } else {
        console.log("API issue", error.message);
      }
      throw error;
    }
  }
);

const addFavoriteSlice = createSlice({
  name: "addFavorite",
  initialState: {
    addFavoriteData: [],
    status: null,
  },
  extraReducers: {
    [addFavorite.pending]: (state, action) => {
      state.status = "loading";
    },
    [addFavorite.fulfilled]: (state, action) => {
      state.status = "success";
      state.addFavoriteData = action.payload;
    },
    [addFavorite.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default addFavoriteSlice.reducer;
