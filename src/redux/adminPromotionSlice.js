import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
const initialState = {
   adminPromotionTable: {
      data: [],
      isLoading: true,
      totalElement: 0,
      listSelected: [],
      rowModesModel: {},
      mode: "view",
      currentPage: 1,
   },
   tab: 1,
   filter: {
      promotionSearchInfo: {
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
const adminPromotionSlice = createSlice({
   name: "adminPromotionSlice",
   initialState: initialState,
   reducers: {
      changeTab: (state, action) => {
         state.tab = action.payload;
      },
      changeListSelectedRows: (state, action) => {
         state.adminPromotionTable.listSelected = action.payload;
      },
      changeOrderSearchInfo: (state, action) => {
         state.filter.promotionSearchInfo = action.payload;
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
         .addCase(
            getAdminPromotionTableDataAndPaging.fulfilled,
            (state, action) => {
               const { pageNumber, totalElement, lists } = action.payload.data;
               const page = action.payload.page;
               state.adminPromotionTable.data = lists;
               state.adminPromotionTable.totalElement = totalElement;
               state.adminPromotionTable.isLoading = false;
               state.adminPromotionTable.currentPage = page;
            }
         )
         .addCase(
            getAdminPromotionTableDataAndPaging.pending,
            (state, action) => {
               state.adminPromotionTable.isLoading = true;
            }
         )
         .addCase(
            getAdminPromotionTableDataAndPaging.rejected,
            (state, action) => {
               state.adminPromotionTable.isLoading = false;
               state.adminPromotionTable.data = [];
               state.adminPromotionTable.totalElement = 0;
               state.adminPromotionTable.totalItems = 0;
               state.adminPromotionTable.currentPage = 0;
            }
         ),
});

export default adminPromotionSlice;

export const getAdminPromotionTableDataAndPaging = createAsyncThunk(
   "adminPromotionSlice/getAdminPromotionTableDataAndPaging",
   async (page, { getState }) => {
      const state = getState();
      try {
         const filter = state.adminPromotionSlice.filter;
         const formData = {
            ...filter,
            pageNumber: page,
         };
         const res = await api.get("/admin/promotions", {
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

export const getAdminPromotionTableSelector = (state) =>
   state.adminPromotionSlice.adminPromotionTable;

export const getAdminPromotionSelector = (state) => state.adminPromotionSlice;
