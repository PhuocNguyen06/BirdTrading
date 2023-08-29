import {
   FormControlLabel,
   InputAdornment,
   Radio,
   RadioGroup,
   TextField,
} from "@mui/material";
import FieldCustom from "../field-custom/FieldCustom";
import s from "./categorySpecialInfo.module.scss";
import React, { useEffect } from "react";
import { styleFormUpdate } from "../FormUpdateProduct";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import productDetailsValidateSlice, {
   getFeatureSelector,
   getFormSelector,
   getProductDetailsValidateSelector,
} from "../../../redux/productDetailsValidateSlice";

const validationSchemaBirds = yup.object({
   age: yup
      .number()
      .typeError("Age must be a number")
      .positive("Age must be a positive number")
      .max(100, "Maximum age is 100")
      .required("Age is required"),
   color: yup.string().required("Color is required"),
});

const validationSchemaFood = yup.object({
   weight: yup
      .number()
      .typeError("Weight must be a number")
      .positive("Weight must be a positive number")
      .max(10000, "Maximum weight is 10000g")
      .required("Weight is required"),
});

const validationSchemaAccessories = yup.object({
   origin: yup.string("").required("Name is required!"),
});

const initValue = {
   bird: {
      age: 0,
      color: "",
      gender: "FEMALE",
   },
   food: {
      weight: 0,
   },
   accessory: {
      origin: "",
   },
};

export default function CategorySpecialInfo({ category }) {
   const dispatch = useDispatch();
   const getForm = useSelector(getFormSelector);
   const {feature, status} = useSelector(getProductDetailsValidateSelector);
   const validationSchema = (category) => {
      if (category === 1) {
         return validationSchemaBirds;
      }
      if (category === 2) {
         return validationSchemaFood;
      }
      if (category === 3) {
         return validationSchemaAccessories;
      }
   };
   
   let initialValue = (category) => {
      if (category === 1) {
         return initValue.bird;
      }
      if (category === 2) {
         return initValue.food;
      }
      if (category === 3) {
         return initValue.accessory;
      }
   };
   if(status === 'UPDATE' ){
      initialValue = () => {
         return feature.data
      };
   }
   const form = useFormik({
      initialValues: initialValue(category),
      validationSchema: validationSchema(category),
      validateOnChange: true,
      validateOnBlur: true,
      validationOnMount: true,
   });

   useEffect(() => {
      dispatch(
         productDetailsValidateSlice.actions.handleOnChangeFeature(form.values)
      );
      form.validateForm(form.values);
      dispatch(productDetailsValidateSlice.actions.setFeatureCategory(form));
   }, [getForm]);

   useEffect(() => {
      onCategoryChange(category);
   }, [category]);

   const onCategoryChange = async (category) => {
      const newInitialValue = initialValue(category);

      await form.setValues(newInitialValue); // Update form values with newInitialValue
     
      await dispatch(
         productDetailsValidateSlice.actions.setFeatureCategory(form)
      );
   };
   return (
      <>
         {category === 1 && (
            <>
               <FieldCustom title={"Age of bird"} isRequired>
                     <TextField
                        key={"age"}
                        id="age"
                        name="age"
                        variant="outlined"
                        value={form.values.age ? form.values.age : ''}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        error={form.touched.age && Boolean(form.errors.age)}
                        helperText={form.touched.age && form.errors.age}
                        color="template7"
                        sx={styleFormUpdate.textField}
                     />
               </FieldCustom>
               <FieldCustom title={"Color of bird"} isRequired>
                  <TextField
                     key={"color"}
                     id="color"
                     name="color"
                     variant="outlined"
                     value={form.values.color ? form.values.color : ''}
                     onChange={form.handleChange}
                     onBlur={form.handleBlur}
                     error={form.touched.color && Boolean(form.errors.color)}
                     helperText={form.touched.color && form.errors.color}
                     color="template7"
                     sx={styleFormUpdate.textField}
                  />
               </FieldCustom>
               <FieldCustom title={"Gender of bird"} isRequired>
                  <RadioGroup
                     id="gender"
                     name="gender"
                     aria-labelledby="demo-radio-buttons-group-label"
                     defaultValue="FEMALE"
                     value={form.values.gender ? form.values.gender : ''}
                     onChange={(e) => {
                        form.setFieldValue("gender", e.target.value);
                     }}
                     sx={{ width: "fit-content" }}
                  >
                     <FormControlLabel
                        value="FEMALE"
                        control={<Radio />}
                        label="Female"
                     />
                     <FormControlLabel
                        value="MALE"
                        control={<Radio />}
                        label="Male"
                     />
                     <FormControlLabel
                        value="OTHER"
                        control={<Radio />}
                        label="Other"
                     />
                  </RadioGroup>
               </FieldCustom>
            </>
         )}
         {category === 2 && (
            <>
               <FieldCustom title={"Weight of food"} isRequired={true}>
                  <TextField
                     key={"weight"}
                     id="weight"
                     name="weight"
                     variant="outlined"
                     value={form.values.weight? form.values.weight : ''}
                     onChange={form.handleChange}
                     onBlur={form.handleBlur}
                     error={form.touched.weight && Boolean(form.errors.weight)}
                     helperText={form.touched.weight && form.errors.weight}
                     color="template7"
                     sx={styleFormUpdate.textField}
                     InputProps={{
                        endAdornment: (
                           <InputAdornment position="end">gam</InputAdornment>
                        ),
                     }}
                  />
               </FieldCustom>
            </>
         )}
         {category === 3 && (
            <>
               <FieldCustom title={"Origin of accessory"} isRequired={true}>
                  <TextField
                     key={"origin"}
                     id="origin"
                     name="origin"
                     variant="outlined"
                     value={form.values.origin?form.values.origin: ''}
                     onChange={form.handleChange}
                     onBlur={form.handleBlur}
                     error={form.touched.origin && Boolean(form.errors.origin)}
                     helperText={form.touched.origin && form.errors.origin}
                     color="template7"
                     sx={styleFormUpdate.textField}
                  />
               </FieldCustom>
            </>
         )}
      </>
   );
}
