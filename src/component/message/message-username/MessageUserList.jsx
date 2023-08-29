import { Badge, Button, DialogContent, DialogContentText } from '@mui/material'
import clsx from 'clsx'
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import s from './messageUserList.module.scss'
import messageSlice, { getListMessage, getListUser, messageSelector} from '../../../redux/messageSlice';
import { useEffect } from 'react'
import { Message, ModeComment, Visibility } from '@mui/icons-material'
import styled from '@emotion/styled'
import axios from 'axios'
import theme from '../../../style/theme'


const StyledBadge = styled(Badge)(({ theme }) => ({
  right: 0,
  top: 0,
  border: `1px solid ${theme.palette.background.paper}`,
  padding: '0 2px',
  marginRight: '10px',
  '& .MuiBadge-badge': {
    fontSize: '1.5rem', // Adjust the size as needed
  },
}));

const MessageUserList = () => {

  // const [userList, setUserList] = useState([])

  const dispatch = useDispatch()

  const {userList, messageList, currentShopIDSelect, totalPageUserListPaging, currentPagenumberUserList} = useSelector(messageSelector)

  const [activeBgColor, setActiveBgColor] = useState(currentShopIDSelect);

  const getMessage =  async (id) => {
      dispatch(getListMessage(id))
      dispatch(messageSlice.actions.setReadMessage({userList: userList , id: id})); 
      dispatch(messageSlice.actions.changeCurretNumberMessagePaing({number: -messageList.currentPageNumber}))
      setActiveBgColor(id)
  }

  const handleViewMore =  (number) => {
    dispatch(messageSlice.actions.changeCurrentlUserListPaging({number: number}));
    dispatch(getListUser());
  }


  return (
    <div  className={clsx(s.container)}>
      <DialogContent sx={{padding:  "0px", overflow: "hidden"}}>
          <DialogContentText className={clsx(s.messageTitle)} sx={(totalPageUserListPaging > 1 && totalPageUserListPaging == currentPagenumberUserList ) && {marginTop: "20px"}}>
            <b>Select a user:</b>
          </DialogContentText>
          <div className={clsx(s.wapperUserList)}>
          <ul className={clsx(s.memberList)}>
            {userList?.map((item) => (
              <li  key={item.userId} 
                className={clsx(s.memberItem, {[s.activeMemberUser]: item.userId === activeBgColor})} 
                onClick={() => getMessage(item.userId)} >
                <div className={clsx(s.member)}>
                  <img src={item.userAvatar} className={clsx(s.avatarShop)}/>
                  <span className={clsx(s.shopName)}>{item.userName}</span>
                </div>
                {
                  <StyledBadge color="primary" badgeContent={item.unread} className={clsx(s.unread)} sx={item.unread === 0 ? {visibility: 'hidden'} : null}>
                    <Message className={clsx(s.unreadIcon)}/>
                  </StyledBadge>
                }
              </li>
            ))}
            {totalPageUserListPaging > 1 && (
              (totalPageUserListPaging - 1) !== currentPagenumberUserList ? (
                <Button
                  variant="outlined"
                  sx={{
                    width: '100%',
                    fontFamily: 'Segoe UI, Roboto, Oxygen',
                    color: theme.palette.template3.main,
                    backgroundColor: theme.palette.table.main,
                    '&:hover': {
                      color: theme.palette.table.main,
                      backgroundColor: theme.palette.template3.main
                    },
                    marginBottom: '10px'
                  }}
                  onClick={() => handleViewMore(1)}
                >
                  Older
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    width: '100%',
                    fontFamily: 'Segoe UI, Roboto, Oxygen',
                    color: theme.palette.template3.main,
                    backgroundColor: theme.palette.table.main,
                    '&:hover': {
                      color: theme.palette.table.main,
                      backgroundColor: theme.palette.template3.main
                    },
                    marginBottom: '10px'
                  }}
                  onClick={() => handleViewMore(-1)}
                >
                  Newest
                </Button>
              )
            )}
          </ul>
          </div>
      </DialogContent>
    </div>
  )
}

export default MessageUserList
