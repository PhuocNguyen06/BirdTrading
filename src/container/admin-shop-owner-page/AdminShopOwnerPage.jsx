import React from "react";
import { breadCrumbs, userRole } from "../../config/constant";
import useAuthenticate from "../../custom-hook/useAuthenticate";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import { Box, Typography } from "@mui/material";
import AdminShopOwnerPageController from "../../component/admin-shop-owner-page-controller/AdminShopOwnerPageController";
import AdminShopOwnerTable from "../../component/admin-shop-owner-table/AdminShopOwnerTable";

const breadCrumbsPath = [breadCrumbs.ADMIN_SHOP_OWNER];
const roles = [userRole.ADMIN];
export default function AdminShopOwnerPage() {
   useAuthenticate(roles);
   useBreadCrumb(breadCrumbsPath);
   return (
      <Box width={"100%"}>
         <Box mt={4} mb={2}>
            <Typography variant="h4" color={"delivery.contrastText"}>
               Admin shop owner manager
            </Typography>
         </Box>
         <AdminShopOwnerPageController />
         <Box mt={2}>
            <AdminShopOwnerTable />
         </Box>
      </Box>
   );
}
