import { Box, Typography } from "@mui/material";
import React from "react";
import AdminPieChart from "./../admin-pie-chart/AdminPieChart";
import theme from "../../style/theme";
import clsx from "clsx";
const boxStyle = {
   backgroundColor: theme.palette.template5.main,
   borderRadius: "0.8rem",
};
export default function AdminRankShopPieChart({ data }) {
   return (
      <Box sx={{ ...boxStyle, padding: "1rem"  }} className={clsx("box-shadow")}>
         <Typography variant="h5" sx={{ textAlign: "center"}}>
            The weekly shop revenue in this week
         </Typography>
         <Box width={"100%"} height={"40rem"}>
            {data ? <AdminPieChart data={data} /> : <></>}
         </Box>
      </Box>
   );
}
