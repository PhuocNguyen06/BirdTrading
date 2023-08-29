import { useSelector } from "react-redux";
import s from "./myBreadCrumb.module.scss";

import React from "react";
import { getBreadCrumbSelector } from "../../redux/sideBarSlice";
import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { v4 } from "uuid";
let CustomBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
   // Add your desired styles here]
   "& .MuiBreadcrumbs-separator": {
      fontSize: "1.6rem", // Adjust the font size as per your requirement
   },
}));
export default function MyBreadCrumb() {

   let breadCrumbs = useSelector(getBreadCrumbSelector);
   return (
      <div className={s.container}>
         <CustomBreadcrumbs>
            {breadCrumbs
               ? breadCrumbs?.map((breadCrumb, i, list) => {
                    if (i === list.length - 1) {
                       return (
                          <Typography
                             key={v4()}
                             color={"template3.contrastText"}
                             variant="h6"
                          >
                             {breadCrumb.name}
                          </Typography>
                       );
                    } else {
                       return (
                          <Link to={breadCrumb.url} key={v4()}>
                             {breadCrumb.name}
                          </Link>
                       );
                    }
                 })
               : ""}
         </CustomBreadcrumbs>
      </div>
   );
}
