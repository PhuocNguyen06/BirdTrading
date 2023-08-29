import {
   createAsyncThunk,
   createSelector,
   createSlice,
   current,
} from "@reduxjs/toolkit";
import { api } from "../api/api";
import {
   getListImagesForUpdate,
   getListImagesPreviewSelector,
} from "./fileControlSlice";
const initialState = {
   basicForm: {
      form: null,
      data: {
         name: "",
         category: 0,
      },
   },
   detailsForm: {
      form: null,
      data: {
         type: 0,
         tags: [],
         description: "",
      },
   },
   feature: {
      form: null,
      data: {},
   },
   salesForm: {
      form: null,
      data: {
         price: 0,
         quantity: 0,
         voucher: [],
      },
   },
   getForm: 0,
   imageState: {
      status: true,
      msg: "Need images to create products!",
   },
   listImageUpdate: [],
   errorForm: {
      basic: 0,
      details: 0,
      sales: 0,
   },
   status: "CREATE",
};
const productDetailsValidateSlice = createSlice({
   name: "productDetailsValidateSlice",
   initialState: initialState,
   reducers: {
      handleOnChangeBasicForm: (state, action) => {
         state.basicForm.data = action.payload;
      },
      handleOnChangeDetailsForm: (state, action) => {
         state.detailsForm.data = action.payload;
      },
      handleOnChangeSalesForm: (state, action) => {
         state.salesForm.data = action.payload;
      },
      changeValidState: (state, action) => {
         state.isValid = action.payload;
      },
      handleOnChangeFeature: (state, action) => {
         state.feature.data = action.payload;
      },
      setBasicForm: (state, action) => {
         state.basicForm.form = action.payload;
      },
      setDetailsForm: (state, action) => {
         state.detailsForm.form = action.payload;
      },
      setSalesForm: (state, action) => {
         state.salesForm.form = action.payload;
      },
      setFeatureCategory: (state, action) => {
         state.feature.form = action.payload;
      },
      getForm: (state, action) => {
         state.getForm = state.getForm + 1;
      },
      setImagesState: (state, action) => {
         state.imageState.status = action.payload;
      },
      changeErrorFormBasic: (state, action) => {
         state.errorForm.basic = action.payload;
      },
      changeErrorFormDetails: (state, action) => {
         state.errorForm.details = action.payload;
      },
      changeErrorFormSales: (state, action) => {
         state.errorForm.sales = action.payload;
      },
      clearData: (state, action) => {
         return initialState;
      },
   },
   extraReducers: (builder) =>
      builder
         .addCase(getProductDetailsById.fulfilled, (state, action) => {
            const { basicForm, detailsForm, feature, salesForm } =
               action.payload;
            state.basicForm.data = basicForm;
            state.detailsForm.data = detailsForm;
            state.feature.data = feature;
            state.salesForm.data = salesForm;
            state.status = "UPDATE";
         })
         .addCase(getProductDetailsById.pending, (state, action) => {})
         .addCase(getProductDetailsById.rejected, (state, action) => {
            console.log(action.payload);
         }),
});

export default productDetailsValidateSlice;

export const getProductDetailsById = createAsyncThunk(
   "productDetailsValidateSlice/getProductDetailsById",
   async (id, { dispatch }) => {
      try {
         const res = await api.get("/shop-owner/products/" + id);
         const data = res.data;
         dispatch(
            getListImagesForUpdate({
               listImage: data.listImages,
               video: data.video,
            })
         );
         console.log(data);
         return data;
      } catch (err) {
         console.error(err);
         throw err;
      }
   }
);

export const getCategoryInForm = (state) =>
   state.productDetailsValidateSlice.basicForm?.data?.category;

export const getProductValidateStateSelector = (state) =>
   state.productDetailsValidateSlice;

export const getBasicFormSelector = (state) =>
   state.productDetailsValidateSlice.basicForm.form;
export const getDetailFormSelector = (state) =>
   state.productDetailsValidateSlice.detailsForm.form;
export const getFeatureSelector = (state) =>
   state.productDetailsValidateSlice.feature.form;
export const getSalesFormSelector = (state) =>
   state.productDetailsValidateSlice.salesForm.form;

export const getFormSelector = (state) =>
   state.productDetailsValidateSlice.getForm;

export const getImageStateSelector = (state) =>
   state.productDetailsValidateSlice.imageState;

export const getErrorFormSelector = (state) =>
   state.productDetailsValidateSlice.errorForm;

export const getProductDetailsValidateSelector = (state) =>
   state.productDetailsValidateSlice;
export const getIsImageValidateSelector = createSelector(
   getListImagesPreviewSelector,
   (images) => {
      if (images && images.length === 0) {
         return false;
      } else {
         return true;
      }
   }
);
