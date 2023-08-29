import clsx from "clsx";
import s from "./productShopPageController.module.scss";
import React, { useEffect, useState } from "react";
import {
   Box,
   Button,
   ButtonGroup,
   FormControl,
   InputLabel,
   Menu,
   MenuItem,
   Modal,
   OutlinedInput,
   Select,
   Tab,
   Tabs,
   Typography,
} from "@mui/material";
import CustomSelect from "../select-custom/CustomSelect";
import { useNavigate } from "react-router-dom";
import { CATEGORY, breadCrumbs, category } from "../../config/constant";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useDispatch, useSelector } from "react-redux";
import productShopSlice, {
   getProductTableAndPaging,
   productTableSelector,
} from "../../redux/productsShopSlice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { GridRowModes } from "@mui/x-data-grid";
import { api } from "../../api/api";
import theme from "../../style/theme";
import { modelStyle } from "./../../config/constant";
import globalConfigSlice from "../../redux/globalConfigSlice";
import FormCreatePromotion from "../form-create-promotion/FormCreatePromotion";

const MenuProps = {
   disableScrollLock: true,

   PaperProps: {
      style: {
         maxHeight: "15rem",
         color: "red",
         fontSize: "2rem",
      },
   },
};
const selectStyle = {
   fontSize: "1.3rem",
};
export default function ProductShopPageController() {
   const [anchorEl, setAnchorEl] = React.useState(null);
   const [anchorElCreateMenu, setAnchorElCreateMenu] = React.useState(null);
   const open = Boolean(anchorEl);
   const openCreateMenu = Boolean(anchorElCreateMenu);
   const [openModel, setOpenModel] = useState(false);
   const [deleteProducts, setDeleteProducts] = useState("");
   const [openPromotionModal, setOpenPromotionModal] = useState(false);
   const { type, listSelected, mode, currentPage } =
      useSelector(productTableSelector);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const handleCloseFormCreatePromotion = () => {
      setOpenPromotionModal(false);
   }
   const handleClickCreateMenu = (event) => {
      setAnchorElCreateMenu(event.currentTarget);
   };
   const handleCloseCreateMenu = () => {
      setAnchorElCreateMenu(null);
   };
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };
   const handleCloseModelDelete = () => {
      setOpenModel(false);
   };
   const handleTabValueChange = (e, value) => {
      const cate = Object.values(category).find((cate) => cate.id === value);
      dispatch(productShopSlice.actions.changeTab(cate));
   };
   useEffect(() => {
      let active = true;
      if (active) {
         dispatch(getProductTableAndPaging(1));
      }
      return () => {
         active = false;
      };
   }, [type]);
   const handleActionInRow = async (e) => {
      try {
         console.log(e.target.value);
         const res = await api.put("/shop-owner/products/status", {
            ids: listSelected,
            status: e.target.value,
         });
         const data = await res.data;
         console.log(data);
         dispatch(getProductTableAndPaging(currentPage));
         dispatch(productShopSlice.actions.changeListSelectedRows([]));
         console.log(e.target.value, openModel);
         if (e.target.value == -1) {
            console.log(e.target.value, openModel);
            setOpenModel(false);
         }
         dispatch(
            globalConfigSlice.actions.changeSnackBarState({
               typeStatus: "success",
               message: "The status has been successfully changed.",
               open: true,
               title: "Success",
            })
         );
      } catch (e) {
         console.log(e);
         const status = await e.response
         if(status.status === 409){
            dispatch(
               globalConfigSlice.actions.changeSnackBarState({
                  typeStatus: "error",
                  message:
                     "You must complete all the orders listed for deleting products.",
                  open: true,
                  title: "Error",
               })
            );
         } else {
            dispatch(
               globalConfigSlice.actions.changeSnackBarState({
                  typeStatus: "error",
                  message:
                     "Sorry, your action cannot be completed at the moment. Please try again.",
                  open: true,
                  title: "Error",
               })
            );
         }
         
         console.log(e);
      }
   };

   const handleChangeToEditMode = () => {
      const newRowModeModel = listSelected.reduce((acc, id) => {
         return { ...acc, [id]: { mode: GridRowModes.Edit } };
      }, {});
      dispatch(productShopSlice.actions.changeRowsModeModel(newRowModeModel));
      dispatch(productShopSlice.actions.changeTableMode("edit"));
   };
   const handleSaveMode = () => {
      const newRowModeModel = listSelected.reduce((acc, id) => {
         return { ...acc, [id]: { mode: GridRowModes.View } };
      }, {});
      dispatch(productShopSlice.actions.changeRowsModeModel(newRowModeModel));
      dispatch(productShopSlice.actions.changeTableMode("view"));
      dispatch(productShopSlice.actions.changeListSelectedRows([]));
   };

   const handleCancelMode = () => {
      const newRowModeModel = listSelected.reduce((acc, id) => {
         return {
            ...acc,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
         };
      }, {})
      dispatch(productShopSlice.actions.changeRowsModeModel(newRowModeModel));
      dispatch(productShopSlice.actions.changeTableMode("view"));
      dispatch(productShopSlice.actions.changeListSelectedRows([]));
   };
   const handleToViewDetails = () => {
      navigate(`/${breadCrumbs.UPDATE_PRODUCT.url}/${listSelected[0]}`);
   }
   return (
      <div className={clsx(s.controller, "box-shadow")}>
         <Grid2 container width={"100%"}>
            <Grid2 xs={6} className={s.right}>
               <Tabs
                  value={type.id}
                  onChange={handleTabValueChange}
                  aria-label="basic tabs example"
               >
                  {CATEGORY.map((cate) => (
                     <Tab label={cate.name} key={cate.id} value={cate.id} />
                  ))}
               </Tabs>
            </Grid2>
            <Grid2
               xs={6}
               sx={{ display: "flex", justifyContent: "end", gap: 1 }}
            >
               {mode === "view" ? (
                  <Button
                     variant="outlined"
                     disabled={listSelected.length === 0}
                     onClick={handleChangeToEditMode}
                  >
                     Edit
                  </Button>
               ) : (
                  <ButtonGroup variant="outlined">
                     <Button onClick={handleSaveMode}>Save</Button>
                     <Button onClick={handleCancelMode}>Cancel</Button>
                  </ButtonGroup>
               )}
               <Button
                  onClick={handleToViewDetails}
                  variant="outlined"
                  disabled={listSelected.length !== 1}

               >
                  View details
               </Button>
               <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  variant="outlined"
                  disabled={listSelected.length === 0}
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
                  <MenuItem onClick={handleActionInRow} value={1}>
                     Active
                  </MenuItem>
                  <MenuItem onClick={handleActionInRow} value={0}>
                     Inactive
                  </MenuItem>
                  <MenuItem onClick={() => setOpenModel(true)} value={-1}>
                     Delete
                  </MenuItem>
               </Menu>
               <Button
                  id="basic-button-create"
                  aria-controls={
                     openCreateMenu ? "basic-menu-create" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={openCreateMenu ? "true" : undefined}
                  onClick={handleClickCreateMenu}
                  variant="outlined"
               >
                  Create <KeyboardArrowDownIcon />
               </Button>
               <Menu
                  id="basic-menu-create"
                  anchorEl={anchorElCreateMenu}
                  open={openCreateMenu}
                  onClose={handleCloseCreateMenu}
                  disableScrollLock
                  MenuListProps={{
                     "aria-labelledby": "basic-button-create",
                  }}
               >
                  <MenuItem
                     onClick={() => navigate(breadCrumbs.CREATE_PRODUCTS.url)}
                     value={1}
                  >
                     Create product
                  </MenuItem>
                  <MenuItem onClick={() => {
                     setOpenPromotionModal(true)
                     handleCloseCreateMenu()
                  }} value={0}>
                     Create promotion
                  </MenuItem>
               </Menu>
            </Grid2>
         </Grid2>
         <Modal
            open={openPromotionModal}
            onClose={handleCloseFormCreatePromotion}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
         >
            <FormCreatePromotion closeModel={handleCloseFormCreatePromotion}/>
         </Modal>
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
                     Delete products?
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
                     The product has been deleted and cannot be obtained again.
                  </Typography>
                  <Typography sx={{ fontSize: "2rem", color: "red" }}>
                     Are you certain that you want to delete everything?
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
                     value={-1}
                  >
                     Delete
                  </Button>
               </Box>
            </Box>
         </Modal>
      </div>
   );
}
