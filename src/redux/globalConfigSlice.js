import { createSlice } from "@reduxjs/toolkit";
import { userRole } from "../config/constant";

const globalConfigSlice = createSlice({
   name: "globalConfigSlice",
   initialState: {
      openBackDrop: false,
      snackBar: {
         v: "bottom",
         h: "right",
         open: false,
         message: 'Something went wrong!',
         typeStatus: 'error',
         title: "Error"
      },
   },
   reducers: {
      changeBackDropState: (state, action) => {
         state.openBackDrop = action.payload;
      },
      changeSnackBarState: (state, action) => {
         state.snackBar = { ...state.snackBar, ...action.payload };
      },
   },
});

export default globalConfigSlice;

export const globalSliceSelector = (state) => state.globalConfigSlice;
