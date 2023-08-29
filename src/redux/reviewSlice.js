import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
const initialState = {
   reviewTable: {
      data: [],
      isLoading: true,
      totalElement: 0,
      listSelected: [],
      mode: "view",
      currentPage: 1,
   },
   filter: {
      reviewSearchInfo: {
         id: 0,
         field: "",
         value: "",
         operator: "",
      },
      sortDirection: {
         field: "",
         sort: "",
      },
      pageNumber: 1,
   },
};
const reviewSlice = createSlice({
   name: "reviewSlice",
   initialState: initialState,
   reducers: {
      changeListSelectedRows: (state, action) => {
         state.reviewTable.listSelected = action.payload;
      },
      changeReviewSearchInfo: (state, action) => {
         state.filter.reviewSearchInfo = action.payload;
      },
      changeSortDirection: (state, action) => {
         state.filter.sortDirection = action.payload;
      },
      resetState: (state, action) => {
         return initialState;
      },
   },
   extraReducers: (builder) =>
      builder
         .addCase(getReviewDataTable.fulfilled, (state, action) => {
            const { pageNumber, totalElement, lists } = action.payload.data;
            const page = action.payload.page;
            state.reviewTable.data = lists;
            state.reviewTable.totalElement = totalElement;
            state.reviewTable.isLoading = false;
            state.reviewTable.currentPage = page;
         })
         .addCase(getReviewDataTable.pending, (state, action) => {
            state.reviewTable.isLoading = true;
         })
         .addCase(getReviewDataTable.rejected, (state, action) => {
            state.reviewTable.isLoading = false;
            state.reviewTable.data = [];
            state.reviewTable.totalElement = 0;
            state.reviewTable.currentPage = 0;
         }),
});

export default reviewSlice;

export const getReviewDataTable = createAsyncThunk(
   "reviewSlice/getReviewDataTable",
   async (page, { getState }) => {
      const state = getState();
      try {
         const filter = state.reviewSlice.filter;
         console.log(filter, "filterrrr");
         const formData = {
            ...filter,
            pageNumber: page,
         };
         const res = await api.get(`/shop-owner/reviews`, {
            params: {
               data: JSON.stringify(formData),
            },
         });
         const data = await res.data;
         console.log(data);
         return {
            data: data,
            page: page
         }
      } catch (error) {
         console.error(error);
         throw error;
      }
   }
);

export const getReviewTableSelector = (state) => state.reviewSlice.reviewTable;
