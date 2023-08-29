import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import React from "react";
import { api } from "../api/api";
import { userRole } from "../config/constant";

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState: {
    notification: {
      unread: 0,
      notiList: [],
      totalPageNumber: 0,
      currentPageNumber: 0,
    },
  },
  reducers: {
    setCurrentPageNumber: (state, action) => {
      console.log(action.payload.currentPageNumber, "current page ");
      state.notification.currentPageNumber = action.payload.currentPageNumber;
    },
    setUnreadNoti: (state, action) => {
      state.notification.unread = action.payload.unread;
    },
    increaseNotiUnreadToOne: (state, action) => {
      const newUnread = action.payload.unread + 1;
      state.notification.unread = newUnread;
    },
    addNotificationToList: (state, action) => {
      const { notification } = action.payload;
      return {
        ...state,
        notification: {
          ...state.notification,
          notiList: [notification, ...state.notification.notiList],
        },
      };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getListNotification.fulfilled, (state, action) => {
        state.notification.notiList = action.payload.lists;
        state.notification.totalPageNumber = action.payload.pageNumber;
      })
      .addCase(getListNotification.rejected, (state, action) => {
        console.log(action);
      })
      .addCase(getUnreadNotification.fulfilled, (state, action) => {
        console.log(action.payload.unread, "in notification slice");
        state.notification.unread = action.payload.unread;
      })
      .addCase(getUnreadNotification.rejected, (state, action) => {
        console.log(action);
      }),
});

export default notificationSlice;
export const getListNotification = createAsyncThunk(
  "notification/noti-list",
  async (pageNumber, { getState }) => {
    const state = getState();
    const userInfo = state.userInfoSlice.info;
    // const pageNumber = state.notificationSlice.notification.currentPageNumber;
    try {
      if( 3 !== userInfo?.role){
        const data = {
          lists: []
        }
        return data;
      }else{
        const res = await api.get(`/shop-owner/${userInfo?.id}/notifications`, {
          params: { pagenumber: pageNumber },
        });
        const data = res.data;
        return data;
      }
      //   dispatch(getListUserSuccess(res.data));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const getUnreadNotification = createAsyncThunk(
  "notification/noti-unread",
  async (_, { getState }) => {
    const state = getState();
    const userInfo = state.userInfoSlice.info;
    try {
      if( 3 !== userInfo?.role){
        return 0;
      }else{
        const res = await api.get(`/shop-owner/${userInfo?.id}/notifications/unread`);
        const data = res.data;
        return data;
      }
      
      //   dispatch(getListUserSuccess(res.data));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const notificationSelector = (state) =>
  state.notificationSlice.notification;
