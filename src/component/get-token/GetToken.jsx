import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { useDispatch } from "react-redux";
import userInfoSlice from "../../redux/userInfoSlice";
import { userRole } from "../../config/constant";
import globalSlice from "../../redux/globalConfigSlice";
import globalConfigSlice from "../../redux/globalConfigSlice";
import { Skeleton } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export default function GetToken() {
   const location = useLocation();
   console.log(location);
   const params = new URLSearchParams(window.location.search);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   useEffect(() => {
      getToken();
   }, []);
   const getToken = () => {
      const token = params.get("token");
      const role = params.get("role");
      if (role == 2) {
         console.log("stafffffffffffffffffffffffffffffffffffffffffffffffff");
         localStorage.setItem("token", token);
         getStaffInfo(token);
      }
      if (!role) {
         console.log("shopownerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
         localStorage.setItem("token", token);
         getShopOwnerInfo();
      }
      if (role == 4) {
         console.log("adminnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
         localStorage.setItem("token", token);
         getAdminInfo(token);
      }
   };
   const getAdminInfo = async (token) => {
      try {
         const res = await api.get(`info?token=${token}`);
         const data = await res.data;
         console.log(data, "dataaaaaaaaaaaaaaaaaaaaaaaa");
         localStorage.setItem("token", data.token.accessToken);
         dispatch(
            userInfoSlice.actions.changeUserInfo({
               role: data.role,
               info: data.userInfo,
            })
         );
         console.log(data);
         navigate("/admin");
      } catch (err) {
         console.log(err);
      }
   };
   const getStaffInfo = async (token) => {
      try {
         const res = await api.get(`info?token=${token}`);
         const data = await res.data;
         localStorage.setItem("token", data.token.accessToken);
         console.log(data, "dataaaaaaaaaaaaaaaaaaaaaaaa");
         const role = userRole.SHOP_OWNER.code;
         dispatch(
            userInfoSlice.actions.changeUserInfo({
               role: data.role,
               info: data.userInfo,
            })
         );
         navigate("/order");
      } catch (e) {
         console.log(e);
      }
   };
   const getShopOwnerInfo = async () => {
      try {
         const res = await api.get("/shop-owner/profile");
         const data = res.data;

         console.log(data, "dataaaaaaaaaaaaaaaaaaaaaaaa");
         const role = userRole.SHOP_OWNER.code;
         dispatch(
            userInfoSlice.actions.changeUserInfo({
               role: data.role,
               info: data,
            })
         );
         navigate("/");
      } catch (e) {
         console.log(e);
      }
   };
   return (
      <>
         <Grid2 container spacing={4} width={"100%"}>
            <Grid2 xs={4}>
               <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </Grid2>
            <Grid2 xs={4}>
               <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </Grid2>
            <Grid2 xs={4}>
               <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </Grid2>
            <Grid2 xs={6}>
               <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </Grid2>
            <Grid2 xs={6}>
               <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </Grid2>
         </Grid2>
      </>
   );
}
