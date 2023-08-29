import s from "./shopStaffPage.module.scss";
import React from "react";
import { Outlet } from "react-router-dom";
import { breadCrumbs } from "../../config/constant";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import ShopStaffBarController from "../../component/shop-staff-bar-controller/ShopStaffBarController";
let breadCrumbPath = [breadCrumbs.STAFF];
export default function ShopStaffPage() {
   useBreadCrumb(breadCrumbPath);

   return (
      <div className={s.container}>
         <div className={s.headerTable}>
            <h2>Staff manager</h2>
            <ShopStaffBarController />
         </div>
         
         <div style={{ height: "60rem", width: "100%" }}>
            <Outlet />
         </div>
      </div>
   );
}
