import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI } from "../config/apiMethod";

export const getMoreFilter = createAsyncThunk(
    "getMoreFilter",
    async () => {
        const urlDynamic =
            "https://surf.topsearchrealty.com/webapi/v1/SubFilter/";
        return await getAPI(urlDynamic)
            .then(async (response) => {
                const { data } = response;
                return data;
            })
            .catch((e) => {
                if (e.response) {
                } else if (e.request) {
                } else {
                }
            });
    }
);

const getMoreFilterSlice = createSlice({
    name: "getMoreFilter",
    initialState: {
        getMoreFilter: [],
        status: null,
    },
    extraReducers: {
        [getMoreFilter.pending]: (state, action) => {
            state.status = "loading";
        },
        [getMoreFilter.fulfilled]: (state, action) => {
            state.status = "success";
            state.getMoreFilter = action.payload;
        },
        [getMoreFilter.rejected]: (state, action) => {
            state.status = "failed";
        },
    },
});

export default getMoreFilterSlice.reducer;