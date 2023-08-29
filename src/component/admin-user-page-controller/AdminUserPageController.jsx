import {
   Box,
   Button,
   Menu,
   MenuItem,
   Modal,
   Tab,
   Tabs,
   Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useState } from "react";
import theme from "../../style/theme";
import clsx from "clsx";
import globalConfigSlice from "../../redux/globalConfigSlice";
import { useDispatch, useSelector } from "react-redux";
import adminUserSlice, {
   getUserSelector,
   getUserTablePagingAndFilter,
   getUserTableSelector,
} from "../../redux/adminUserSlice";
import { api } from "../../api/api";
import { modelStyle } from "./../../config/constant";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function AdminUserPageController() {
   const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);
   const [openModel, setOpenModel] = useState(false);
   const dispatch = useDispatch();
   const { listSelected, currentPage } = useSelector(getUserTableSelector);
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const {canChangeStatus} = useSelector(getUserSelector);
   const handleClose = () => {
      setAnchorEl(null);
   };
   const handleActionInRow = async (e) => {
      try {
         console.log(e.target.value);
         const res = await api.put("/admin/accounts/status", {
            ids: listSelected,
            status: e.target.value,
         });
         const data = await res.data;
         console.log(data);
         dispatch(getUserTablePagingAndFilter(currentPage));
         dispatch(adminUserSlice.actions.changeListSelectedRows([]));
         console.log(e.target.value, openModel);

         setOpenModel(false);
         dispatch(
            globalConfigSlice.actions.changeSnackBarState({
               typeStatus: "success",
               message: "The status has been successfully changed.",
               open: true,
               title: "Success",
            })
         );
      } catch (e) {
         setOpenModel(false);
         dispatch(
            globalConfigSlice.actions.changeSnackBarState({
               type: "error",
               message:
                  "Sorry, your action cannot be completed at the moment. Please try again.",
               open: true,
               title: "Error",
            })
         );
         console.log(e);
      }
   };
   const handleCloseModelDelete = () => {
      setOpenModel(false);
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
               <Tabs value={1}>
                  <Tab label={"User"} value={1} />
               </Tabs>
            </Grid2>
            <Grid2 xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
               <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  variant="outlined"
                  disabled={listSelected.length === 0 || canChangeStatus}
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
                  <MenuItem onClick={() => setOpenModel(true)} value={-2}>
                     Ban
                  </MenuItem>
                  <MenuItem onClick={handleActionInRow} value={1}>
                     Unban
                  </MenuItem>
               </Menu>
            </Grid2>
         </Grid2>
         <Modal
            keepMounted
            open={openModel}
            onClose={handleCloseModelDelete}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
         >
            <Box
               sx={{
                  backgroundColor: theme.palette.template5.main,
                  ...modelStyle,
               }}
            >
               <Box
                  sx={{
                     backgroundColor: theme.palette.template5.contrastText,
                     padding: "1rem 2rem",
                  }}
               >
                  <Typography
                     sx={{ color: theme.palette.template4.main }}
                     variant="h4"
                  >
                     Enforce user ban?
                  </Typography>
               </Box>
               <Box
                  sx={{
                     padding: "1rem 2rem",
                     display: "flex",
                     flexDirection: "column",
                     gap: 1,
                  }}
               >
                  <Typography sx={{ fontSize: "2rem" }}></Typography>
                  <Typography sx={{ fontSize: "2rem", color: "red" }}>
                     Are you certain that you want to ban user?
                  </Typography>
               </Box>
               <Box
                  sx={{
                     display: "flex",
                     justifyContent: "end",
                     gap: 1,
                     padding: 1,
                  }}
               >
                  <Button variant="outlined" onClick={handleCloseModelDelete}>
                     Cancel
                  </Button>
                  <Button
                     variant="outlined"
                     onClick={handleActionInRow}
                     value={-2}
                  >
                     Ban
                  </Button>
               </Box>
            </Box>
         </Modal>
      </Box>
   );
}
