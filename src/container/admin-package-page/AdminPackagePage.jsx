import React from "react";
import { breadCrumbs, userRole } from "../../config/constant";
import useAuthenticate from "../../custom-hook/useAuthenticate";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import { Box, Typography } from "@mui/material";
import AdminPackageTable from "../../component/admin-package-table/AdminPackageTable";
import AdminPackagePageController from "../../component/admin-package-page-controller/AdminPackagePageController";

const breadCrumbsPath = [breadCrumbs.ADMIN_USER];
const roles = [userRole.ADMIN];
export default function AdminPackagePage() {
   useAuthenticate(roles);
   useBreadCrumb(breadCrumbsPath);
   return (
      <Box width={"100%"}>
         <Box mt={4} mb={2}>
            <Typography variant="h4" color={"delivery.contrastText"}>
               Admin package manager
            </Typography>
         </Box>
         <AdminPackagePageController />
         <Box mt={2}>
            <AdminPackageTable />
         </Box>
      </Box>
   );
}
