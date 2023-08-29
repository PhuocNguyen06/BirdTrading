import React, { useEffect, useRef } from "react";
import NavigationIcon from "@mui/icons-material/Navigation";
import MessageContent from "./message-content/MessageContent";
import MessageUserList from "./message-username/MessageUserList";
import { useState } from "react";
import s from "./popupmessage.module.scss";
import clsx from "clsx";
import { Cancel, Message, Pages, Sms } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import messageSlice, { getListUser, getTotalUnread, messageSelector } from "../../redux/messageSlice";
import moment from "moment";
import { userRole } from "../../config/constant";
import { Badge, Grid, IconButton, Popover } from "@mui/material";
import { userInfoSliceSelector } from "../../redux/userInfoSlice";


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
const PopupMessage = () => {

  const dispatch = useDispatch();

  const { role, info } = useSelector(userInfoSliceSelector);

  const [anchorEl, setAnchorEl] = useState(null);

  const audioRef = useRef(null);

  const { userList, numberUnread, numRead, currentShopIDSelect, isOpen } =
    useSelector(messageSelector);

  const [newMessage, setNewMessage] = useState(false);

  const [open, setOpen] = useState(isOpen);

  const id = open ? "popup-message" : undefined;

  const [unread, setUnread] = useState(numberUnread);

  const [message, setMessage] = useState();

  useEffect(() => {
    connect(role);
  }, [role]);

  // useEffect(() => {
  //   handleReadMessage();
  // }, [numRead]);

  useEffect( () => {
    refreshUnread();
  },[info])

  useEffect(() => {
      handleMessageArrive(message, open, currentShopIDSelect);
      handleNewMessage(" ");
  }, [message]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  //socket js
  const connect = (role) => {
    const url = process.env.REACT_APP_URL_WEBSOCKET;
    if (role === userRole.SHOP_OWNER.code || role === userRole.SHOP_STAFF.code) {
      let Sock = new SockJS(`${url}`);

      stompClient = over(Sock);
      stompClient.connect({}, onConnected, onError);
    }
  };

  const onConnected = () => {
    try {
      stompClient.subscribe(
        `/chatroom/${info.id}/shop`,
        onPrivateMessage,
        onError
      );
    } catch (error) {
      console.log(error);
    }
    console.log("Connect to channel message");
  };

  const onError = (err) => {
    console.log(err);
  };

  const onPrivateMessage = (payload) => {
    if(!newMessage) {
      const message = JSON.parse(payload.body);
      setMessage(message);
      //this line code use to check add message one time
      setNewMessage(true);
    }
  };
  // end socket

  // const refreshUnread = async () => {
  //   if (role === userRole.SHOP_OWNER.code || role === userRole.SHOP_STAFF.code) {
  //     const data = await dispatch(getListUser()); 
  //     if (data?.payload) {
  //       const numUnread =
  //         data?.payload?.lists.reduce(
  //           (accumulator, user) => accumulator + user.unread,
  //           0
  //         ) || 0;
  //       dispatch(
  //         messageSlice.actions.setNumberUnread({
  //           key: "",
  //           numberUnread: numUnread,
  //         })
  //       );
  //       setUnread(numUnread);
  //     }
  //   }
  // };
  const refreshUnread = async () => {
    if(info?.id != null) {
      const res = await dispatch(getTotalUnread());
      setUnread(res.payload?.totalUnread);
      console.log(res ,'nhin data ne')
    }
};

  const handleClick = (event) => {
    // setAnchorEl(event.currentTarget);
    setOpen(true);
    dispatch(getListUser());  
  };

  const handleClose = () => {
    // setAnchorEl(null);
    setOpen(false);
    dispatch(messageSlice.actions.setOpenPopup({ isOpen: false }));
  };
  //This function use to handle message when user get an message
  const handleMessageArrive = (message, open, currentShopIDSelect) => {
      dispatch(messageSlice.actions.increaseNumberUnread());
      const updateMessage = {
        ...message,
        date: moment(message?.date).format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
      };
      
      if (open) {
        const user = {
          userId: message.userID,
          channelId: 1,
          userName: message?.userName,
          userAvatar: message?.userAvatar ? message.userAvatar : 'https://th.bing.com/th/id/OIP.Cl56H6WgxJ8npVqyhefTdQHaHa?pid=ImgDet&rs=1',
          unread: 1,
        }
        // also need update the out side
        setUnread(numberUnread);
        // update unread in user list
        dispatch(
          messageSlice.actions.updateMessagePopoverOpenUser({
            userList: userList,
            message: updateMessage,
            currentShopIDSelect: currentShopIDSelect,
          })
        );
        dispatch(messageSlice.actions.addUserIntoUserList({user: user}));
      } else {
        setUnread(numberUnread);
      }
  };

  //this function use to reset number unread message of button CHAT NOW
  const handleReadMessage = () => {
    const newNumUnread = unread - numRead;
    dispatch(
      messageSlice.actions.setNumberUnread({
        key: "",
        numberUnread: unread - numRead,
      })
    );
    setUnread(newNumUnread);
  };
  //audio when have new message
  const handleNewMessage = (message) => {
    try {
      console.log(message);
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
  
  console.log(numberUnread, 'here is number unread');

  return (
    <>
      {(role === userRole.SHOP_OWNER.code || role === userRole.SHOP_STAFF.code) && (
        <div className={clsx(s.container)}>
          <IconButton
            onClick={handleClick}
            sx={badgeStyle.badge}
          >
              <Badge
                badgeContent={numberUnread}
                color="primary"
                sx={badgeStyle.badge}
              >
                <Sms sx={badgeStyle.icon} color="template6" />
              </Badge>
          </IconButton>
          <Popover
            id={id}
            open={open}
            // anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            disableScrollLock={true}
            PaperProps={{
              style: {
                overflow: "hidden",
              },
            }}
            className={clsx(s.popover)}
          >
            <div>
              <div className={clsx(s.warrperBtnClose)}>
                <Cancel onClick={handleClose} className={clsx(s.btnClose)} />
              </div>
              <Grid container className={clsx(s.messagecontent)}>
                <Grid item xs={4} sm={4} md={4} className={clsx(s.userList)}>
                  <MessageUserList />
                </Grid>
                <Grid item xs={8} sm={8} md={8} className={clsx(s.messageChat)}>
                  <MessageContent />
                </Grid>
              </Grid>
            </div>
          </Popover>
        </div>
      )}
    </>
  );
};

export default PopupMessage;