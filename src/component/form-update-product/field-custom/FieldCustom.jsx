import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import s from "../formUpdateProduct.module.scss";
export default function FieldCustom({
   children,
   title,
   isRequired,
   position,
   helper,
}) {
   return (
      <Grid2 container spacing={3}>
         <Grid2
            xs={3}
            sx={{
               display: "flex",
               justifyContent: "flex-end",
               alignItems: position,
            }}
         >
            {isRequired ? (
               <span
                  className={s.fieldTitle}
                  style={{ color: "red", marginRight: "2px" }}
               >
                  *
               </span>
            ) : (
               ""
            )}
            <span className={s.fieldTitle} style={{textAlign: 'end'}}>
               {title} <br /> <span style={{fontSize: '1.6rem', color: '#24242488'}}>{helper}</span>
            </span>
         </Grid2>
         <Grid2 xs={9}>{children}</Grid2>
      </Grid2>
   );
}
