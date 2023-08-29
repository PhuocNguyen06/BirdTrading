import { createSlice } from "@reduxjs/toolkit";
import { userRole } from "../config/constant";
const initialState = {
   info: {

   }, 
   role: 0,
}
const userInfoSlice = createSlice({
   name: 'userInfoSlice',
   initialState: initialState,
   reducers :{
      changeUserInfo: (state, actions) => {
         return actions.payload;
      },
      resetState: (state, actions) => initialState
   }
})

export default userInfoSlice;

export const userInfoSliceSelector = state => state.userInfoSlice;

export const userRoleSelector = state => state.userInfoSlice.role
