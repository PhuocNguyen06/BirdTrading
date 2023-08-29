import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
const initialState = {
   shopOrderTable: {
      data: [],
      isLoading: true,
      totalOrders: 0,
      listSelected: [],
      rowModesModel: {},
      mode: "view",
      currentPage: 1,
      isAdmin: false
   },
   tab: 1,
   filter: {
      orderSearchInfo: {
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
const shopOrderSlice = createSlice({
   name: "shopOrderSlice",
   initialState: initialState,
   reducers: {
      changeTab: (state, action) => {
         state.tab = action.payload;
      },
      changeListSelectedRows: (state, action) => {
         state.shopOrderTable.listSelected = action.payload;
      },
      changeOrderSearchInfo: (state, action) => {
         state.filter.orderSearchInfo = action.payload;
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
         .addCase(getOrderFilterPaging.fulfilled, (state, action) => {
            const { pageNumber, totalElement, lists } = action.payload.data;
            const page = action.payload.page;
            state.shopOrderTable.data = lists;
            state.shopOrderTable.totalOrders = totalElement;
            state.shopOrderTable.isLoading = false;
            state.shopOrderTable.currentPage = page;
         })
         .addCase(getOrderFilterPaging.pending, (state, action) => {
            state.shopOrderTable.isLoading = true;
         })
         .addCase(getOrderFilterPaging.rejected, (state, action) => {
            state.shopOrderTable.isLoading = false;
            state.shopOrderTable.data = [];
            state.shopOrderTable.totalOrders = 0;
            state.shopOrderTable.totalItems = 0;

            state.shopOrderTable.currentPage = 0;
         })
         .addCase(getOrderFilterPagingAdmin.fulfilled, (state, action) => {
            const { pageNumber, totalElement, lists } = action.payload.data;
            const page = action.payload.page;
            state.shopOrderTable.data = lists;
            state.shopOrderTable.totalOrders = totalElement;
            state.shopOrderTable.isLoading = false;
            state.shopOrderTable.currentPage = page;
            state.shopOrderTable.isAdmin = true;
         })
         .addCase(getOrderFilterPagingAdmin.pending, (state, action) => {
            state.shopOrderTable.isLoading = true;
         })
         .addCase(getOrderFilterPagingAdmin.rejected, (state, action) => {
            state.shopOrderTable.isLoading = false;
            state.shopOrderTable.data = [];
            state.shopOrderTable.totalOrders = 0;
            state.shopOrderTable.totalItems = 0;
            state.shopOrderTable.isAdmin = true;
            state.shopOrderTable.currentPage = 0;
         }),
});

export default shopOrderSlice;

export const getOrderFilterPagingAdmin = createAsyncThunk(
   "shopOrderSlice/getOrderFilterPagingAnd",
   async (page, { getState }) => {
      const state = getState();
      try {
         const filter = state.shopOrderSlice.filter;
         const formData = {
            ...filter,
            pageNumber: page,
         };
         const res = await api.get("admin/orders", {
            params: {
               data: JSON.stringify(formData),
            },
         });
         const data = await res.data;
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
export const getOrderFilterPaging = createAsyncThunk(
   "shopOrderSlice/getorderfilterpag",
   async (page, { getState }) => {
      const state = getState();
      try {
         const filter = state.shopOrderSlice.filter;
         const formData = {
            ...filter,
            pageNumber: page,
         };
         const res = await api.get("shop-owner/orders", {
            params: {
               data: JSON.stringify(formData),
            },
         });
         const data = await res.data;
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

export const getShopOrderTableSelector = (state) =>
   state.shopOrderSlice.shopOrderTable;

export const getShopOrderSelector = (state) => state.shopOrderSlice;
