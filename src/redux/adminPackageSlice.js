import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
const initialState = {
   adminPackageTable: {
      data: [],
      isLoading: true,
      totalPackage: 0,
      listSelected: [],
      rowModesModel: {},
      mode: "view",
      currentPage: 1,
   },
   tab: 1,
   filter: {
      packageOrderSearchInfo: {
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
const adminPackageSlice = createSlice({
   name: "adminPackageSlice",
   initialState: initialState,
   reducers: {
      changeTab: (state, action) => {
         state.tab = action.payload;
      },
      changeListSelectedRows: (state, action) => {
         state.adminPackageTable.listSelected = action.payload;
      },
      changeOrderSearchInfo: (state, action) => {
         state.filter.packageOrderSearchInfo = action.payload;
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
         .addCase(getPackagePagingAndFilter.fulfilled, (state, action) => {
            const { pageNumber, totalElement, lists } = action.payload.data;
            const page = action.payload.page;
            state.adminPackageTable.data = lists;
            state.adminPackageTable.totalPackage = totalElement;
            state.adminPackageTable.isLoading = false;
            state.adminPackageTable.currentPage = page;
         })
         .addCase(getPackagePagingAndFilter.pending, (state, action) => {
            state.adminPackageTable.isLoading = true;
         })
         .addCase(getPackagePagingAndFilter.rejected, (state, action) => {
            state.adminPackageTable.isLoading = false;
            state.adminPackageTable.data = [];
            state.adminPackageTable.totalPackage = 0;
            state.adminPackageTable.totalItems = 0;
            state.adminPackageTable.currentPage = 0;
         }),
});

export default adminPackageSlice;

export const getPackagePagingAndFilter = createAsyncThunk(
   "adminPackageSlice/getShopOwnerTablePagingAndFilter",
   async (page, { getState }) => {
      const state = getState();
      try {
         const filter = state.adminPackageSlice.filter;
         const formData = {
            ...filter,
            pageNumber: page,
         };
         const res = await api.get("/admin/package-order", {
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

export const getAdminPackageTableSelector = (state) =>
   state.adminPackageSlice.adminPackageTable;

export const getAdminPackageSelector = (state) => state.adminPackageSlice;
