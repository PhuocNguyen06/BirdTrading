import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
import userInfoSlice from './userInfoSlice';

const shopStaffSlice = createSlice({
   name: "shopStaffSlice",
   initialState: {
      tab: 1,
      dataTable: [],
      currentPage: 1,
      isLoading: false,
      totalStaff: 0, 
      listSelected: []     
   },
   reducers: {
      changeTab: (state, action) => {
         state.tab = action.payload;
      },
      changeListSelectedRows: (state, action) => {
         state.listSelected = action.payload;
      }
   },
   extraReducers: (builder) =>
   builder
      .addCase(getShopStaffs.fulfilled, (state, action) => {
         const {totalElement, lists } = action.payload.data;
         const page = action.payload.page;
         state.dataTable = lists;
         state.totalStaff = totalElement;
         state.isLoading = false;
         state.currentPage = page;
      })
      .addCase(getShopStaffs.pending, (state, action) => {
         state.isLoading = true;
      })
      .addCase(getShopStaffs.rejected, (state, action) => {
      }),
});
export const getShopStaffs = createAsyncThunk(
   "shopStaffSlice/getShopStaffs",
   async (page, {getState}) => {
      const state = getState();
      try {
         const shopId = state.userInfoSlice.info.id;
         const res = await api.get("shop-owner/staffs/pages/" + page);
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
export default shopStaffSlice;

export const getShopStaffSelector = (state) => state.shopStaffSlice;
