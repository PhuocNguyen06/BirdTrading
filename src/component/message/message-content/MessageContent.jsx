import { Send } from '@mui/icons-material'
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Input } from '@mui/material'
import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import s from './messageContent.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import messageSlice, { getListMessageOlder, messageSelector, sendMessage } from '../../../redux/messageSlice';
import { userInfoSliceSelector } from '../../../redux/userInfoSlice';
import moment from 'moment';
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import theme from '../../../style/theme'

const SENDER_NAME = {
  USER: 'user',
  SHOP: 'shop'
}

const MESSAGE_SATUS = {
  SEND: 'send'
}

const MessageContent = () => {
  const containerRef = useRef(null);

  const divRef = useRef(null);

  const {messageList, currentShopIDSelect, userList, unread} = useSelector(messageSelector)

  const {info} = useSelector(userInfoSliceSelector)

  const currentDate = moment().format('YYYY-MM-DD');

  const dispatch  = useDispatch()

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect( () => {
    scrollToBottom();
  },[messageList.messageListData])

  //handle scroll
  // useEffect(() => {
  //   const handleScroll = () => {
  //     // Handle the scroll event on the specific div
  //     console.log('User scrolled on the div');
  //   };

  //   const divElement = containerRef.current;

  //   // Add the scroll event listener to the div element
  //   divElement.addEventListener('scroll', handleScroll);

  //   // Clean up the event listener on component unmount
  //   return () => {
  //     divElement.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  const scrollToBottom = () => {
    if(currentShopIDSelect !== -1) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  //validation
  const handleSendMessage = (values, { resetForm }) => {
    const uni = moment().format('x');
    const updatedValues = {
      ...values,
      id: uni,
      date: moment().format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'),
      userID: currentShopIDSelect,
    }; 
    resetForm();
    dispatch(messageSlice.actions.addMessage({  message: updatedValues }));
    dispatch(sendMessage(updatedValues));
    dispatch(messageSlice.actions.setReadMessage({userList: userList, id: currentShopIDSelect})); 
    const user = {
      userId: currentShopIDSelect
    };
    dispatch(messageSlice.actions.addUserIntoUserList({user: user}))
  };

  const validationSchema = Yup.object( {
    content: Yup.string()
        .min(1, "PLease enter message!")
        .max(1000, "Message is to long")
        .required("Need to be write some thing")
  });

  const showMoreOlderMessage = async () => {
    dispatch(messageSlice.actions.changeCurretNumberMessagePaing({number: 1}));
    const data = await dispatch(getListMessageOlder(currentShopIDSelect));
    console.log(data, "data ne")
    dispatch(messageSlice.actions.updateListMessage({lists: data?.payload?.lists}))
  }

  return (
    <> 
      {currentShopIDSelect !== -1 && 
      <div className={clsx(s.container)}>
          <span className={clsx(s.shopName)}>
            {userList?.find(item => item.userId === currentShopIDSelect)?.userName || <>User name</>}
          </span>
        
          <div className={clsx(s.messageContent)}>
              <ul className={clsx(s.messageList)} ref={containerRef}>
                {messageList?.totalPage > 1 &&
                 (messageList?.totalPage - 1 !== messageList.currentPageNumber) &&
                  <Button sx={{textAlign: 'center',
                  width: '100%',
                  fontFamily: 'Segoe UI, Roboto, Oxygen',
                  color: theme.palette.template3.main,
                  backgroundColor: theme.palette.table.main,
                  '&:hover': {
                    color: theme.palette.table.main, 
                    backgroundColor: theme.palette.template3.main
                  }
                  }}
                  onClick={showMoreOlderMessage}
                  >
                  View more
                  </Button>
                }
                  <div className={clsx(s.messagecontainer)}>
                    {messageList.messageListData?.map(item => (
                    <li className={item.shopID != info.id ? clsx(s.messageItem) : clsx(s.messageItemSelf)} key={item.id}>
                      <div className={clsx(s.messageData)}>                    
                        {item.content}
                        <span className={clsx(s.messageTime)}>
                          {moment(currentDate).isSameOrBefore(moment(item.date, 'YYYY-MM-DD'))
                            ? moment(item.date).format('LT') 
                            : moment(item.date).format('DD/MM/YYYY') 
                          }
                        </span>
                      </div>
                    </li>
                    ))}    
                  </div>        
              </ul>
          </div>
          {/* <div > */}
          <Formik initialValues={{
            date: 0,
            senderName: SENDER_NAME.SHOP,
            shopID: info.id,
            userID: currentShopIDSelect,
            status: MESSAGE_SATUS.SEND,
            content: '',
            id: 0,
              }}
                  // enableReinitialize = {true}
            validationSchema ={validationSchema}
            validateOnChange = {true}
            validateOnBlur = {true}
            onSubmit={handleSendMessage}
            >
                  
            {
              ({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <Form className={clsx(s.wrapperInputSend)} autoComplete="off">
                  <div className={clsx(s.inputBox)}>
                      <Input className={clsx(s.inputSend)} placeholder='Enter message here'
                        name='content'
                        type='text'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.content}
                        autoComplete="off"
                      />
                    </div>
                    <Button type='submit' disabled={currentShopIDSelect === 0} ><Send className={clsx(s.sendIcon)}></Send></Button>
                </Form>
              )}
          </Formik>
          {/* </div> */}
      </div>}
    </>
  )
}

export default MessageContent
