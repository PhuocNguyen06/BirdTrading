import { Box, Divider } from "@mui/material";
import s from "./sideBar.module.scss";
import React from "react";
import clsx from "clsx";
import MenuItem from "../../component/menu-item/MenuItem";
import { typeMenu } from "./../../redux/sideBarSlice";
import { useDispatch, useSelector } from "react-redux";
import userInfoSlice, {
   userInfoSliceSelector,
   userRoleSelector,
} from "../../redux/userInfoSlice";
import { api } from "../../api/api";

export default function SideBar() {
   const userInfo = useSelector(userInfoSliceSelector);
   const role = useSelector(userRoleSelector);
   const dispatch = useDispatch();
   console.log(userInfo);
   const handleLogout = () => {
      let token = localStorage.getItem("token");
      try {
         if (role === 3) {
            dispatch(userInfoSlice.actions.resetState());

            console.log(token);
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            window.location.href = `${process.env.REACT_APP_REDIRECT_USER}get-token?token=${token}`;
         } else {
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            dispatch(userInfoSlice.actions.resetState());
            window.location.href = `${process.env.REACT_APP_REDIRECT_USER}login`;
         }
         // Redirect to the desired page
      } catch (e) {
         window.location.href = `${process.env.REACT_APP_REDIRECT_USER}get-token?token=${token}`;
         const error = e.response.data;
         if (error.errorCode === "400") {
         }
         console.log(e);
      }
   };
   console.log(role, "rrrrrroleeeeeeeeeeeeeeeeeeee");
   return (
      <div className={clsx(s.container, "box-shadow")}>
         <div className={s.adminInfo}>
            <div className={s.image}>
               <img
                  src={
                     role === 3
                        ? userInfo.info?.avatarImgUrl
                        : userInfo.info?.imgUrl
                  }
                  alt=""
               />
            </div>
            <div className={s.name}>
               <span>
                  {role === 3
                     ? userInfo.info?.shopName
                     : userInfo.info?.fullName}
               </span>
            </div>
         </div>
         <div className={s.controls}>
            {role === 2 && (
               <>
                  <div className={s.controlTasks}>
                     <MenuItem type={typeMenu.ORDERS} />
                  </div>
                  <div className={s.controlAccount}>
                     <MenuItem type={typeMenu.LOGOUT} logout={handleLogout} />
                  </div>
               </>
            )}
            {role === 3 && (
               <>
                  <div className={s.controlTasks}>
                     <MenuItem type={typeMenu.DASHBOARD} />
                     <MenuItem type={typeMenu.PRODUCTS} />
                     <MenuItem type={typeMenu.ORDERS} />
                     <MenuItem type={typeMenu.STAFF} />
                     <MenuItem type={typeMenu.REVIEW} />
                     <MenuItem type={typeMenu.REPORT} />
                  </div>
                  <div className={s.controlSetting}>
                     <MenuItem type={typeMenu.SUPPORT} />
                     <MenuItem type={typeMenu.SETTING} />
                  </div>
                  <div className={s.controlAccount}>
                     <MenuItem type={typeMenu.LOGOUT} logout={handleLogout} />
                  </div>
               </>
            )}
            {role === 4 && (
               <>
                  <div className={s.controlTasks}>
                     <MenuItem type={typeMenu.ADMIN_DASHBOARD} />
                     <MenuItem type={typeMenu.ADMIN_PRODUCTS} />
                     <MenuItem type={typeMenu.ADMIN_PACKAGE} />
                     <MenuItem type={typeMenu.ADMIN_SHOP_OWNER} />
                     <MenuItem type={typeMenu.ADMIN_USER} />
                     <MenuItem type={typeMenu.ADMIN_PROMOTION} />
                  </div>
                  <div className={s.controlAccount}>
                     <MenuItem type={typeMenu.LOGOUT} logout={handleLogout} />
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
