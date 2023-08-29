import { useTheme } from "@emotion/react";
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
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import shopOrderSlice, {
   getOrderFilterPaging,
   getShopOrderSelector,
   getShopOrderTableSelector,
} from "../../redux/shopOrderSlice";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { modelStyle, orderStatus } from "./../../config/constant";
import { api } from "../../api/api";
import globalConfigSlice from "../../redux/globalConfigSlice";
import { getListSelectedInOrderDetailsTableSelector } from "../../redux/shopOrderDetailsSlice";

export default function ShopOrderBarController() {
   const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);
   const [openModalConfirmChangeStatus, setModelConfirmChangeStatus] =
      React.useState(null);
   const theme = useTheme();
   const { tab } = useSelector(getShopOrderSelector);
   const { listSelected, currentPage } = useSelector(getShopOrderTableSelector);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const listSelectedOrderDetails = useSelector(
      getListSelectedInOrderDetailsTableSelector
   );
   const [disabledChangeStatus, setDisabledChangeStatus] = useState({
      0: false,
      1: false,
      2: false,
   });
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };
   useEffect(() => {
      console.log(listSelected);
      if (
         !listSelected ||
         (Array.isArray(listSelected) && listSelected.length === 0)
      ) {
         setDisabledChangeStatus({
            0: true,
            1: true,
            2: true,
         });
      } else {
         console.log(listSelected, "list selecteddddddddddddddd");
         const isHasTwoStatus = listSelected.some(
            (row) => listSelected[0].orderStatus.id !== row.orderStatus.id
         );
         if (isHasTwoStatus) {
            setDisabledChangeStatus((state) => {
               return {
                  0: true,
                  1: true,
                  2: true,
               };
            });
         } else {
            const isHasPending =
               listSelected[0].orderStatus.id === orderStatus.PENDING.code;
            if (isHasPending) {
               setDisabledChangeStatus((state) => {
                  return {
                     0: true,
                     1: false,
                     2: true,
                  };
               });
            }
            const isHasProcessing =
               listSelected[0].orderStatus.id === orderStatus.PROCESSING.code;
            if (isHasProcessing) {
               setDisabledChangeStatus((state) => {
                  return {
                     0: false,
                     1: true,
                     2: false,
                  };
               });
            }
            const isHasShipped =
               listSelected[0].orderStatus.id === orderStatus.SHIPPED.code;
            if (isHasShipped) {
               setDisabledChangeStatus((state) => {
                  return {
                     0: true,
                     1: true,
                     2: true,
                  };
               });
            }
         }
      }
   }, [listSelected]);

   const handleChangeStatus = async (event) => {
      console.log(listSelected);
      try {
         const listSelectedId = listSelected.map((item) => item.id);
         const res = await api.put("/shop-owner/orders", {
            status: event.target.value,
            ids: listSelectedId,
         });
         const data = await res.data;
         console.log(data);
         dispatch(getOrderFilterPaging(currentPage));
         console.log(event.target.value);
         if (event.target.value == 2) {
            handleCloseModelConfirmStatus();
         }
         dispatch(
            globalConfigSlice.actions.changeSnackBarState({
               typeStatus: "success",
               message: "The status has been successfully changed.",
               open: true,
               title: "Success",
            })
         );
         dispatch(shopOrderSlice.actions.changeListSelectedRows([]));
      } catch (e) {
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
   const handleCloseModelConfirmStatus = () => {
      setModelConfirmChangeStatus(false);
   };
   const handleViewOrderDetails = () => {
      console.log(listSelected);
      if (listSelected.length === 1) {
         navigate(`/order/order-details/${listSelected[0].id}`);
      } else {
         console.log(listSelectedOrderDetails, " listSElected neeeeeeeeeeeee");
         navigate(
            `/order/order-details/${listSelectedOrderDetails[0].orderId}`
         );
      }
   };
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
                  label={"Order"}
                  value={1}
                  onClick={() => navigate("/order")}
               />
               <Tab
                  label={"Order details"}
                  value={2}
                  onClick={() => navigate("/order/order-details")}
               />
            </Tabs>
         </Grid2>
         <Grid2
            xs={6}
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
         >
            <Button
               variant="outlined"
               disabled={
                  listSelected &&
                  Array.isArray(listSelected) &&
                  listSelected.length !== 1 &&
                  listSelectedOrderDetails &&
                  Array.isArray(listSelectedOrderDetails) &&
                  listSelectedOrderDetails.length !== 1
               }
               onClick={handleViewOrderDetails}
            >
               View details
            </Button>
            {tab === 1 ? (
               <>
                  <Button
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
                     <MenuItem
                        onClick={handleChangeStatus}
                        disabled={disabledChangeStatus[0]}
                        value={0}
                     >
                        PENDING
                     </MenuItem>
                     <MenuItem
                        onClick={handleChangeStatus}
                        disabled={disabledChangeStatus[1]}
                        value={1}
                     >
                        PROCESSING
                     </MenuItem>
                     <MenuItem
                        disabled={disabledChangeStatus[2]}
                        onClick={() => setModelConfirmChangeStatus(true)}
                        value={2}
                     >
                        SHIPPED
                     </MenuItem>
                  </Menu>
               </>
            ) : (
               ""
            )}
            <Modal
               keepMounted
               open={
                  openModalConfirmChangeStatus
                     ? openModalConfirmChangeStatus
                     : false
               }
               onClose={handleCloseModelConfirmStatus}
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
                        Change to shipped?
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
                     <Typography sx={{ fontSize: "2rem" }}>
                        The order has been updated to "SHIPPED" and cannot be
                        reverted back to its previous status.
                     </Typography>
                     <Typography sx={{ fontSize: "2rem", color: "red" }}>
                        Are you certain that you want to change to "SHIPPED"?
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
                     <Button
                        variant="outlined"
                        onClick={() => setModelConfirmChangeStatus(false)}
                     >
                        Cancel
                     </Button>
                     <Button
                        variant="outlined"
                        onClick={handleChangeStatus}
                        value={2}
                     >
                        Save
                     </Button>
                  </Box>
               </Box>
            </Modal>
         </Grid2>
      </Grid2>
   );
}
