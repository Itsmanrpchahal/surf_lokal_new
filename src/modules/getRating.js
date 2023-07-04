import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI } from "../config/apiMethod";
import { url } from "../config/url";

export const getRating = createAsyncThunk(
  "getRating",
  async (post_id) => {
    console.log(post_id, "getRating postid");
    const urlDynamic =
      "https://surf.topsearchrealty.com/webapi/v1/rating/user_rating.php?userID=3&post_id=" + post_id;
    return await getAPI(urlDynamic)
      .then(async (response) => {
        const { data } = response;
        console.log(response.payload,"getRatinggetRating",data)
        return data;
      })
      .catch((e) => {
        console.log(e);
        if (e.response) {
          console.log("api issue", e.response);
        } else if (e.request) {
          console.log("api issue", e.response);
        } else {
          console.log("api issue", e.response);
        }
      });
  }
);

const getRatingSlice = createSlice({
  name: "getRating",
  initialState: {
    getRating: [],
    status: null,
  },
  extraReducers: {
    [getRating.pending]: (state, action) => {
      state.status = "loading";
    },
    [getRating.fulfilled]: (state, action) => {
      state.status = "success";
      state.getRating = action.payload;
    },
    [getRating.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default getRatingSlice.reducer;