import { breadCrumbs, category } from "../../config/constant";
import s from "./products.module.scss";
import React, { useEffect } from "react";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";

import ProductsDataGridShop from "../../component/data-grid/products-data-grid-shop/ProductsDataGridShop";
import {
   Button,
   FormControl,
   FormControlLabel,
   InputLabel,
   MenuItem,
   OutlinedInput,
   Select,
} from "@mui/material";
import ProductShopPageController from "../../component/products-shop-page-controller/ProductShopPageController";
import { useDispatch } from "react-redux";
import { getProductTableAndPaging } from "../../redux/productsShopSlice";
let breadCrumbPath = [breadCrumbs.PRODUCTS];


export default function Products() {
   useBreadCrumb(breadCrumbPath);
   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(getProductTableAndPaging(1))
   }, []);
   return (
      <div className={s.container}>
         <div className={s.headerTable}>
            <h2>Product manager</h2>
            <ProductShopPageController/>
         </div>
         <div style={{ height: "60rem", width: "100%" }}>
            <ProductsDataGridShop />
         </div>
      </div>
   );
}
