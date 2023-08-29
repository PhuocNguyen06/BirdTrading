import React, { useEffect } from "react";
import { breadCrumbs } from "../../config/constant";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import s from "./updateProductPage.module.scss";
import UpdateProductsStepper from "../../component/update-product-stepper/UpdateProductsStepper";
import FormUpdateProduct from "../../component/form-update-product/FormUpdateProduct";
import { useDispatch, useSelector } from "react-redux";
import productDetailsValidateSlice, {
   getBasicForm,
   getBasicFormSelector,
   getDetailFormSelector,
   getFeatureSelector,
   getFormSelector,
   getProductDetailsById,
   getProductValidateStateSelector,
   getSalesFormSelector,
} from "../../redux/productDetailsValidateSlice";
import fileControlSlice, {
   getDeleteVideoSelector,
   getListImageRemoveSelector,
   getListImagesPreviewSelector,
   getVideoBlobSelector,
} from "../../redux/fileControlSlice";
import ReactPlayer from "react-player";
import { useState } from "react";
import { Alert, AlertTitle, Button, Collapse, Snackbar } from "@mui/material";
import { objectToBlob } from "../../utils/myUtils";
import axios from "axios";
import { api } from "../../api/api";
import globalConfigSlice from "../../redux/globalConfigSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
let breadCrumbCreatePath = [breadCrumbs.PRODUCTS, breadCrumbs.CREATE_PRODUCTS];
let breadCrumbUpdatePath = [breadCrumbs.PRODUCTS, breadCrumbs.UPDATE_PRODUCT];
export default function UpdateProductPage() {
   const param = useParams();
   let breadCrumb;
   if (param.id) {
      breadCrumb = breadCrumbUpdatePath;
   } else {
      breadCrumb = breadCrumbCreatePath;
   }
   useBreadCrumb(breadCrumb, param.id);
   const listImages = useSelector(getListImagesPreviewSelector);
   const video = useSelector(getVideoBlobSelector);
   const basicForm = useSelector(getBasicFormSelector);
   const detailsForm = useSelector(getDetailFormSelector);
   const feature = useSelector(getFeatureSelector);
   const salesForm = useSelector(getSalesFormSelector);
   const [getForm, setGetForm] = useState(0);
   const location = useLocation();
   const navigate = useNavigate();
   const listImageRemove = useSelector(getListImageRemoveSelector);
   const deleteVideo = useSelector(getDeleteVideoSelector);
   const [createStatus, setCreateStatus] = useState({
      isOpen: false,
      status: false,
      message: "",
   });
   console.log(listImages);
   const dispatch = useDispatch();
   const { status } = useSelector(getProductValidateStateSelector);
   useEffect(() => {
      const params = location.pathname.split("/");
      const id = params[params.length - 1];
      if (location.pathname.includes(`${breadCrumbs.UPDATE_PRODUCT.url}`)) {
         dispatch(getProductDetailsById(id));
      }
   }, []);

   const handleSubmit = async () => {
      await dispatch(productDetailsValidateSlice.actions.getForm());

      setGetForm((state) => state + 1);
   };

   useEffect(() => {
      if (getForm !== 0) {
         handleSubmitAfterGetForm();
      }
   }, [getForm]);
   function setAllValuesToTrue(obj) {
      return Object.keys(obj).reduce((acc, key) => {
         acc[key] = true;
         return acc;
      }, {});
   }
   const handleSubmitAfterGetForm = async () => {
      await basicForm?.setTouched(setAllValuesToTrue(basicForm.values));
      await basicForm?.validateForm(basicForm.values);

      await detailsForm?.setTouched(setAllValuesToTrue(detailsForm.values));
      await detailsForm?.validateForm(detailsForm.values);

      await feature?.setTouched(setAllValuesToTrue(feature.values));
      await feature?.validateForm(feature.values);

      await salesForm?.setTouched(setAllValuesToTrue(salesForm.values));
      await salesForm?.validateForm(salesForm.values);

      const formData = new FormData();
      let count = 0;
      let productData = {};

      if (listImages !== undefined && listImages.length > 0) {
         console.log(listImages, "in good");
         let count3 = 0;
         listImages.forEach((image) => {
            if (image.file) {
               count3++;
               formData.append("image", image.file);
            }
         });
         dispatch(productDetailsValidateSlice.actions.setImagesState(true));
         dispatch(productDetailsValidateSlice.actions.changeErrorFormBasic(1));
      } else {
         console.log(listImages, "in not good");
         count++;
         dispatch(productDetailsValidateSlice.actions.setImagesState(false));
         dispatch(productDetailsValidateSlice.actions.changeErrorFormBasic(-1));
      }
      if (status === "UPDATE") {
      }
      if (video !== null && video !== "") {
         console.log(video, "?????????????????????????????");
         formData.append("video", video);
      }

      if (basicForm?.isValid) {
         if (status === "CREATE") {
            productData = {
               ...productData,
               categoryId: basicForm.values.category,
               name: basicForm.values.name,
            };
         } else if (status === "UPDATE") {
            productData = {
               ...productData,
               basicForm: basicForm.values,
            };
         }

         if (count === 0) {
            dispatch(
               productDetailsValidateSlice.actions.changeErrorFormBasic(1)
            );
         }
      } else {
         count++;
         dispatch(productDetailsValidateSlice.actions.changeErrorFormBasic(-1));
      }
      let count2 = 0;
      if (detailsForm?.isValid) {
         let listTagId = [];
         if (status === "CREATE") {
            listTagId = detailsForm.values.tags.map((tag) => tag.id);
            productData = {
               ...productData,
               tagId: listTagId,
               typeId: detailsForm.values.type,
               description: detailsForm.values.description,
            };
         } else if (status === "UPDATE") {
            listTagId = detailsForm.values.tags.map((tag) => tag);
            productData = {
               ...productData,
               detailsForm: {
                  description: detailsForm.values.description,
                  typeId: detailsForm.values.type,
                  tags: listTagId,
               },
            };
         }

         dispatch(
            productDetailsValidateSlice.actions.changeErrorFormDetails(1)
         );
      } else {
         count++;
         count2++;
         dispatch(
            productDetailsValidateSlice.actions.changeErrorFormDetails(-1)
         );
      }

      if (feature?.isValid) {
         if (status === "CREATE") {
            productData = { ...productData, feature: feature.values };
         } else if (status === "UPDATE") {
            productData = {
               ...productData,
               feature: feature.values,
            };
         }

         if (count2 === 0)
            dispatch(
               productDetailsValidateSlice.actions.changeErrorFormDetails(1)
            );
      } else {
         count++;

         dispatch(
            productDetailsValidateSlice.actions.changeErrorFormDetails(-1)
         );
      }
      if (salesForm?.isValid) {
         let listVoucherId = [];
         if (status === "CREATE") {
            listVoucherId = salesForm.values.voucher?.map(
               (voucher) => voucher.id
            );
            productData = {
               ...productData,
               price: salesForm.values.price,
               quantity: salesForm.values.quantity,
               promotionShopId: listVoucherId,
            };
         } else if (status === "UPDATE") {
            listVoucherId = salesForm.values.voucher?.map((voucher) => voucher);
            console.log(salesForm, ' sales form updated', listVoucherId);
            productData = {
               ...productData,
               salesForm: {
                  price: +salesForm.values.price,
                  quantity: +salesForm.values.quantity,
                  voucher: listVoucherId,
               },
            }
         }
         dispatch(productDetailsValidateSlice.actions.changeErrorFormSales(1));
      } else {
         count++;
         dispatch(productDetailsValidateSlice.actions.changeErrorFormSales(-1));
      }
      if (status === "UPDATE") {
         productData = {
            ...productData,
            listImages: listImageRemove,
            deleteVideo,
         };
      }
      formData.append("data", objectToBlob(productData), productData);
      if (count === 0) {
         if (status === "UPDATE") {
            handleUpdateProduct(formData);
         } else if (status === "CREATE") {
            handleCreateProduct(formData);
         }
      }
   };
   const handleUpdateProduct = async (formData) => {
      try {
         dispatch(globalConfigSlice.actions.changeBackDropState(true));

         const res = await api.put(`/shop-owner/products`, formData, {
            headers: {
               "Content-type": "multipart/form-data",
            },
         });
         const data = await res.data;
         dispatch(globalConfigSlice.actions.changeBackDropState(false));
         setCreateStatus({
            isOpen: true,
            status: true,
            message: "Product was successfully updated",
         });
      } catch (e) {
         dispatch(globalConfigSlice.actions.changeBackDropState(false));
         setCreateStatus({
            isOpen: true,
            status: false,
            message:
               "Something went wrong that can't update new product! Try again",
         });
         console.log(e);
      }
      dispatch(globalConfigSlice.actions.changeBackDropState(false));
   };
   const handleCreateProduct = async (formData) => {
      try {
         dispatch(globalConfigSlice.actions.changeBackDropState(true));
         const res = await api.post("/shop-owner/products", formData, {
            headers: {
               "Content-type": "multipart/form-data",
            },
         });
         const data = await res.data;
         console.log(data);
         dispatch(globalConfigSlice.actions.changeBackDropState(false));
         setCreateStatus({
            isOpen: true,
            status: true,
            message: "Successfully created product!",
         });
         navigate('/products')
        
    
      } catch (e) {
         console.log(e);
         setCreateStatus({
            isOpen: true,
            status: false,
            message:
               "Something went wrong that can't add new product! Try again",
         });
         dispatch(globalConfigSlice.actions.changeBackDropState(false));
      }
      dispatch(globalConfigSlice.actions.changeBackDropState(false));
   };
   useEffect(() => {
      return () => {
         dispatch(productDetailsValidateSlice.actions.clearData());
         dispatch(fileControlSlice.actions.clearData());
      };
   }, []);
   return (
      <div className={s.container}>
         <Grid2 container spacing={4}>
            <Grid2 xs={3}>
               <UpdateProductsStepper />
            </Grid2>
            <Grid2 xs={9}>
               <FormUpdateProduct />
            </Grid2>
         </Grid2>
         <div className={s.control}>
            {status === "CREATE" ? (
               <>
                  <Button
                     variant="outlined"
                     sx={{ fontSize: "2.4rem", width: "12rem" }}
                     onClick={() => {
                        basicForm?.resetForm();
                        detailsForm?.resetForm();
                        salesForm?.resetForm();
                        feature?.resetForm();
                      
                        dispatch(fileControlSlice.actions.clearData());
                     }}
                  >
                     Cancel
                  </Button>
                  <Button
                     variant="outlined"
                     sx={{ fontSize: "2.4rem", width: "12rem" }}
                     onClick={handleSubmit}
                  >
                     Save
                  </Button>
               </>
            ) : (
               <>
                  <Button
                     variant="outlined"
                     sx={{ fontSize: "2.4rem", width: "12rem" }}
                     onClick={() => {
                        basicForm?.resetForm();
                        detailsForm?.resetForm();
                        salesForm?.resetForm();
                        feature?.resetForm();
                        dispatch(fileControlSlice.actions.clearData());
                     }}
                  >
                     Reset
                  </Button>
                  <Button
                     variant="outlined"
                     sx={{ fontSize: "2.4rem", width: "12rem" }}
                     onClick={handleSubmit}
                  >
                     Update
                  </Button>
               </>
            )}
         </div>
         <Snackbar
            open={createStatus.isOpen}
            autoHideDuration={3000}
            onClose={() =>
               setCreateStatus((state) => {
                  return { ...state, isOpen: false };
               })
            }
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
         >
            <Collapse in={createStatus.isOpen}>
               <Alert
                  onClose={() =>
                     setCreateStatus((state) => {
                        return { ...state, isOpen: false };
                     })
                  }
                  severity={createStatus.status ? "success" : "error"}
                  variant="filled"
               >
                  <AlertTitle>
                     {createStatus.status ? "Success" : "Error"}
                  </AlertTitle>
                  {createStatus.message}
               </Alert>
            </Collapse>
         </Snackbar>
      </div>
   );
}
