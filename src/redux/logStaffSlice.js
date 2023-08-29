import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
const initialState = {
   logStaffOrderTable: {
      data: [],
      isLoading: true,
      totalElements: 0,
      listSelected: [],
      rowModesModel: {},
      mode: "view",
      currentPage: 1,
   },
   tab: 1,
   filter: {
      logOrderSearchInfo: {
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
   canChangeStatus: false,
};
const logStaffSlice = createSlice({
   name: "logStaffSlice",
   initialState: initialState,
   reducers: {
      changeTab: (state, action) => {
         state.tab = action.payload;
      },
      changeListSelectedRows: (state, action) => {
         state.logStaffOrderTable.listSelected = action.payload;
      },
      changeOrderSearchInfo: (state, action) => {
         state.filter.logOrderSearchInfo = action.payload;
      },
      changeSortDirection: (state, action) => {
         state.filter.sortDirection = action.payload;
      },
      resetState: (state, action) => {
         return initialState;
      },
      changeCanChangeStatusUser: (state, action) => {
         state.canChangeStatus = action.payload;
      },
   },
   extraReducers: (builder) =>
      builder
         .addCase(getLogStaffTable.fulfilled, (state, action) => {
            const { pageNumber, totalElement, lists } = action.payload.data;
            const page = action.payload.page;
            state.logStaffOrderTable.data = lists;
            state.logStaffOrderTable.totalElements = totalElement;
            state.logStaffOrderTable.isLoading = false;
            state.logStaffOrderTable.currentPage = page;
         })
         .addCase(getLogStaffTable.pending, (state, action) => {
            state.logStaffOrderTable.isLoading = true;
         })
         .addCase(getLogStaffTable.rejected, (state, action) => {
            state.logStaffOrderTable.isLoading = false;
            state.logStaffOrderTable.data = [];
            state.logStaffOrderTable.totalElements = 0;
            state.logStaffOrderTable.totalItems = 0;
            state.logStaffOrderTable.currentPage = 0;
         }),
});

export default logStaffSlice;

export const getLogStaffTable = createAsyncThunk(
   "/shop-owner/log-orders",
   async (page, { getState }) => {
      const state = getState();
      try {
         const filter = state.logStaffSlice.filter;
         const formData = {
            ...filter,
            pageNumber: page,
         };
         const res = await api.get("/shop-owner/log-orders", {
            params: {
               data: JSON.stringify(formData),
            },
         });
         const data = await res.data;
         console.log(data);
         return {
            data: data,
            page: page,
         };
      } catch (err) {
         console.log(err);
         throw err;
      }
   }
);

export const getLogStaffTableSelector = (state) =>
   state.logStaffSlice.logStaffOrderTable;

export const getLogStaffSliceSelector = state => state.logStaffSlice