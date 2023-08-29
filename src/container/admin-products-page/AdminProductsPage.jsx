import React from "react";
import { breadCrumbs, userRole } from "../../config/constant";
import useAuthenticate from "../../custom-hook/useAuthenticate";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import { Box, Typography } from "@mui/material";
import AdminProductsPageController from "../../component/admin-products-page-controller/AdminProductsPageController";
import AdminProductsTable from "../../component/admin-product-table/AdminProductsTable";
import AdminPromotionTable from "../../component/admin-promotion-table/AdminPromotionTable";

const breadCrumbsPath = [breadCrumbs.ADMIN_PRODUCTS];
const roles = [userRole.ADMIN];
export default function AdminProductsPage() {
   useAuthenticate(roles);
   useBreadCrumb(breadCrumbsPath);
   return (
      <Box width={"100%"}>
         <Box mt={4} mb={2}>
            <Typography variant="h4" color={"delivery.contrastText"}>
               Admin product manager
            </Typography>
         </Box>
         <AdminProductsPageController />
         <Box mt={2}>
            <AdminProductsTable />
         </Box>
      </Box>
   );
}
