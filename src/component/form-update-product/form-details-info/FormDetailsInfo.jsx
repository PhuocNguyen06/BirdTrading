import { useDispatch, useSelector } from "react-redux";
import productDetailsValidateSlice, {
   getCategoryInForm,
   getFormSelector,
   getProductDetailsValidateSelector,
} from "../../../redux/productDetailsValidateSlice";
import s from "./formDetailsInfo.module.scss";
import React, { useEffect, useState } from "react";
import FieldCustom from "../field-custom/FieldCustom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
   Autocomplete,
   Box,
   Button,
   Checkbox,
   FormHelperText,
   MenuItem,
   Select,
   TextField,
   Typography,
} from "@mui/material";
import { styleFormUpdate } from "../FormUpdateProduct";
import { useFormik } from "formik";
import * as yup from "yup";
import CategorySpecialInfo from "../category-special-info/CategorySpecialInfo";
import productDetailsSlice, {
   getListTags,
   getListTagsSelector,
   getListTypesSelector,
} from "../../../redux/productDetailsSlice";
import { getListTypes } from "./../../../redux/productDetailsSlice";
import { useRef } from "react";
import { api } from "../../../api/api";

// Custom CSS for the Quill editor
const validationSchema = yup.object().shape({
   type: yup.number().notOneOf([0], "Type is required!"),
   tags: yup.array().min(1, "Please select at least one tag"),
   description: yup
      .string()
      .min(100, "Description must be at least 100 characters long")
      .required("Description is required!"),
});

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
         value={value}
         onChange={handleChange}
         onBlur={() => form.setFieldTouched(name, true)}
      />
   );
};

