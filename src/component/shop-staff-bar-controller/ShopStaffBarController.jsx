import { useTheme } from "@emotion/react";
import { Button, Menu, MenuItem, Tab, Tabs } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import clsx from "clsx";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import shopStaffSlice, { getShopStaffSelector, getShopStaffs } from "../../redux/shopStaffSlice";
import KeyboardArrowDownIcon  from "@mui/icons-material/KeyboardArrowDown";
import { api } from "../../api/api";
import globalConfigSlice from "../../redux/globalConfigSlice";

export default function ShopStaffBarController() {
   const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);
   const theme = useTheme();
   const { tab } = useSelector(getShopStaffSelector);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { listSelected, currentPage } = useSelector(getShopStaffSelector);

   const handleClose = () => {
      setAnchorEl(null);
   };
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleChangeStatus = async (event) => {
      try {
         const res = await api.put('/shop-owner/staffs', {
            ids: listSelected,
            status: event.target.value
         })
         const data = await res.data;
         dispatch(shopStaffSlice.actions.changeListSelectedRows([]));
         dispatch(
            globalConfigSlice.actions.changeSnackBarState({
               typeStatus: "success",
               message: "Change status successfully!",
               open: true,
               title: "Success",
            })
         );
         dispatch(getShopStaffs(currentPage))
         console.log(data);
      } catch (e) {
         dispatch(
            globalConfigSlice.actions.changeSnackBarState({
               typeStatus: "error",
               message: "Change status failure! Try again.",
               open: true,
               title: "Error",
            })
         );
         console.log(e);
      }
   }
   return (
      <Grid2
         container
         className={clsx("box-shadow")}
         sx={{
            backgroundColor: theme.palette.template5.main,
            height: "6.4rem",
            width: "100%",
            borderRadius: "0.8rem",
            padding: "0.8rem 1rem",
         }}
      >
         <Grid2 xs={6} sx={{ display: "flex", alignItems: "center" }}>
            <Tabs value={tab} aria-label="basic tabs example">
               <Tab
                  label={"Staffs"}
                  value={1}
                  onClick={() => navigate("/staff")}
               />
               <Tab
                  label={"Create staff"}
                  value={2}
                  onClick={() => navigate("/staff/create-staff")}
               />
               <Tab
                  label={"Order change log"}
                  value={3}
                  onClick={() => navigate("/staff/log-order")}
               />
            </Tabs>
         </Grid2>
         <Grid2 xs={6} sx={{ display: "flex", justifyContent: "end" }}>
            <Button
               disabled={listSelected && listSelected.length === 0}
               id="basic-button"
               aria-controls={open ? "basic-menu" : undefined}
               aria-haspopup="true"
               aria-expanded={open ? "true" : undefined}
               onClick={handleClick}
               variant="outlined"
            >
               Change status <KeyboardArrowDownIcon />
            </Button>
            <Menu
               id="basic-menu"
               anchorEl={anchorEl}
               open={open}
               onClose={handleClose}
               disableScrollLock
               MenuListProps={{
                  "aria-labelledby": "basic-button",
               }}
            >
               <MenuItem onClick={handleChangeStatus} value={1}>
                  ACTIVE
               </MenuItem>
               <MenuItem onClick={handleChangeStatus} value={-2}>
                  BANNED
               </MenuItem>
            </Menu>
         </Grid2>
      </Grid2>
   );
}
