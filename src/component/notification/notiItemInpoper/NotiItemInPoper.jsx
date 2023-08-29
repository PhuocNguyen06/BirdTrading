import clsx from 'clsx'
import React from 'react'
import s from './notiItemInPoper.module.scss';
import { Grid } from '@mui/material';
import moment from 'moment';

const NotiItemInPoper = ({noti, index}) => {
  return (
    <div className={clsx(s.container, {[s.divider]: 0 !== index}, {[s.hightBackGround] : noti?.seen === false})}>
        <Grid container spacing={2} className={clsx(s.notiContainer)}>
          <Grid item xs={2} sm={2} md={2} className={clsx(s.notiImg)}> 
              <img src="https://bird-trading-platform.s3.ap-southeast-1.amazonaws.com/image/noti.png" alt="" />
          </Grid>
          <Grid item xs={10} sm={10} md={10} className={clsx(s.notiContent)}>
            <>
              <span >{noti?.name}</span>
              <p>{noti?.notiText}</p>
              <p className={clsx(s.notiTime)}>{moment(noti?.notiDate).format('DD/MM/YY HH:mm')}</p>
            </>
          </Grid>
        </Grid>
    </div>
  )
}

export default NotiItemInPoper
