import { useSelector } from "react-redux";
import InputVideoFile from "../input-media-file/InputVideoFile";
import s from "./inputVideoController.module.scss";
import React from "react";
import { getVideoPreviewSelector } from "../../redux/fileControlSlice";
import VideoPreview from "../input-media-file/VideoPreview";

export default function InputVideoController() {
   const video = useSelector(getVideoPreviewSelector);

   return (
      <div className={s.container}>
         {video && <VideoPreview />}
         <InputVideoFile quantity={`${video ? 1 : 0}/1`}/>
      </div>
   );
}
