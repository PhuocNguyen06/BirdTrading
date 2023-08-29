import React from "react";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import { breadCrumbs } from "../../config/constant";
import s from "./shopOrderPage.module.scss";
import ShopOrderBarController from "../../component/shop-order-bar-controller/ShopOrderBarController";
import { Outlet } from "react-router-dom";
let breadCrumbPath = [breadCrumbs.ORDER];

export default function ShopOrderPage() {
   useBreadCrumb(breadCrumbPath);

   return (
      <div className={s.container}>
         <div className={s.headerTable}>
            <h2>Order manager</h2>
            <ShopOrderBarController />
         </div>
         <div style={{ height: "60rem", width: "100%" }}>
            <Outlet />
         </div>
      </div>
   ); 
}
