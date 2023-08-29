import { Box, Button, Modal, Tab, Tabs } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useState } from "react";
import theme from "../../style/theme";
import clsx from "clsx";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { modelStyle } from "./../../config/constant";
import AdminCreatePromotionForm from "../admin-create-promotion-form/AdminCreatePromotionForm";

export default function AdminPromotionController() {
   const [openModel, setOpenModel] = useState(false);
   const handleCreatePromotion = () => {
      setOpenModel(true);
   };
   const handleCloseModelDelete = () => {
      setOpenModel(false);
   };
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
               <Tabs value={1}>
                  <Tab label={"Promotion"} value={1} />
               </Tabs>
            </Grid2>
            <Grid2 xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
               <Button
                  id="basic-button"
                  onClick={handleCreatePromotion}
                  variant="outlined"
               >
                  Create new promotion
               </Button>
            </Grid2>
         </Grid2>
         <Modal
            keepMounted={false}
            open={openModel}
            onClose={handleCloseModelDelete}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
         >
            <AdminCreatePromotionForm closeModel={handleCloseModelDelete}/>
         </Modal>
      </Box>
   );
}
