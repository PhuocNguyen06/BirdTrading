import { Box, Button, Tab, Tabs } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import theme from "../../style/theme";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import adminPackageSlice, {
   getAdminPackageSelector,
   getAdminPackageTableSelector,
} from "../../redux/adminPackageSlice";
import { useNavigate } from "react-router-dom";
import shopOrderSlice from "../../redux/shopOrderSlice";

export default function AdminOrderPageController() {
   const { tab } = useSelector(getAdminPackageSelector);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { listSelected } = useSelector(getAdminPackageTableSelector);
   const handleChangeTab = (e, value) => {
      console.log(value, e.target);
   };
   console.log(tab);
   const handleViewListOrder = () => {
      dispatch(
         shopOrderSlice.actions.changeOrderSearchInfo({
            field: "packageOrderId",
            value: listSelected[0].id,
            operator: "=",
         })
      );
      navigate("/admin/package-order/order");
      dispatch(shopOrderSlice.actions.changeTab(2));
   };
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
               <Tabs value={tab} onChange={handleChangeTab}>
                  <Tab
                     label={"Package"}
                     value={1}
                     onClick={() => navigate("/admin/package-order")}
                  />
                  <Tab
                     label={"Orders"}
                     value={2}
                     onClick={() => navigate("/admin/package-order/order")}
                  />
               </Tabs>
            </Grid2>
            <Grid2 xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
               {tab == 1 && (
                  <Button
                     variant="outlined"
                     disabled={listSelected.length !== 1}
                     onClick={handleViewListOrder}
                  >
                     View list order
                  </Button>
               )}
            </Grid2>
         </Grid2>
      </Box>
   );
}