export default function FormDetailsInfo() {
   const [newTag, setNewTag] = useState("");
   const [responseTag, setResponseTag] = useState();
   const listTags = useSelector(getListTagsSelector);
   const listTypes = useSelector(getListTypesSelector);
   const dispatch = useDispatch();
   const category = useSelector(getCategoryInForm);
   const getForm = useSelector(getFormSelector);
   const { detailsForm, status } = useSelector(getProductDetailsValidateSelector);
   const [errorAddTag, setErrorAddTag] = useState("");
   const [initValue, setInitValue] = useState()
   useEffect(() => {
      if(detailsForm) {
         setInitValue(detailsForm.data);
      }
   }, [detailsForm]);
   const getCategoryName = (category) => {
      if (category === 1) {
         return "bird";
      }
      if (category === 2) {
         return "food";
      }
      if (category === 3) {
         return "accessory";
      }
   };

   const form = useFormik({
      initialValues: {
         type: 0,
         tags: [],
         description: "",
      },
      validationSchema: validationSchema,
      validateOnChange: true,
      validateOnBlur: true,
      validationOnMount: true,
   });

   const handleNewTag = async () => {
      if (newTag) {
         try {
            const res = await api.post("shop-owner/tag", {
               name: newTag,
            });
            const data = await res.data;
            setResponseTag(data);
            dispatch(productDetailsSlice.actions.addNewTag(data));
         } catch (e) {
            if (e?.response?.status === 409) {
               setErrorAddTag("Tag already exists!");
            }
         }
      }
   };
   useEffect(() => {
      const newTagg = responseTag;

      if (listTags) {
         const isExist = listTags.find((tag) => tag.id === responseTag?.id);
         if (isExist) {
            form.setFieldValue("tags", [...form.values.tags, responseTag]);
            setResponseTag("");
         }
      }
   }, [responseTag, JSON.stringify(listTags)]);
   useEffect(() => {
      dispatch(getListTags());
   }, []);
   useEffect(() => {
      dispatch(getListTypes(category));
      form.setValues(form.initialValues, false);
   }, [category]);
   const isOptionEqualToValue = (option, value) => {
      // Customize the equality test based on your data structure
      return option.id === value.id;
   };
   useEffect(() => {
      dispatch(
         productDetailsValidateSlice.actions.handleOnChangeDetailsForm(
            form.values
         )
      )
      form.validateForm(form.values);
      dispatch(productDetailsValidateSlice.actions.setDetailsForm(form));
   }, [getForm]);
   useEffect(() => {
      if(status == 'UPDATE') {
         form.setValues(detailsForm.data)
      }
   }, [detailsForm]);

   return (
      <form className={s.container}>
         <h2>Details information</h2>
         {category === 0 ? (
            <span style={{ fontSize: "2rem", color: "#3b3b3b" }}>
               After selecting a category, you will be able to proceed further.
            </span>
         ) : (
            <>
               <FieldCustom
                  title={"Type of " + getCategoryName(category)}
                  isRequired={true}
               >
                  <Select
                     id="type"
                     sx={styleFormUpdate.select}
                     value={form.values.type}
                     error={
                        form.touched.category && Boolean(form.errors.category)
                     }
                     onBlur={form.handleBlur("type")}
                     onChange={(e) =>
                        form.setFieldValue("type", e.target.value)
                     }
                     MenuProps={{
                        disableScrollLock: true,
                        PaperProps: {
                           style: {
                              maxHeight: 200, // Set the desired maximum height
                           },
                        },
                     }}
                  >
                     <MenuItem value={0}>
                        <em>Choose one type</em>
                     </MenuItem>
                     {listTypes &&
                        listTypes.map((type) => (
                           <MenuItem value={type.id} key={type.id}>
                              {type.name}
                           </MenuItem>
                        ))}
                  </Select>
                  {form.touched.type && form.errors.type && (
                     <FormHelperText error>{form.errors.type}</FormHelperText>
                  )}
               </FieldCustom>
               <FieldCustom
                  title={"Tags of " + getCategoryName(category)}
                  isRequired={true}
               >
                  {listTags !== undefined && listTags.length !== 0 && (
                     <>
                        <Autocomplete
                           id="tags"
                           multiple
                           isOptionEqualToValue={isOptionEqualToValue}
                           value={form.values.tags}
                           onBlur={form.handleBlur("tags")}
                           onChange={(event, value) =>
                              form.setFieldValue("tags", value)
                           }
                           disableCloseOnSelect
                           renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                 <Checkbox sx={{ mr: 1 }} checked={selected} />
                                 {option.name}
                              </li>
                           )}
                           sx={{ width: "90%" }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label="Select tags"
                                 variant="outlined"
                              />
                           )}
                           options={listTags}
                           getOptionLabel={(option) => option.name}
                           filterOptions={(options, state) =>
                              options.filter((option) =>
                                 option.name
                                    .toLowerCase()
                                    .includes(state.inputValue.toLowerCase())
                              )
                           }
                        />

                        {form.touched.tags && form.errors.tags && (
                           <FormHelperText error>
                              {form.errors.tags}
                           </FormHelperText>
                        )}
                     </>
                  )}
                  <Typography sx={{ margin: "1rem" }}>Or create new</Typography>
                  <Box sx={{ display: "flex", gap: "1rem" }}>
                     <TextField
                        id="newTag"
                        value={newTag}
                        onChange={(e) => {
                           const value = e.target.value.replace(/[\s\n]/g, ""); // Remove spaces and new lines
                           setErrorAddTag("");
                           setNewTag(value);
                        }}
                        sx={{
                           input: {
                              padding: 1,
                           },
                        }}
                     />

                     <Button onClick={handleNewTag} variant="outlined">
                        Add+
                     </Button>
                  </Box>
                  <FormHelperText error={errorAddTag ? true : false}>
                     {errorAddTag}
                  </FormHelperText>
                  <FormHelperText
                     error={
                        form.touched.category && Boolean(form.errors.category)
                     }
                  >
                     {form.touched.category && form.errors.category}
                  </FormHelperText>
               </FieldCustom>
               <CategorySpecialInfo category={category} />
               <FieldCustom
                  title={"Description of " + getCategoryName(category)}
                  isRequired={true}
               >
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
               </FieldCustom>
            </>
         )}
      </form>
   );
}
