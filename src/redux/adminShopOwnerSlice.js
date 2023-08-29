import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
const initialState = {
   adminShopOwnerTable: {
      data: [],
      isLoading: true,
      totalShopOwner: 0,
      listSelected: [],
      rowModesModel: {},
      mode: "view",
      currentPage: 1,
   },
   tab: 1,
   filter: {
      shopOwnerSearchInfo: {
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
const adminShopOwnerSlice = createSlice({
   name: "adminShopOwnerSlice",
   initialState: initialState,
   reducers: {
      changeTab: (state, action) => {
         state.tab = action.payload;
      },
      changeListSelectedRows: (state, action) => {
         state.adminShopOwnerTable.listSelected = action.payload;
      },
      changeOrderSearchInfo: (state, action) => {
         state.filter.shopOwnerSearchInfo = action.payload;
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
         .addCase(
            getShopOwnerTablePagingAndFilter.fulfilled,
            (state, action) => {
               const { pageNumber, totalElement, lists } = action.payload.data;
               const page = action.payload.page;
               state.adminShopOwnerTable.data = lists;
               state.adminShopOwnerTable.totalShopOwner = totalElement;
               state.adminShopOwnerTable.isLoading = false;
               state.adminShopOwnerTable.currentPage = page;
            }
         )
         .addCase(getShopOwnerTablePagingAndFilter.pending, (state, action) => {
            state.adminShopOwnerTable.isLoading = true;
         })
         .addCase(
            getShopOwnerTablePagingAndFilter.rejected,
            (state, action) => {
               state.adminShopOwnerTable.isLoading = false;
               state.adminShopOwnerTable.data = [];
               state.adminShopOwnerTable.totalShopOwner = 0;
               state.adminShopOwnerTable.totalItems = 0;
               state.adminShopOwnerTable.currentPage = 0;
            }
         ),
});

export default adminShopOwnerSlice;

export const getShopOwnerTablePagingAndFilter = createAsyncThunk(
   "adminShopOwnerSlice/getShopOwnerTablePagingAndFilter",
   async (page, { getState }) => {
      const state = getState();
      try {
         const filter = state.adminShopOwnerSlice.filter;
         const formData = {
            ...filter,
            pageNumber: page,
         };
         const res = await api.get("/admin/shop-owner-account", {
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

export const getShopOwnerTableSelector = (state) =>
   state.adminShopOwnerSlice.adminShopOwnerTable;

export const getShopOwnerSelector = (state) => state.adminShopOwnerSlice;
