import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
const initialState = {
   shopOrderDetailsTable: {
      data: [],
      isLoading: true,
      totalOrdersDetails: 0,
      listSelected: [],
      rowModesModel: {},
      mode: "view",
      currentPage: 1,
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
const shopOrderDetailsSlice = createSlice({
   name: "shopOrderDetailsSlice",
   initialState: initialState,
   reducers: {
      changeTab: (state, action) => {
         state.tab = action.payload;
      },
      changeListSelectedRows: (state, action) => {
         state.shopOrderDetailsTable.listSelected = action.payload;
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
         .addCase(getOrderDetailsFilterPaging.fulfilled, (state, action) => {
            const { pageNumber, totalElement, lists } = action.payload.data;
            const page = action.payload.page;
            state.shopOrderDetailsTable.data = lists;
            state.shopOrderDetailsTable.totalOrdersDetails = totalElement;
            state.shopOrderDetailsTable.isLoading = false;
            state.shopOrderDetailsTable.currentPage = page;
         })
         .addCase(getOrderDetailsFilterPaging.pending, (state, action) => {
            state.shopOrderDetailsTable.isLoading = true;
         })
         .addCase(getOrderDetailsFilterPaging.rejected, (state, action) => {
            state.shopOrderDetailsTable.isLoading = false;
            state.shopOrderDetailsTable.data = [];
            state.shopOrderDetailsTable.totalOrders = 0;
            state.shopOrderDetailsTable.totalItems = 0;
            state.shopOrderDetailsTable.currentPage = 0;
         }),
});

export default shopOrderDetailsSlice;

export const getOrderDetailsFilterPaging = createAsyncThunk(
   "shopOrderDetailsSlice/getorderfilterpag",
   async (page, { getState }) => {
      const state = getState();
      try {
         const filter = state.shopOrderDetailsSlice.filter;
         console.log(filter, "filterrrr");

         const formData = {
            ...filter,
            pageNumber: page,
         };
         const res = await api.get("/shop-owner/order-detail", {
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

export const getShopOrderTableSelector = (state) =>
   state.shopOrderDetailsSlice.shopOrderDetailsTable;

export const getShopOrderDetailsTableSelector = (state) =>
   state.shopOrderDetailsSlice.shopOrderDetailsTable;

export const getListSelectedInOrderDetailsTableSelector = (state) =>
   state.shopOrderDetailsSlice.shopOrderDetailsTable.listSelected;
