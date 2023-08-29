import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { userList } from "../component/message/message-username/userListData";

import { DatasetLinked } from "@mui/icons-material";
import { api } from "../api/api";
import { userRole } from "../config/constant";

const messageSlice = createSlice({
    name: 'messageSlice',
    initialState:{
        message: {
            isOpen: false,
            currentShopIDSelect: -1,
            numRead: 0,
            numberUnread: 0,
            userList: [],
            totalPageUserListPaging: 0,
            currentPagenumberUserList: 0,
            messageList: {
                messageListData: [],
                totalPage: 0,
                currentPageNumber:0,
            }
        }
    },
    reducers: {
        setOpenPopup: (state, action) => {
          state.message.isOpen = action.payload.isOpen;
        },
        setMessageList: (state, action) => {
            state.message.messageList = action.payload
        },
        addMessage: (state, action) => {
            state.message.messageList.messageListData.push(action.payload.message) 
        },
        setReadMessage: (state, action) => {
          console.log(
            'have read message'
          , action.payload.id)
          var numberRead = 0;
            const updatedUserList = action.payload.userList.map(item => {
                if (item.userId === action.payload.id) {
                  //get number unread
                  numberRead = item.unread;
                  return {
                    ...item,
                    unread: 0
                  };
                }
                return item;
              });
              console.log(updatedUserList);
            // state.message.userList = updatedUserList;
            const newNumberUnread =  state.message.numberUnread - numberRead;
            const id = action.payload.id;
            return {
              ...state,
              message: {
                ...state.message,
                userList: updatedUserList,
                numRead: numberRead,
                currentShopIDSelect: id,
                numberUnread: newNumberUnread,
              },
              
            };
        },
        setNumberUnread: (state, action) => {
            console.log(action.payload.numberUnread)
            state.message.numberUnread = action.payload.numberUnread
        },
        increaseNumberUnread: (state, action) => {
          console.log('+1')
            return {
              ...state,
              message: {
                ...state.message,
                numberUnread: state.message.numberUnread + 1,
              },
            };
        }, 
        setCurrentShopIDSelect: (state, action) => {
          state.message.currentShopIDSelect = action.payload.shopID
        },
        updateMessagePopoverOpenUser: (state, action) => {
          const message = action.payload.message;
          // Update the unread message count for each user in userList
          if (state.message.messageList.messageListData?.length === 0) {
            const updatedUserList = action.payload.userList.map((item) => {
              if (item.userId === message.userID) {
                // Update the unread count
                const unread = item.unread + 1;
                return {
                  ...item,
                  unread: unread,
                };
              }
              return item;
            });
        
            return {
              ...state,
              message: {
                ...state.message,
                userList: updatedUserList,
              },
            };
          } else {
            // Handle the case when the message is clicked
            // ...
            //Handle message arrive is have the same shop id with shop id
            const currentShopID = action.payload.currentShopIDSelect;   
            if(currentShopID === message.userID) {
              const updatedMessageListData = [...state.message.messageList.messageListData, message];

              const updatedUserList = action.payload.userList.map((item) => {
                if (item.userId === currentShopID) {
                  // Update the unread count
                  const unread = item.unread + 1;
                  return {
                    ...item,
                    unread: unread,
                  };
                }
                return item;
              });
          
              return {
                ...state,
                message: {
                  ...state.message,
                  messageList: {
                    ...state.message.messageList,
                    messageListData: updatedMessageListData,
                  },
                  userList: updatedUserList,
                },
              };

            }else {
              //Handle message arrive is not have the same shop id with shop id
              const updatedUserList = action.payload.userList.map((item) => {
                if (item.userId === message.userID) {
                  // Update the unread count
                  const unread = item.unread + 1;
                  return {
                    ...item,
                    unread: unread,
                  };
                }
                return item;
              });
          
              return {
                ...state,
                message: {
                  ...state.message,
                  userList: updatedUserList,
                },
              };
            }
          }
        },
        addUserIntoUserList: (state, action) => {
          const { user,  } = action.payload;    
          const existShop = state.message.userList.find(item => item.userId === user.userId);
          
          if (!existShop) {
            const updatedUserList = [user, ...state.message.userList];
            return { ...state, message: { ...state.message, userList: updatedUserList } };
          }else {
            state.message.userList?.sort((a, b) => (a.userId === user.userId ? -1 : 1));
          }
          
          return state;
        },
        changeCurrentlUserListPaging: (state, action) => {
          const currentPageNumber = state.message.currentPagenumberUserList + action.payload.number;
          return {
            ...state,
            message: {
              ...state.message,
              currentPagenumberUserList: currentPageNumber,
            }
          }
        },
        updateListMessage: (state, action) => {
            const olderMessageList = action.payload.lists;
            const updateList = [...olderMessageList, ...state.message.messageList.messageListData];
            // const updateList = [];
            return {
              ...state,
              message: {
                ...state.message,
                messageList: {
                  ...state.message.messageList,
                  messageListData: updateList,
                }
              }
            }
        },
        changeCurretNumberMessagePaing: (state, action) => {
          const currentPageNumber = state.message.messageList.currentPageNumber + action.payload.number;
          return {
            ...state,
            message: {
              ...state.message,
              messageList: {
                ...state.message.messageList,
                currentPageNumber: currentPageNumber,
              }
            }
          }
        }
            
    },
    extraReducers: (builder) =>
        builder
        .addCase(getListUser.fulfilled, (state, action) => {
            state.message.userList = action.payload.lists;
            state.message.totalPageUserListPaging = action.payload.pageNumber;
        })
        .addCase(getListUser.rejected, (state, action) => {
            console.log(action)
        })
        .addCase(getListMessage.fulfilled, (state, action) => {
          state.message.messageList.messageListData = action.payload.lists;
          state.message.messageList.totalPage = action.payload.pageNumber;
        })
        .addCase(sendMessage.rejected, (state, action) => {
            console.log(action)
        }) 
        .addCase(getTotalUnread.fulfilled, (state, action) => {
          state.message.numberUnread = action.payload.totalUnread;
        })
        .addCase(getTotalUnread.rejected, (state,action) => {
          console.log(action)
        })
})

