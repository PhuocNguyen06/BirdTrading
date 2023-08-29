import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { category } from "../config/constant";
const initialState = {
   productsTable: {
      data: [],
      isLoading: true,
      type: category.BIRDS,
      totalProduct: 0,
      listSelected: [],
      rowModesModel: {},
      mode: "view",
      currentPage: 1,
      isAdmin: false,
   },
   filter: {
      category: 1,
      productSearchInfo: {
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
const productShopSlice = createSlice({
   name: "productShopSlice",
   initialState: initialState,
   reducers: {
      changeTab: (state, action) => {
         state.productsTable.type = action.payload;
      },
      changeListSelectedRows: (state, action) => {
         state.productsTable.listSelected = action.payload;
      },
      changeRowsModeModel: (state, action) => {
         state.productsTable.rowModesModel = action.payload;
      },
      changeTableMode: (state, action) => {
         state.productsTable.mode = action.payload;
      },
      changeSortDirection: (state, action) => {
         state.filter.sortDirection = action.payload;
      },
      changeProductSearchInfo: (state, action) => {
         state.filter.productSearchInfo = action.payload;
      },
      resetState: (state, action) => {
         return initialState;
      },
   },
   extraReducers: (builder) =>
      builder
         .addCase(getProductTableAndPaging.fulfilled, (state, action) => {
            const { data, page } = action.payload;
            state.productsTable.data = data.lists;
            state.productsTable.pageNumber = data.pageNumber;
            state.productsTable.totalProduct = data.totalElement;
            state.productsTable.isLoading = false;
            state.productsTable.currentPage = page;
         })
         .addCase(getProductTableAndPaging.pending, (state, action) => {
            state.productsTable.isLoading = true;
         })
         .addCase(getProductTableAndPaging.rejected, (state, action) => {
            console.log("errrrroorrrrrr");
            state.productsTable.data = [];
            state.productsTable.pageNumber = 1;
            state.productsTable.totalProduct = 0;
            state.productsTable.isLoading = false;
            state.productsTable.currentPage = 1;
         })
         .addCase(
            getProductTableAndPagingInAdmin.fulfilled,
            (state, action) => {
               const { data, page } = action.payload;
               state.productsTable.data = data.lists;
               state.productsTable.pageNumber = data.pageNumber;
               state.productsTable.totalProduct = data.totalElement;
               state.productsTable.isLoading = false;
               state.productsTable.currentPage = page;
               state.productsTable.isAdmin = true;
            }
         )
         .addCase(getProductTableAndPagingInAdmin.pending, (state, action) => {
            state.productsTable.isLoading = true;
         })
         .addCase(getProductTableAndPagingInAdmin.rejected, (state, action) => {
            console.log("errrrroorrrrrrrrrrrrrrrrrr");
            state.productsTable.data = [];
            state.productsTable.pageNumber = 1;
            state.productsTable.totalProduct = 0;
            state.productsTable.isLoading = false;
            state.productsTable.currentPage = 1;
            state.productsTable.isAdmin = true;
         }),
});

export default productShopSlice;

export const getProductTableAndPagingInAdmin = createAsyncThunk(
   "productShopSlice/getProductTableAndPagingInAdmin",
   async (page, { getState }) => {
      const state = getState();
      try {
         const category = state.productShopSlice.productsTable.type.id;
         const filter = state.productShopSlice.filter;
         const formData = {
            ...filter,
            category,
            pageNumber: page,
         };
         const res = await api.get(`/admin/products`, {
            params: {
               data: JSON.stringify(formData),
            },
         });
         const data = res.data;

         console.log(data, "dfsfdsfasdf dataaaaa");
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
export const getProductTableAndPaging = createAsyncThunk(
   "productShop/getProductTableAndPaging",
   async (page, { getState }) => {
      const state = getState();
      try {
         const category = state.productShopSlice.productsTable.type.id;
         const filter = state.productShopSlice.filter;
         const formData = {
            ...filter,
            category,
            pageNumber: page,
         };
         console.log(formData, "dfsfdsfasdfa sdfasdf asdf asdf sd");
         const res = await api.get(`shop-owner/products`, {
            params: {
               data: JSON.stringify(formData),
            },
         });
         const data = res.data;

         console.log(data, "dfsfdsfasdf dataaaaa");
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

export const productTableSelector = (state) =>
   state.productShopSlice.productsTable;
