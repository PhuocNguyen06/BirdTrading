import React from "react";
import { breadCrumbs, userRole } from "../../config/constant";
import useAuthenticate from "../../custom-hook/useAuthenticate";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import { Box, Typography } from "@mui/material";

import AdminOrderTable from "../../component/admin-order-table/AdminOrderTable";
import AdminOrderPageController from "../../component/admin-order-page-controller/AdminOrderPageController";
import { Outlet } from "react-router-dom";

const breadCrumbsPath = [breadCrumbs.ADMIN_PACKAGE];
const roles = [userRole.ADMIN];
export default function AdminOrderPage() {
   useAuthenticate(roles);
   useBreadCrumb(breadCrumbsPath);
   return (
      <Box width={"100%"}>
         <Box mt={4} mb={2}>
            <Typography variant="h4" color={"delivery.contrastText"}>
               Admin order manager
            </Typography>
         </Box>
         <AdminOrderPageController />
         <Box mt={2}>
            <Outlet />
         </Box>
      </Box>
   );
}
