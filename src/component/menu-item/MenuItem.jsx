import s from "./menuItem.module.scss";
import React from "react";

import { Button } from "@mui/material";
import clsx from "clsx";
import sideBarSlice, {
   getCurrentActiveSelector,
} from "../../redux/sideBarSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MenuItem({ children, type, logout }) {
   const currentActive = useSelector(getCurrentActiveSelector);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const handleOnClick = () => {
      if (type.id === 9) {
         logout();
      } else {
         dispatch(sideBarSlice.actions.changeCurrentActive(type.id));
         navigate(type.url);
      }
   };
   return (
      <>
         <Button
            className={clsx(s.container, {
               [s.active]: currentActive === type.id,
            })}
            fullWidth
            color="template6"
            onClick={handleOnClick}
         >
            <div className={s.icon}>{type.Icon}</div>
            <div className={s.title}>
               <span>{type.title}</span>
            </div>
         </Button>
      </>
   );
}
