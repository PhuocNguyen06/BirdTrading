import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
const initialState = {
   adminUserTable: {
      data: [],
      isLoading: true,
      totalUsers: 0,
      listSelected: [],
      rowModesModel: {},
      mode: "view",
      currentPage: 1,
   },
   tab: 1,
   filter: {
      userSearchInfo: {
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
   canChangeStatus: false
};
const adminUserSlice = createSlice({
   name: "adminUserSlice",
   initialState: initialState,
   reducers: {
      changeTab: (state, action) => {
         state.tab = action.payload;
      },
      changeListSelectedRows: (state, action) => {
         state.adminUserTable.listSelected = action.payload;
      },
      changeOrderSearchInfo: (state, action) => {
         state.filter.userSearchInfo = action.payload;
      },
      changeSortDirection: (state, action) => {
         state.filter.sortDirection = action.payload;
      },
      resetState: (state, action) => {
         return initialState;
      },
      changeCanChangeStatusUser: (state, action) => {
         state.canChangeStatus = action.payload;
      }
   },
   extraReducers: (builder) =>
      builder
         .addCase(getUserTablePagingAndFilter.fulfilled, (state, action) => {
            const { pageNumber, totalElement, lists } = action.payload.data;
            const page = action.payload.page;
            state.adminUserTable.data = lists;
            state.adminUserTable.totalUsers = totalElement;
            state.adminUserTable.isLoading = false;
            state.adminUserTable.currentPage = page;
         })
         .addCase(getUserTablePagingAndFilter.pending, (state, action) => {
            state.adminUserTable.isLoading = true;
         })
         .addCase(getUserTablePagingAndFilter.rejected, (state, action) => {
            state.adminUserTable.isLoading = false;
            state.adminUserTable.data = [];
            state.adminUserTable.totalUsers = 0;
            state.adminUserTable.totalItems = 0;
            state.adminUserTable.currentPage = 0;
         }),
});

export default adminUserSlice;

export const getUserTablePagingAndFilter = createAsyncThunk(
   "adminUserSlice/getShopOwnerTablePagingAndFilter",
   async (page, { getState }) => {
      const state = getState();
      try {
         const filter = state.adminUserSlice.filter;
         const formData = {
            ...filter,
            pageNumber: page,
         };
         const res = await api.get("/admin/user-account", {
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

export const getUserTableSelector = (state) =>
   state.adminUserSlice.adminUserTable;

export const getUserSelector = (state) => state.adminUserSlice;
