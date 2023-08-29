import clsx from "clsx";
import s from "./headerContainer.module.scss";
import React from "react";
import SearchBar from "../../component/search/SearchBar";
import { Badge, IconButton } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SmsIcon from "@mui/icons-material/Sms";
import theme from "../../style/theme";
import PopupMessage from "../../component/message/PopupMessage";
import NotiItemsPopper from "../../component/notification/NotiItemsPopper";
const badgeStyle = {
   badge: {
      "& .MuiBadge-badge": {
         fontSize: "1.2rem",
         height: "1.6rem",
         minWidth: "1.6rem",
      },
   },
   icon: {
      fontSize: "3rem",
      "&:hover": {
         cursor: "pointer",
      },
   },
};
export default function HeaderContainer() {
   return (
      <>
         <div className={clsx(s.container, "box-shadow")}>
            <div className={s.right}>
               <div className={s.logo}>
                  <img
                     src="https://bird-trading-platform.s3.ap-southeast-1.amazonaws.com/assetImage/asset/Beige_Vintage_Elegant_Illustration_Bird_Logo_4.png"
                     alt=""
                  />
               </div>
               <div className={s.shopName}>Bird Land 2nd</div>
            </div>
            <div className={s.left}>
               <div style={{ marginRight: "1rem" }}>
                  <SearchBar />
               </div>
               <div className={s.iconContainer}>
                  {/* <IconButton>
                     <Badge
                        badgeContent={4}
                        color="primary"
                        sx={badgeStyle.badge}
                     >
                        <EmailIcon sx={badgeStyle.icon} color="template6" />
                     </Badge>
                  </IconButton> */}
                  {/* <IconButton>
                     <Badge
                        badgeContent={4}
                        color="primary"
                        sx={badgeStyle.badge}
                     >
                        <NotificationsIcon
                           sx={badgeStyle.icon}
                           color="template6"
                        />
                     </Badge>
                  </IconButton> */}
                  <NotiItemsPopper />
                  <PopupMessage />
               </div>
            </div>
         </div>
         <div className={clsx(s.gap)}></div>
      </>
   );
}
