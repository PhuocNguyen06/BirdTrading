import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { userInfoSliceSelector } from "../../redux/userInfoSlice";

export default function HandleBanned() {
   const params = new URLSearchParams(window.location.search); // id=123
   const { role } = useSelector(userInfoSliceSelector);
   useEffect(() => {
      if (role === 2) {
         window.location.href = `${process.env.REACT_APP_REDIRECT_USER}login?error=4`;
      } else if (role === 3) {
         window.location.href = `${process.env.REACT_APP_REDIRECT_USER}login?error=5`;
      }
   }, []);
   return <div>HandleBanened</div>;
}
