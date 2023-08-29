import {
   Box,
   Button,
   FormHelperText,
   InputAdornment,
   Select,
   Slider,
   TextField,
   Typography,
   MenuItem,
} from "@mui/material";
import React, { useEffect } from "react";
import theme from "../../style/theme";
import { modelStyle } from "./../../config/constant";
import * as yup from "yup";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import globalConfigSlice from "../../redux/globalConfigSlice";
import { api } from "../../api/api";
import { DatePicker } from "@mui/x-date-pickers";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { styleFormUpdate } from "../form-update-product/FormUpdateProduct";
import moment from "moment";

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
   name: yup.string("").max(255, "Maximum length of name is 255 characters").required("Name is required!"),

   discount: yup
      .number()
      .typeError("Discount rate must be a number")
      .min(0, "Invalid quantity of promotion! Need between $1 and $100,000")
      .max(
         100000,
         "Invalid quantity of promotion! Need between $1 and $100,000"
      )
      .required("Discount rate is required"),
   usageLimit: yup
      .number()
      .typeError("Usage limit must be a number")
      .min(1, "Invalid usage limit of promotion! Need between 1 and 100,000")
      .max(
         100000,
         "Invalid usage limit of promotion! Need between 1 and 100,000"
      )
      .required("Usage limit is required"),
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
   minimumOrderValue: yup
      .number()
      .typeError("Minimum price of order must be a number")
      .min(1, "Minimum price of order between $1 and $100,000")
      .max(100000, "Minimum price of order between $1 and $100,000")
      .required("Minimum price of order rate is required"),
});

export default function AdminCreatePromotionForm({ closeModel }) {
   const dispatch = useDispatch();
   const form = useFormik({
      initialValues: {
         name: "",
         description: "",
         discount: 0,
         usageLimit: 0,
         minimumOrderValue: 0,
         startDate: "",
         endDate: "",
         type: "DISCOUNT",
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
      console.log('start date ', Date.parse(form.values.startDate))
      
      try {
         const staDate = new Date(form?.values?.startDate);
         const endDate = new Date(form?.values?.endDate);
         // Assuming endDate is a string or a Date object from the form values
         // Set the time to 23:59
        
         endDate.setHours(23);
         endDate.setMinutes(59);
         console.log('end date ', Date.parse(endDate))
         const formData = {
            ...form.values,
            startDate: staDate.getTime(),
            endDate:endDate.getTime(),
         };
         const res = await api.post("/admin/promotion", formData);
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
   useEffect(() => {
      return () => {
         form.setValues({
            name: "",
            description: "",
            discount: 0,
            usageLimit: 0,
            minimumOrderValue: 0,
            startDate: "",
            endDate: "",
            type: "DISCOUNT",
         });
      };
   }, []);
   return (
      <Box
         sx={{
            backgroundColor: theme.palette.template5.main,
            ...modelStyle,
         }}
      >
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
               {form?.values?.type === "DISCOUNT" ? (
                  <TextField
                     key={"discount"}
                     id="discount"
                     name="discount"
                     label="Promotion discount"
                     variant="outlined"
                     value={form.values.discount ? form.values.discount : ""}
                     onChange={form.handleChange}
                     onBlur={form.handleBlur}
                     error={
                        form.touched.discount && Boolean(form.errors.discount)
                     }
                     helperText={form.touched.discount && form.errors.discount}
                     color="template7"
                     InputProps={{
                        startAdornment: (
                           <InputAdornment position="end">$</InputAdornment>
                        ),
                     }}
                     sx={{}}
                     fullWidth={true}
                  />
               ) : (
                  ""
               )}
               <TextField
                  key={"minimumOrderValue"}
                  id="minimumOrderValue"
                  name="minimumOrderValue"
                  label="Minimum price of order"
                  variant="outlined"
                  value={
                     form.values.minimumOrderValue
                        ? form.values.minimumOrderValue
                        : ""
                  }
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="end">$</InputAdornment>
                     ),
                  }}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={
                     form.touched.minimumOrderValue &&
                     Boolean(form.errors.minimumOrderValue)
                  }
                  helperText={
                     form.touched.minimumOrderValue &&
                     form.errors.minimumOrderValue
                  }
                  color="template7"
                  sx={{}}
                  fullWidth={true}
               />
               <TextField
                  key={"usageLimit"}
                  id="usageLimit"
                  name="usageLimit"
                  label="Usage limit"
                  variant="outlined"
                  value={form.values.usageLimit ? form.values.usageLimit : ""}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={
                     form.touched.usageLimit && Boolean(form.errors.usageLimit)
                  }
                  helperText={form.touched.usageLimit && form.errors.usageLimit}
                  color="template7"
                  sx={{}}
                  fullWidth={true}
               />
               <Select
                  name="type"
                  sx={styleFormUpdate.select}
                  value={form.values.type}
                  onBlur={form.handleBlur("type")}
                  onChange={(e) => form.setFieldValue("type", e.target.value)}
                  MenuProps={{
                     disableScrollLock: true,
                     PaperProps: {
                        style: {
                           maxHeight: 200, // Set the desired maximum height
                        },
                     },
                  }}
               >
                  <MenuItem value={"DISCOUNT"}>Discount</MenuItem>
                  <MenuItem value={"SHIPPING"}>Free shipping</MenuItem>
               </Select>

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
                              value
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
      </Box>
   );
}
