import { Box, Typography } from "@mui/material";
import React from "react";
import AdminPromotionController from "../../component/admin-promotion-controller/AdminPromotionController";
import AdminPromotionTable from "../../component/admin-promotion-table/AdminPromotionTable";
import useAuthenticate from "../../custom-hook/useAuthenticate";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import { breadCrumbs, userRole } from "../../config/constant";
const breadCrumbsPath = [breadCrumbs.ADMIN_PROMOTION];
const roles = [userRole.ADMIN];
export default function AdminPromotion() {
   useAuthenticate(roles);
   useBreadCrumb(breadCrumbsPath);
   return (
      <Box width={"100%"}>
         <Box mt={4} mb={2}>
            <Typography variant="h4" color={"delivery.contrastText"}>
               Admin promotion manager
            </Typography>
         </Box>
         <AdminPromotionController />
         <Box mt={2}>
            <AdminPromotionTable />
         </Box>
      </Box>
   );
}
