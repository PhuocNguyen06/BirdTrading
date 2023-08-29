import React, { useEffect, useState } from "react";
import useAuthenticate from "../../custom-hook/useAuthenticate";
import { breadCrumbs, userRole } from "../../config/constant";
import { Box } from "@mui/material";
import { api } from "../../api/api";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import AdminRankShopBumpChart from "../../component/admin-rank-shop-bump-chart/AdminRankShopBumpChart";
import AdminRankShopPieChart from "../../component/admin-rank-shop-pie-chart/AdminRankShopPieChart";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
const roles = [userRole.ADMIN];
const breadCrumbsPath = [breadCrumbs.ADMIN_DASH_BOARD]
export default function AdminDashboard() {
   useAuthenticate(roles);
   useBreadCrumb(breadCrumbsPath);
   const [bumpChartData, setBumpChartData] = useState();
   const [pieChartData, setPieChartData] = useState();
   useEffect(() => {
      getChartData();
   }, []);
   const getChartData = async () => {
      try {
         const [bumpChartRes, pieChartRes] = await Promise.all([
            api.get(`/admin/bump-chart`),
            api.get(`/admin/pie-chart`),
         ]);
         const [bumpChartData, pieChartData] = await Promise.all([
            bumpChartRes.data,
            pieChartRes.data,
         ]);
         setBumpChartData(bumpChartData);
         setPieChartData(pieChartData);
         console.log(bumpChartData);
         console.log(pieChartData);
      } catch (e) {
         console.log(e);
      }
   };
   return (
      <Box  width={'100%'} pt={4}>
         <Grid2 container spacing={4}>
            <Grid2 xs={7}>
               <AdminRankShopBumpChart data={bumpChartData}/>
            </Grid2>
            <Grid2 xs={5}>
               <AdminRankShopPieChart data={pieChartData}/>
            </Grid2>
         </Grid2>
      </Box>
   );
}
