import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { convertImageUrlToBase64, dataAsyncUrlToFile } from "../utils/myUtils";
import {v4} from 'uuid';

const productDetailsSlice = createSlice({
   name: "productDetailsSlice",
   initialState: {
      detailsState: {},
      updateState: {},
      createState: {
         listImages: [],
      },
      listVouchers: [],
      listTags: [],
      listTypes: [],
      formRef: {
         basicRef: null,
         detailsRef: null,
         salesRef: null,
      },
      
   },
   reducers: {
      changeFormRef: (state, action) => {
         state.formRef = action.payload;
      },
      addNewTag: (state, action) => {
         console.log(current(state), action.payload);
         state.listTags.push(action.payload);
      },
   },
   // extraReducers: (builder) =>
   //    builder
   //       .addCase(getProductTableAndPaging.fulfilled, (state, action) => {
   //          state.productsTable.data = action.payload.lists;
   //          state.productsTable.page = action.payload.pageNumber;
   //          state.productsTable.isLoading = false;
   //       })
   extraReducers: (builder) =>
      builder
         .addCase(getListVouchers.fulfilled, (state, action) => {
            state.listVouchers = action.payload;
         })
         .addCase(getListVouchers.rejected, (state, action) => {})
         .addCase(getListTags.fulfilled, (state, action) => {
            state.listTags = action.payload;
         })
         .addCase(getListTags.rejected, (state, action) => {})
         .addCase(getListTypes.fulfilled, (state, action) => {
            state.listTypes = action.payload;
         })
         .addCase(getListTypes.rejected, (state, action) => {}),
});

export const getListVouchers = createAsyncThunk(
   "productDetails/getListVouchers",
   async () => {
      try {
         const res = await api.get("/shop-owner/promotion-shop");
         const data = res.data;
         console.log(data);
         return data;
      } catch (err) {
         console.log(err);
      }
   }
);
export const getListTags = createAsyncThunk(
   "productDetails/getListTags",
   async () => {
      try {
         const res = await api.get("/shop-owner/tags");
         const data = res.data;
         return data;
      } catch (err) {
         console.log(err);
      }
   }
);
export const getListTypes = createAsyncThunk(
   "productDetails/getListTypes",
   async (type) => {
      try {
         let res;
         if (type === 1) {
            res = await api.get("/types/birds");
         } else if (type === 2) {
            res = await api.get("/types/foods");
         } else {
            res = await api.get("/types/accessories");
         }
         const data = res.data;
         return data;
      } catch (err) {
         console.log(err);
      }
   }
);

export default productDetailsSlice;


export const productDetailsSelector = state => state.productDetailsSlice
export const getListVoucherSelector = (state) =>
   state.productDetailsSlice.listVouchers;
export const getListTagsSelector = (state) =>
   state.productDetailsSlice.listTags;
export const getListTypesSelector = (state) =>
   state.productDetailsSlice.listTypes;
export const getFormRefSelector = (state) => state.productDetailsSlice.formRef;
