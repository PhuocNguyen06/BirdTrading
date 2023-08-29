import { useDispatch } from "react-redux";
import MenuItem, { typeMenu } from "../../component/menu-item/MenuItem";
import { breadCrumbs } from "../../config/constant";
import s from "./dashBoard.module.scss";
import React, { useEffect, useState } from "react";
import sideBarSlice from "../../redux/sideBarSlice";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createFakeServer, useDemoData } from "@mui/x-data-grid-generator";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import { Select } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import SummaryTotalShop from "../../component/summary-total-shop/SummaryTotalShop";
import StaticsTrendingProducts from "../../component/statics-trending-products-shop/StaticsTrendingProducts";
import StaticsPriceByCategory from "../../component/statics-price-category-pie-chart-shop/StaticsPriceByCategory";
import { api } from "../../api/api";
import { data } from "./../../component/chart/summary-chart/mock";

let breadCrumbPath = [breadCrumbs.DASH_BOARD];

export default function DashBoard() {
   useBreadCrumb(breadCrumbPath);
   const [priceBarDataShop, setPriceBarDataShop] = useState();
   const [orderBarDataShop, setOrderBarDataShop] = useState();
   const [reviewBarDataSHop, setReviewBarDataSHop] = useState();
   useEffect(() => {
      getBarData();
   }, []);
   const getBarData = async () => {
      try {
         const [res, res2, res3] = await Promise.all([
            api.get("/shop-owner/bar-chart/price"),
            api.get("/shop-owner/bar-chart/order"),
            api.get("/shop-owner/bar-chart/review"),
         ]);
         const [data, data2, data3] = await Promise.all([
            res.data,
            res2.data,
            res3.data,
         ]);
         console.log(data, data2, data3, 'dataaaaaaaaaaaaaaaaaaaaaaaaaaaa');
         setPriceBarDataShop(data);
         setOrderBarDataShop(data2);
         setReviewBarDataSHop(data3);
      } catch (e) {
         console.error(e);
      }
   };
   return (
      <div className={s.container}>
         <div className={s.summaryTotal}>
            <Grid2 container padding={0} spacing={"3rem"}>
               <Grid2 xs={4}>
                  <SummaryTotalShop data={orderBarDataShop} type="order" />
               </Grid2>
               <Grid2 xs={4}>
                  <SummaryTotalShop data={priceBarDataShop} type="revenue" />
               </Grid2>
               <Grid2 xs={4}>
                  <SummaryTotalShop data={reviewBarDataSHop} type="review" />
               </Grid2>
            </Grid2>
         </div>
         <div className={s.chart}>
            <Grid2 container padding={0} spacing={"3rem"} height={"100%"}>
               <Grid2 xs={7}>
                  <StaticsTrendingProducts />
               </Grid2>
               <Grid2 xs={5}>
                  <StaticsPriceByCategory />
               </Grid2>
            </Grid2>
         </div>
      </div>
   );
}
