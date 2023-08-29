import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./userInfoSlice";
import sideBarSlice from "./sideBarSlice";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import productShopSlice from "./productsShopSlice";
import productDetailsSlice from "./productDetailsSlice";
import fileControlSlice from "./fileControlSlice";
import productDetailsValidateSlice from "./productDetailsValidateSlice";
import messageSlice from "./messageSlice";

import globalConfigSlice from "./globalConfigSlice";
import shopOrderSlice from "./shopOrderSlice";
import shopStaffSlice from "./shopStaffSlice";
import shopOrderDetailsSlice from "./shopOrderDetailsSlice";
import notificationSlice from "./notificationSlice";
import reviewSlice from "./reviewSlice";
import adminShopOwnerSlice from "./adminShopOwnerSlice";
import adminUserSlice from "./adminUserSlice";
import adminPackageSlice from "./adminPackageSlice";
import logStaffSlice from "./logStaffSlice";
import adminPromotionSlice from "./adminPromotionSlice";
const persistConfig = {
   key: "root",
   version: 1,
   storage,
   // if you do not want to persist this part of the state
   blacklist: [
      "sideBarSlice",
      "productShopSlice",
      "fileControlSlice",
      "productDetailsValidateSlice",
      "productDetailsSlice",
      "globalConfigSlice",
      "shopOrderSlice",
      "shopStaffSlice",
      "messageSlice",
      "shopOrderDetailsSlice",
      "reviewSlice",
      "adminShopOwnerSlice",
      "adminUserSlice",
      "adminPackageSlice",
      "logStaffSlice",
      "adminPromotionSlice"
   ],
};
const reducer = combineReducers({
   userInfoSlice: userInfoSlice.reducer,
   // not persisting this reducer
   sideBarSlice: sideBarSlice.reducer,
   productShopSlice: productShopSlice.reducer,
   productDetailsSlice: productDetailsSlice.reducer,
   fileControlSlice: fileControlSlice.reducer,
   productDetailsValidateSlice: productDetailsValidateSlice.reducer,
   messageSlice: messageSlice.reducer,
   globalConfigSlice: globalConfigSlice.reducer,
   shopOrderSlice: shopOrderSlice.reducer,
   shopStaffSlice: shopStaffSlice.reducer,
   shopOrderDetailsSlice: shopOrderDetailsSlice.reducer,
   notificationSlice: notificationSlice.reducer,
   reviewSlice: reviewSlice.reducer,
   adminShopOwnerSlice: adminShopOwnerSlice.reducer,
   adminUserSlice: adminUserSlice.reducer,
   adminPackageSlice: adminPackageSlice.reducer,
   logStaffSlice: logStaffSlice.reducer,
   adminPromotionSlice: adminPromotionSlice.reducer
});
// this ensures your redux state is saved to persisted storage whenever it changes
// we pass this to the store
const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
});
export default store;
