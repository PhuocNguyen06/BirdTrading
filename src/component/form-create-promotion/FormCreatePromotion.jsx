import {
   Button,
   FormHelperText,
   InputAdornment,
   TextField,
   Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import theme from "../../style/theme";
import { modelStyle } from "./../../config/constant";
import { styleFormUpdate } from "../form-update-product/FormUpdateProduct";
import ReactQuill from "react-quill";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import styled from "@emotion/styled";
import MuiInput from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import { DatePicker } from "@mui/x-date-pickers";
import { api } from "../../api/api";
import { useDispatch } from "react-redux";
import globalConfigSlice from "../../redux/globalConfigSlice";

const QuillWrapper = ({ field, form, ...props }) => {
   const { name } = field;
   const { setFieldValue } = form;
   const { value } = field;
   const handleChange = (content) => {
      setFieldValue(name, content);
   };
   return (
      <ReactQuill
         {...props}
         style={{ width: "100%" }}
         value={value}
         onChange={handleChange}
         onBlur={() => form.setFieldTouched(name, true)}
      />
   );
};
const getCurrent = () => {
   const today = new Date();
   today.setHours(0, 0, 0, 0);
   return today;
};
const validationSchema = yup.object().shape({
   name: yup
      .string("")
      .max(255, "Maximum length of name is 255 characters")
      .required("Name is required!"),
   discountRate: yup
      .number()
      .typeError("Discount rate must be a number")
      .min(1, "Invalid percent of promotion! Need between 1 and 100")
      .max(100, "Invalid percent of promotion! Need between 1 and 100")
      .required("Discount rate is required"),
   description: yup
      .string()
      .min(20, "Description must be at least 20 characters")
      .required("Description is required"),
   startDate: yup
      .date()
      .min(getCurrent(), "Start date cannot be in the past")
      .required("Start date is required"),
   endDate: yup
      .date()
      .min(yup.ref("startDate"), "End date cannot be before start date")
      .required("End date is required"),
});

export default function FormCreatePromotion({ closeModel }) {
   const dispatch = useDispatch();
   const form = useFormik({
      initialValues: {
         name: "",
         description: "",
         discountRate: 1,
         startDate: "",
         endDate: "",
      },
      validationSchema: validationSchema,
      validateOnChange: true,
      validateOnBlur: true,
      validationOnMount: true,
      onSubmit: async () => {
         console.log(form.values);
         await handleSubmit();
      },
   });
   const handleSubmit = async () => {
      try {
         const formData = {
            ...form.values,
            startDate: Date.parse(form.values.startDate),
            endDate: Date.parse(form.values.endDate),
         };
         const res = await api.post("/shop-owner/promotion-shop", formData);
         const data = await res.data;
         console.log(data);
         dispatch(
            globalConfigSlice.actions.changeSnackBarState({
               typeStatus: "success",
               message: "Create promotion successfully!",
               open: true,
               title: "Success",
            })
         );
         form.resetForm();
         return data;
      } catch (e) {
         dispatch(
            globalConfigSlice.actions.changeSnackBarState({
               type: "error",
               message:
                  "Create promotion failure, something went wrong! Try again please",
               open: true,
               title: "Error",
            })
         );
         console.log(e);
      }
   };
   return (
      <Box
         sx={{
            backgroundColor: theme.palette.template5.main,
            padding: "3rem 5rem",
            ...modelStyle,
         }}
      >
         <Typography
            variant="h4"
            sx={{ textAlign: "center", marginBottom: "3rem" }}
         >
            Create new promotion
         </Typography>
         <form
            onSubmit={form.handleSubmit}
            style={{
               display: "flex",
               flexDirection: "column",
               gap: "3rem",
               width: "50rem",
            }}
         >
            <TextField
               key={"name"}
               id="name"
               name="name"
               label="Promotion name"
               variant="outlined"
               value={form.values.name ? form.values.name : ""}
               onChange={form.handleChange}
               onBlur={form.handleBlur}
               error={form.touched.name && Boolean(form.errors.name)}
               helperText={form.touched.name && form.errors.name}
               color="template7"
               sx={{}}
               fullWidth={true}
            />
            <Grid2 container spacing={2} alignItems="center">
               <Grid2 xs={3}>
                  <Typography>Discount rate</Typography>
               </Grid2>
               <Grid2 xs={6}>
                  <Slider
                     id="discountRate"
                     name="discountRate"
                     value={form.values.discountRate}
                     onChange={form.handleChange}
                     aria-labelledby="input-slider"
                  />
               </Grid2>
               <Grid2 xs={3}>
                  <TextField
                     key={"discountRate"}
                     id="discountRate"
                     name="discountRate"
                     variant="outlined"
                     value={form.values.discountRate}
                     onChange={form.handleChange}
                     onBlur={form.handleBlur}
                     color="template7"
                     sx={{}}
                     fullWidth={true}
                     InputProps={{
                        endAdornment: (
                           <InputAdornment position="end">%</InputAdornment>
                        ),
                     }}
                  />
               </Grid2>
               <Grid2 xs={12}>
                  {form.touched.discountRate && form.errors.discountRate && (
                     <FormHelperText error>
                        {form.errors.discountRate}
                     </FormHelperText>
                  )}
               </Grid2>
            </Grid2>
            <Box>
               <QuillWrapper
                  placeholder="Write description here..."
                  field={form.getFieldProps("description")}
                  form={form}
               />
               {form.touched.description && form.errors.description && (
                  <FormHelperText error>
                     {form.errors.description}
                  </FormHelperText>
               )}
            </Box>
            <Grid2 container spacing={2}>
               <Grid2 xs={6}>
                  <DatePicker
                     format="DD/MM/YYYY"
                     label={"From date"}
                     value={form.values.startDate}
                     onChange={(value) => {
                        console.log(value);
                        form.setFieldValue(
                           "startDate",
                           new Date(Date.parse(value))
                        );
                     }}
                  />
                  {form.errors.startDate && (
                     <FormHelperText error>
                        {form.errors.startDate}
                     </FormHelperText>
                  )}
               </Grid2>
               <Grid2 xs={6}>
                  <DatePicker
                     format="DD/MM/YYYY"
                     label={"To date"}
                     value={form.values.endDate}
                     onChange={(value) => {
                        const endDate = value.toDate();
                        endDate.setHours(23, 59, 59, 59);
                        console.log(endDate);
                        form.setFieldValue(
                           "endDate",
                           new Date(Date.parse(value))
                        );
                     }}
                  />
                  {form.errors.endDate && (
                     <FormHelperText error>
                        {form.errors.endDate}
                     </FormHelperText>
                  )}
               </Grid2>
            </Grid2>
            <Box display={"flex"} gap={1} justifyContent={"end"}>
               <Button
                  sx={{ fontSize: "2rem" }}
                  variant="outlined"
                  onClick={() => closeModel()}
               >
                  Cancel
               </Button>
               <Button
                  sx={{ fontSize: "2rem" }}
                  variant="outlined"
                  type="submit"
               >
                  Submit
               </Button>
            </Box>
         </form>
      </Box>
   );
}
