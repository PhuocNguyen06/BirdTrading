import { Box, Button, Divider, Modal } from "@mui/material";
import s from "./inputImageFile.module.scss";
import React, { useRef, useState } from "react";
import clsx from "clsx";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { iconStyleAdded } from "./commonStyle";
import { useDispatch, useSelector } from "react-redux";
import { useId } from "react";
import fileControlSlice, {
   getCurrentEditSelector,
   getOpenEditSelector,
} from "./../../redux/fileControlSlice";
import { Cropper } from "react-cropper";
import { current } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import { useEffect } from "react";
import { dataAsyncUrlToFile } from "../../utils/myUtils";
import globalConfigSlice from "../../redux/globalConfigSlice";
import { getProductValidateStateSelector } from "../../redux/productDetailsValidateSlice";
export default function InputImageFile({ quantity }) {
   const hiddenFileInput = React.useRef(null);
   const dispatch = useDispatch();
   const openModel = useSelector(getOpenEditSelector);
   const currentEdit = useSelector(getCurrentEditSelector);
   const cropperRef = useRef(null);
   const [value, setValue] = useState("");
   const { status } = useSelector(getProductValidateStateSelector);

   const onChange = async (e) => {
      let files;
      if (e.dataTransfer) {
         files = e.dataTransfer.files;
      } else if (e.target) {
         files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
         dispatch(
            fileControlSlice.actions.changeCurrentEdit({
               id: 0,
               src: reader.result,
            })
         );
         cropperRef.isInput = true;
      };
      if (files[0]) {
         reader?.readAsDataURL(files[0]);
      } else {
      }
      setValue("");
   };
   const handleClick = (event) => {
      hiddenFileInput.current.click();
   };
   const ready = (currentEdit) => {
      return async (currentEdit2) => {
         dispatch(globalConfigSlice.actions.changeBackDropState(true));
         if (typeof cropperRef.current?.cropper !== "undefined") {
            //  cropperRef.current?.cropper.setCanvasData({
            //     top: 0,
            //     left: 0,
            //     width: "4000px",
            //     height: "4000px",
            //  });
            //  console.log(cropperRef.current?.cropper);
            //  console.log()
            cropperRef.current?.cropper.setCropBoxData({
               top: 0,
               left: 0,
               width: 500,
               height: 500,
            });
            if (cropperRef.isInput) {
               const dataBase64 = cropperRef.current?.cropper
                  ?.getCroppedCanvas()
                  ?.toDataURL();
               const id = v4();
               const file = await dataAsyncUrlToFile(
                  cropperRef.current?.cropper?.getCroppedCanvas()?.toDataURL(),
                  `${id}`
               );

               dispatch(
                  fileControlSlice.actions.addImagesPreview({
                     id: id,
                     src: dataBase64,
                     file: file,
                  })
               );
               cropperRef.isInput = false;
            }
         }
         dispatch(globalConfigSlice.actions.changeBackDropState(false));
      };
   };

   const handleCrop = async () => {
      console.log(cropperRef.current?.cropper?.getCroppedCanvas());
      const dataBase64 = cropperRef.current?.cropper
         ?.getCroppedCanvas()
         ?.toDataURL();

      const id = currentEdit.id;
      const file = await dataAsyncUrlToFile(
         cropperRef.current?.cropper?.getCroppedCanvas()?.toDataURL(),
         `${currentEdit.id}`
      );
      console.log(id);
      if (status === "UPDATE") {
         console.log(id);
         dispatch(fileControlSlice.actions.changeListRemoveUpdate(id));
      }
      dispatch(
         fileControlSlice.actions.cropImage({
            id: id,
            src: dataBase64,
            file: file,
         })
      );
      dispatch(fileControlSlice.actions.openEditor(false));
   };

   return (
      <>
         <div
            className={clsx(s.container, s.imageAdded, s.ripple)}
            onClick={handleClick}
         >
            <AddPhotoAlternateOutlinedIcon sx={iconStyleAdded} />
            <span style={{ textAlign: "center" }}>
               Add image
               <br />({quantity})
            </span>
            <input
               value={value}
               type="file"
               ref={hiddenFileInput}
               style={{ display: "none" }}
               onChange={onChange}
               accept="image/*"
            />
         </div>
         <Modal
            keepMounted
            open={openModel}
            onClose={() => dispatch(fileControlSlice.actions.openEditor(false))}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
         >
            <div className={s.modal}>
               <div id="modal-modal-title" className={s.title}>
                  <span>Edit image</span>
               </div>
               <Divider />
               <div id="modal-modal-description" className={s.control}>
                  <div>
                     <Cropper
                        style={{ height: "500px", width: "500px" }}
                        initialAspectRatio={1}
                        preview=".img-preview"
                        crossOrigin="anonymous"
                        src={currentEdit?.src}
                        ref={cropperRef}
                        aspectRatio={1}
                        viewMode={0}
                        guides={true}
                        minCropBoxHeight={100}
                        minCropBoxWidth={100}
                        responsive={true}
                        checkCrossOrigin={true}
                        checkOrientation={false}
                        modal={true}
                        ready={ready(currentEdit)}
                     />
                  </div>
                  <div className={s.preview}>
                     <div>
                        <span>Preview</span>
                        <div className={clsx(s.imagePreview, "img-preview")} />
                     </div>
                     <div className={s.buttonControl}>
                        <Button
                           color="template7"
                           variant="outlined"
                           sx={{ width: "9rem" }}
                           onClick={() =>
                              dispatch(
                                 fileControlSlice.actions.openEditor(false)
                              )
                           }
                        >
                           Cancel
                        </Button>
                        <Button
                           color="template7"
                           sx={{ width: "9rem" }}
                           variant="outlined"
                           onClick={handleCrop}
                        >
                           Save
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </Modal>
      </>
   );
}
