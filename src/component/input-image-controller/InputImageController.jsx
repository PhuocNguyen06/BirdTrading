import { useSelector } from "react-redux";
import InputImageFile from "../input-media-file/InputImageFile";
import s from "./inputImageController.module.scss";
import React from "react";
import { getListImagesPreviewSelector } from "../../redux/fileControlSlice";
import ImagePreview from "../input-media-file/ImagePreview";

export default function InputImageController() {
   const listImagePreview = useSelector(getListImagesPreviewSelector);
   return (
      <div className={s.container}>
         {listImagePreview?.map((image) => (
            <ImagePreview image={image} key={image.id}/>
         ))}
         <InputImageFile type="input" quantity={`${listImagePreview.length}/9`}/>
      </div>
   );
}
