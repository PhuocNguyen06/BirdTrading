import {
   Box,
   Button,
   Menu,
   MenuItem,
   Modal,
   Tab,
   Tabs,
   TextField,
   Typography,
} from "@mui/material";
import clsx from "clsx";
import React from "react";
import theme from "../../style/theme";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useDispatch, useSelector } from "react-redux";
import { CATEGORY, category } from "../../config/constant";
import productShopSlice, {
   getProductTableAndPagingInAdmin,
   productTableSelector,
} from "../../redux/productsShopSlice";
import { useEffect } from "react";
import globalConfigSlice from "../../redux/globalConfigSlice";
import { useState } from "react";
import { api } from "../../api/api";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { modelStyle } from "./../../config/constant";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
   name: yup.string().required("Name of type is required"),
});
export default function AdminProductsPageController() {
   const [typeModel, setTypeModel] = useState();
   const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);
   const [openModel, setOpenModel] = useState(false);
   const { type, listSelected, mode, currentPage } =
      useSelector(productTableSelector);
   const dispatch = useDispatch();
   const form = useFormik({
      initialValues: {
         name: "",
      },
      validationSchema: validationSchema,
      validateOnChange: true,
      validateOnBlur: true,
      validationOnMount: true,
      onSubmit: async () => {
         console.log(form.values);
         try {
            console.log(type);
            let typeString = "birds";
            if (type.id === 2) {
               typeString = "foods";
            } else if (type.id === 3) {
               typeString = "accessories";
            }
            const res = await api.post("admin/types/" + typeString, form.values);
            const data = await res.data;
            console.log(data);
            dispatch(
               globalConfigSlice.actions.changeSnackBarState({
                  typeStatus: "success",
                  message: "Create type successfully!",
                  open: true,
                  title: "Success",
               })
            );
         } catch (e) {
            dispatch(
               globalConfigSlice.actions.changeSnackBarState({
                  type: "error",
                  message:
                     "Create type failure, something went wrong! Try again please",
                  open: true,
                  title: "Error",
               })
            );
            console.log(e);
         }
      },
   });
   const handleTabValueChange = (e, value) => {
      const cate = Object.values(category).find((cate) => cate.id === value);
      dispatch(productShopSlice.actions.changeTab(cate));
   };
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };
   useEffect(() => {
      let active = true;
      if (active) {
         dispatch(getProductTableAndPagingInAdmin(1));
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
         dispatch(getProductTableAndPagingInAdmin(currentPage));
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
   const handleCreateType = () => {};
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
            <Grid2 xs={6} display={"flex"} justifyContent={"flex-end"} gap={1}>
               <Button
                  onClick={() => {
                     setTypeModel(2);
                     setOpenModel(true);
                  }}
                  variant="outlined"
               >
                  Create type
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
                  <MenuItem
                     onClick={() => {
                        setTypeModel(1);
                        setOpenModel(true);
                     }}
                     value={-2}
                  >
                     Ban
                  </MenuItem>
                  <MenuItem onClick={handleActionInRow} value={1}>
                     Unban
                  </MenuItem>
               </Menu>
            </Grid2>

            <Modal
               keepMounted={false}
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
                  {typeModel === 1 ? (
                     <>
                        {" "}
                        <Box
                           sx={{
                              backgroundColor:
                                 theme.palette.template5.contrastText,
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
                              The product has been deleted and cannot be
                              obtained again.
                           </Typography>
                           <Typography sx={{ fontSize: "2rem", color: "red" }}>
                              Are you certain that you want to delete
                              everything?
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
                              onClick={handleCloseModelDelete}
                           >
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
                     </>
                  ) : (
                     <>
                        <Box
                           sx={{
                              backgroundColor:
                                 theme.palette.template5.contrastText,
                              padding: "1rem 2rem",
                           }}
                        >
                           <Typography
                              sx={{ color: theme.palette.template4.main }}
                              variant="h4"
                           >
                              Create type of {type.name}
                           </Typography>
                        </Box>
                        <form onSubmit={form.handleSubmit}>
                           <Box p={"1rem 2rem"}>
                              <TextField
                                 key={"name"}
                                 id="name"
                                 name="name"
                                 label="Type name"
                                 variant="outlined"
                                 value={
                                    form.values.name ? form.values.name : ""
                                 }
                                 onChange={form.handleChange}
                                 onBlur={form.handleBlur}
                                 error={
                                    form.touched.name &&
                                    Boolean(form.errors.name)
                                 }
                                 helperText={
                                    form.touched.name && form.errors.name
                                 }
                                 color="template7"
                                 sx={{}}
                                 fullWidth={true}
                              />
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
                                 type="reset"
                                 onClick={handleCloseModelDelete}
                              >
                                 Cancel
                              </Button>
                              <Button
                                 variant="outlined"
                                 type="submit"
                                 value={-1}
                              >
                                 Create
                              </Button>
                           </Box>
                        </form>
                     </>
                  )}
               </Box>
            </Modal>
         </Grid2>
      </Box>
   );
}
