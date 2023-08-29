import NotificationsIcon from "@mui/icons-material/Notifications";
import React, { Fragment, useEffect, useState } from 'react'
import s from './notiItemsPopper.module.scss'
import clsx from 'clsx'
import NotiItemInPoper from './notiItemInpoper/NotiItemInPoper'
import { useDispatch, useSelector } from 'react-redux'
import SockJS from 'sockjs-client'
import { over } from 'stompjs'
import notificationSlice, { getListNotification, getUnreadNotification, notificationSelector } from "../../redux/notificationSlice";
import { userInfoSliceSelector } from "../../redux/userInfoSlice";
import { Badge, Button, IconButton, Popover } from "@mui/material";
import { userRole } from "../../config/constant";

const badgeStyle = {
  badge: {
     "& .MuiBadge-badge": { fontSize: '1.2rem', height: '1.6rem', minWidth: '1.6rem' },
  },
  icon: {
     fontSize: "3rem",
     "&:hover": {
        cursor: "pointer",
     },
  },
};

var stompClient = null;
const NotiItemsPopper = () => {
  // const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const {notiList, totalPageNumber, currentPageNumber, unread} = useSelector(notificationSelector);
  const { status, info, role } = useSelector(userInfoSliceSelector);
  const  [notification, setNotification] = useState()
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUnreadNotification());
    connect(role);
  },[role])

  useEffect(() => {
    console.log(notification, 'here is new notification');
    handleNotificationArrive(notification);
  },[notification])

  
  const handleClose = () => {
    dispatch(notificationSlice.actions.setCurrentPageNumber({currentPageNumber: 0}));
    setAnchorEl(null);
  }

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(getListNotification(currentPageNumber))
    dispatch(notificationSlice.actions.setUnreadNoti({unread: 0}));
  }

  const handlViewMoreNoti = () => {
    if(currentPageNumber < totalPageNumber) {
      const newPage = currentPageNumber + 1;
      dispatch(notificationSlice.actions.setCurrentPageNumber({currentPageNumber: newPage}));
      dispatch(getListNotification(newPage))
      // dispatch(getListNotification(newPage))
      console.log('hiiii')
    }
  }
  
  //socketjs
  const connect = (role) => {
    const url = process.env.REACT_APP_URL_WEBSOCKET;
    if (role === userRole.SHOP_OWNER.code || role === userRole.SHOP_STAFF.code) {
      let Sock = new SockJS(`${url}`);

      stompClient = over(Sock);
      stompClient.connect({}, onConnected, onError);
    }
  };
  console.log('3 !== info?.role', 3 !== info?.role);
  const onConnected = () => {
    try {
      if(3 !== info?.role){
        stompClient.subscribe(
          `/notification/${info?.id}/admin`,
          onPrivateNotification,
          onError
        )
      }else{
        stompClient.subscribe(
          `/notification/${info?.id}/shop`,
          onPrivateNotification,
          onError
        )
      }
      ;
    } catch (error) {
      console.log(error);
    }
    console.log("Connect to channel message");
  };

  const onPrivateNotification = (payload) => {
    const notification = JSON.parse(payload.body);
     setNotification(notification);
  }

  const onError = (err) => {
    console.log(err);
  };
//end socketjs

  const handleNotificationArrive = (notification) => {
    dispatch(notificationSlice.actions.increaseNotiUnreadToOne({unread: unread}));
    handleNewNotification();
    if(open) {
      dispatch(notificationSlice.actions.addNotificationToList({notification: notification}));
    }
  }

   //audio when have new message
   const handleNewNotification = () => {
    try {
      const audio = new Audio(
        "https://bird-trading-platform.s3.ap-southeast-1.amazonaws.com/sound-effects/message_arrive_sound_effect.mp3"
      );
      // Play the notification sound
      // audioRef.current.play();
      var resp = audio.play();
      if (resp !== undefined) {
        resp
          .then((_) => {
            audio.play();
            // autoplay starts!
            // Stop the audio playback after 1 second
            setTimeout(() => {
              // audioRef.current.pause();
              // audioRef.current.currentTime = 0;
              audio.pause();
              audio.currentTime = 0;
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      // Handle the message
      // ...
    } catch (error) {
      // Handle the error
      console.log(error);
    }
  };

  return (
    <div className={clsx(s.container)}>
        <IconButton
            aria-describedby='simple-popover'
            position="relative"
            onClick={handleOpen}
        >
            <Badge
            badgeContent={unread}
            sx={badgeStyle.badge}
            color="primary"
            max={9}
            overlap="circular"
            >
                <NotificationsIcon className={clsx(s.notiIcon)}
                sx={badgeStyle.icon}
                color="template6"
                />
            </Badge>
        </IconButton>

        <Popover 
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          disableScrollLock={true}
          placement="bottom"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          className={clsx(s.popoverNoti)}
          >
            <div className={clsx(s.notiContainer)}>
                
              {notiList?.length !== 0 ?
                <ul className={clsx(s.notiList)}>
                  <div className={clsx(s.titleNoti)}>Notifications</div>
                  <div className={clsx(s.hrCustom)}></div>
                  {notiList?.map((noti, index) => {
                    return(
                      <NotiItemInPoper noti={noti} key={noti?.id} index={index}/>
                    );
                   }
                  )}                 
                </ul>
              :
              <img className={clsx(s.emtyNotiImage)} src="https://bird-trading-platform.s3.ap-southeast-1.amazonaws.com/image/emtynoti.png" alt="" />
              }  
            </div>
            { totalPageNumber > 0 && (totalPageNumber - 1) !== currentPageNumber &&
              <Button variant="outlsuned"
                onClick={handlViewMoreNoti}
                className={clsx(s.btnViewMore)} >
              View more
            </Button>
            }  
        </Popover>
    </div>
  )
}

export default NotiItemsPopper