export const { setMessage, addMessage } = messageSlice.actions;

export default messageSlice;

export const getListUser = createAsyncThunk(
    "message/channel-list",
    async (_, {getState}) => {
        const state = getState();
        const userInfo = state.userInfoSlice.info;
        const messageList = state.messageSlice.message;
        try {
          const pageNumber = messageList?.currentPagenumberUserList;
          const res = await api.get(`/shop-owner/${userInfo?.id}/channels`, {params: {pagenumber: pageNumber}});
          const data = res.data;
          return data;
        //   dispatch(getListUserSuccess(res.data));
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
) ;

export const getListMessage = createAsyncThunk(
    "message/message-list",
    async (userid, {getState}) => {
        const state = getState();
        const userInfo = state.userInfoSlice.info;
        const messageList = state.messageSlice.message.messageList;
        // console.log("pagenumber default ne ", pageNumber);
        try {
          const pageNumber = messageList?.currentPageNumber;
          const res = await api.get(`/shop-owner/${userInfo?.id}/messages`, {params: {userid: userid, pagenumber: 0}});
          const data = res.data;
          return data;
        //   dispatch(getListUserSuccess(res.data));
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
) ;

export const getListMessageOlder = createAsyncThunk(
  "message/message-list-older",
  async (userid, {getState}) => {
      const state = getState();
      const userInfo = state.userInfoSlice.info;
      const messageList = state.messageSlice.message.messageList;
      // console.log("pagenumber default ne ", pageNumber);
      try {
        const pageNumber = messageList?.currentPageNumber;
        const res = await api.get(`/shop-owner/${userInfo?.id}/messages`, {params: {userid: userid, pagenumber: pageNumber}});
        const data = res.data;
        return data;
      //   dispatch(getListUserSuccess(res.data));
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
) ;

export const sendMessage = createAsyncThunk(
  "message/message-send",
    async (message) => {
        try{
          const res = await api.post(`/users/message/send`, message);
          const data = res.data;
          return data;
        }catch (error) {
          console.log(error)
        }
    }
)

export const getTotalUnread = createAsyncThunk(
  "message/message-total-unread",
  async(_, {getState}) => {
    const state = getState();
    const userInfo = state.userInfoSlice.info;
    try{
      if(  3 !== userInfo?.role){
        console.log('heheh co vaoaf', userRole[userInfo?.role].code)
        return 0;
      }else{
        const res = await api.get(`/shop-owner/${userInfo?.id}/messages/unread`);
        const data = res.data;
        return data;
      }     
    }catch(error){
      console.log(error);
      throw error;
    }
  }
)

export const messageSelector = state => state.messageSlice.message


