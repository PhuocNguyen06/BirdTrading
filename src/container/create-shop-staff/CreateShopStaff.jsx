import {
   Box,
   Button,
   FormHelperText,
   TextField,
   Typography,
} from "@mui/material";
import clsx from "clsx";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { styleFormUpdate } from "./../../component/form-update-product/FormUpdateProduct";
import theme from "../../style/theme";
import { api } from "../../api/api";
import { useDispatch } from "react-redux";
import globalConfigSlice from "../../redux/globalConfigSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import shopStaffSlice from "../../redux/shopStaffSlice";
const validationSchema = yup.object({
   userName: yup
      .string("")
      .max(20, "Maximum username is 20 characters")
      .required("Username is required!"),
   password: yup
      .string("")
      .min(8, "The password should consist of more than eight characters.")
      .required("Password is required!"),
   confirmPassword: yup
      .string()
      .test("passwords-match", "Passwords must match", function (value) {
         return this.parent.password === value;
      }),
});
export default function CreateShopStaff() {
   const [error, setError] = useState("");
   const [loadingButton, setLoadingButton] = useState(false);
   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(shopStaffSlice.actions.changeTab(2));
   }, []);
   const form = useFormik({
      initialValues: {
         userName: "",
         password: "",
         confirmPassword: "",
      },
      validationSchema: validationSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (e) => {
         try {
            setLoadingButton(true);
            const res = await api.post("/shop-owner/create-staff", form.values);
            const data = await res.data;
            form.setValues({
               userName: "",
               password: "",
               confirmPassword: "",
            });
            form.setTouched(
               {
                  userName: false,
                  password: false,
                  confirmPassword: false,
               },
               false
            );
            setLoadingButton(false);

            dispatch(
               globalConfigSlice.actions.changeSnackBarState({
                  typeStatus: "success",
                  message: "Create staff successfully!",
                  open: true,
                  title: "Success",
               })
            );
         } catch (e) {
            setLoadingButton(false);
            if (e?.response?.status === 409) {
               form.setFieldError("userName", "Username already in use!");
               console.log(form);
            } else {
               setError("Something went wrong! Please try again");
            }
            console.log(e);
         }
      },
   });
   return (
      <Box
         className={clsx("box-shadow")}
         sx={{
            width: "70rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.template5.main,
            borderRadius: "5px",
            padding: "3rem 3rem",
         }}
      >
         <form
            onSubmit={form.handleSubmit}
            style={{
               flex: 1,
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               gap: "3rem",
            }}
         >
            <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
               Create staff
            </Typography>
            <TextField
               id="userName"
               name="userName"
               label="Username"
               variant="outlined"
               value={form.values.userName ? form.values.userName : ""}
               onChange={form.handleChange}
               onBlur={form.handleBlur}
               error={form.touched.userName && Boolean(form.errors.userName)}
               helperText={form.touched.userName && form.errors.userName}
               color="template7"
               sx={styleFormUpdate.textField}
            />
            <TextField
               id="password"
               name="password"
               label="Password"
               variant="outlined"
               type="password"
               value={form.values.password ? form.values.password : ""}
               onChange={form.handleChange}
               onBlur={form.handleBlur}
               error={form.touched.password && Boolean(form.errors.password)}
               helperText={form.touched.password && form.errors.password}
               color="template7"
               sx={styleFormUpdate.textField}
            />
            <TextField
               id="confirmPassword"
               name="confirmPassword"
               label="Confirm password"
               variant="outlined"
               type="password"
               value={
                  form.values.confirmPassword ? form.values.confirmPassword : ""
               }
               onChange={form.handleChange}
               onBlur={form.handleBlur}
               error={
                  form.touched.confirmPassword &&
                  Boolean(form.errors.confirmPassword)
               }
               helperText={
                  form.touched.confirmPassword && form.errors.confirmPassword
               }
               color="template7"
               sx={styleFormUpdate.textField}
            />
            {error && (
               <FormHelperText error={error !== ""}>{error}</FormHelperText>
            )}
            <LoadingButton
               loading={loadingButton}
               variant="outlined"
               type={"submit"}
               size="large"
               sx={{ fontSize: "2rem", width: "90%" }}
            >
               Submit
            </LoadingButton>
         </form>
      </Box>
   );
}
