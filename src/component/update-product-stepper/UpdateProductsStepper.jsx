import {
   Box,
   Button,
   Step,
   StepLabel,
   Stepper,
   Typography,
} from "@mui/material";
import s from "./updateProductsSteper.module.scss";
import React from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { getFormRefSelector } from "../../redux/productDetailsSlice";
import {
   getCategoryInForm,
   getErrorFormSelector,
} from "../../redux/productDetailsValidateSlice";
const steps = [
   "Select campaign settings",
   "Create an ad group",
   "Create an ad",
];

export default function UpdateProductsStepper() {
   const category = useSelector(getCategoryInForm);
   const formRef = useSelector(getFormRefSelector);
   const errorForm = useSelector(getErrorFormSelector);
   const labelProps = (state) => {
      if (state) {
         const labelProps = {};
         labelProps.optional = (
            <Typography variant="caption" color="error">
               Error step
            </Typography>
         );
         labelProps.error = true;
         return labelProps;
      } else {
         return labelProps;
      }
   };

   const handleScrollToElement = (targetRef) => {
      const headerHeight = 100; // Adjust this value based on your header height

      // Calculate the target element's position relative to the document
      const targetElement = targetRef;
      const targetPosition =
         targetElement?.getBoundingClientRect().top + window.pageYOffset;

      // Calculate the target Y position with the additional offset
      const targetY = targetPosition - headerHeight;

      // Scroll to the target element with the offset
      window.scrollTo({ top: targetY, behavior: "smooth" });
   };
   return (
      <div className={clsx(s.container, "box-shadow")}>
         <Stepper activeStep={-1} orientation="vertical" color="primary">
            <Step
               color="primary"
               completed={errorForm.basic === 1}
               active
               className={clsx(s.step)}
               onClick={() => handleScrollToElement(formRef.basicRef)}
            >
               <StepLabel
                  color="primary"
                  {...labelProps(errorForm.basic === -1)}
               >
                  Basic information
               </StepLabel>
            </Step>
            <Step
               active={category !== 0 ? true : false}
               completed={errorForm.details === 1}
               color="primary"
               className={clsx(s.step)}
               onClick={() => handleScrollToElement(formRef.detailsRef)}
            >
               <StepLabel {...labelProps(errorForm.details === -1)}>
                  Details information
               </StepLabel>
            </Step>
            <Step
               active={category !== 0 ? true : false}
               completed={errorForm.sales === 1}
               className={clsx(s.step)}
               color="primary"
               onClick={() => handleScrollToElement(formRef.salesRef)}
            >
               <StepLabel {...labelProps(errorForm.sales === -1)}>
                  Sales information
               </StepLabel>
            </Step>
         </Stepper>
      </div>
   );
}
