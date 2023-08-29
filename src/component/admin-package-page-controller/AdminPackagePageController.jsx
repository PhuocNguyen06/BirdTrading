import { Box, Tab, Tabs } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import theme from "../../style/theme";
import clsx from "clsx";

export default function AdminPackagePageController() {
   return (
      <Box width={"100%"}>
         <Grid2
            sx={{
               backgroundColor: theme.palette.template5.main,
               height: "6.4rem",
               width: "100%",
               borderRadius: "0.8rem",
               padding: "0.8rem 1rem",
            }}
            className={clsx("box-shadow")}
            container
         >
            <Grid2 xs={6}>
               <Tabs value={1}>
                  <Tab label={"Package"} value={1} />
               </Tabs>
            </Grid2>
            <Grid2 xs={6}>
            </Grid2>
         </Grid2>
      </Box>
   );
}
