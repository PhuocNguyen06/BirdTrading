import React from "react";
import { breadCrumbs, userRole } from "../../config/constant";
import useAuthenticate from "../../custom-hook/useAuthenticate";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import { Box, Typography } from "@mui/material";
import AdminUserPageController from "../../component/admin-user-page-controller/AdminUserPageController";
import AdminUserTable from "../../component/admin-user-table/AdminUserTable";

const breadCrumbsPath = [breadCrumbs.ADMIN_USER];
const roles = [userRole.ADMIN];
export default function AdminOrderPage() {
   useAuthenticate(roles);
   useBreadCrumb(breadCrumbsPath);
   return (
      <Box width={"100%"}>
         <Box mt={4} mb={2}>
            <Typography variant="h4" color={"delivery.contrastText"}>
               Admin user manager
            </Typography>
         </Box>
         <AdminUserPageController />
         <Box mt={2}>
            <AdminUserTable />
         </Box>
      </Box>
   );
}
