import s from "./formBasicInfo.module.scss";
import React, { useEffect } from "react";
import InputImageController from "../../input-image-controller/InputImageController";
import FieldCustom from "../field-custom/FieldCustom";
import InputVideoController from "../../input-video-controller/InputVideoController";
import {
   Alert,
   AlertTitle,
   Collapse,
   FormHelperText,
   MenuItem,
   Select,
   Snackbar,
   TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import fileControlSlice, {
   getErrorMessageSelector,
} from "./../../../redux/fileControlSlice";
import { styleFormUpdate } from "../FormUpdateProduct";
import { CATEGORY } from "../../../config/constant";
import * as yup from "yup";
import { useFormik } from "formik";
import productDetailsValidateSlice, {
   getBasicFormSelector,
   getFormSelector,
   getImageStateSelector,
   getIsImageValidateSelector,
   getProductDetailsValidateSelector,
} from "../../../redux/productDetailsValidateSlice";

const validationSchema = yup.object({
   name: yup
      .string("")
      .max(255, "Maximum length of name is 255 characters")
      .required("Name is required!"),

   category: yup
      .number()
      .test(
         "not-zero",
         "Category is required for the details step!",
         (value) => value !== 0
      ),
});
export default function FormBasicInfo() {
   const error = useSelector(getErrorMessageSelector);
   const errorImages = useSelector(getImageStateSelector);
   const isImageValidate = useSelector(getIsImageValidateSelector);
   const dispatch = useDispatch();
   const getForm = useSelector(getFormSelector);
   const { basicForm, status } = useSelector(getProductDetailsValidateSelector);
   const form = useFormik({
      initialValues: basicForm.data,
      validationSchema: validationSchema,
      validateOnChange: true,
      validateOnBlur: true,
      validationOnMount: true,
   });
   useEffect(() => {
      if (status === "UPDATE") {
         form.setValues(basicForm.data);
      }
   }, [basicForm]);
   useEffect(() => {
      dispatch(
         productDetailsValidateSlice.actions.handleOnChangeBasicForm(
            form.values
         )
      );
      form.validateForm(form.values);
      dispatch(productDetailsValidateSlice.actions.setBasicForm(form));
   }, [getForm]);
   useEffect(() => {
      dispatch(
         productDetailsValidateSlice.actions.handleOnChangeBasicForm(
            form.values
         )
      );
   }, [form?.values?.category]);
   const handleClose = () => {
      dispatch(fileControlSlice.actions.setErrorMessage(""));
   };

   return (
      <>
         <form className={s.container}>
            <h2>Basic information</h2>
            <FieldCustom title={"Images of product"} isRequired={true}>
               <InputImageController />
               <FormHelperText error={!errorImages.status && !isImageValidate}>
                  {!errorImages.status && !isImageValidate && errorImages.msg}
               </FormHelperText>
            </FieldCustom>
            <FieldCustom
               title={"Video of product"}
               helper="The maximum acceptable file size for the video is 10MB."
            >
               <InputVideoController />
            </FieldCustom>
            <FieldCustom title={"Name of product"} isRequired={true}>
               <TextField
                  id="name"
                  variant="outlined"
                  value={form.values.name}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.touched.name && Boolean(form.errors.name)}
                  helperText={form.touched.name && form.errors.name}
                  color="template7"
                  sx={styleFormUpdate.textField}
               />
            </FieldCustom>
            <FieldCustom title={"Category"} isRequired={true}>
               <Select
                  id="category"
                  disabled={status === "UPDATE"}
                  sx={styleFormUpdate.select}
                  value={form.values.category}
                  error={form.touched.category && Boolean(form.errors.category)}
                  onBlur={form.handleBlur("category")}
                  onChange={(e) =>
                     form.setFieldValue("category", e.target.value)
                  }
                  MenuProps={{
                     disableScrollLock: true,
                  }}
               >
                  <MenuItem value={0}>
                     <em>Choose one category</em>
                  </MenuItem>
                  {CATEGORY.map((category) => (
                     <MenuItem value={category.id} key={category.id}>
                        {category.name}
                     </MenuItem>
                  ))}
               </Select>
               <FormHelperText
                  error={form.touched.category && Boolean(form.errors.category)}
               >
                  {form.touched.category && form.errors.category}
               </FormHelperText>
            </FieldCustom>
         </form>
         <Snackbar
            open={error !== ""}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
         >
            <Collapse in={error !== ""}>
               <Alert severity="error" variant="filled">
                  <AlertTitle>Error</AlertTitle>
                  {error} — <strong>Try again!</strong>
               </Alert>
            </Collapse>
         </Snackbar>
      </>
   );
}
