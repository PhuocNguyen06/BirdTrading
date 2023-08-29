import { Button, Divider, IconButton } from "@mui/material";
import s from "./inputImageFile.module.scss";
import React from "react";
import clsx from "clsx";
import PhotoSizeSelectLargeOutlinedIcon from "@mui/icons-material/PhotoSizeSelectLargeOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import fileControlSlice, {
   getVideoBlobSelector,
   getVideoPreviewSelector,
} from "../../redux/fileControlSlice";
import ReactPlayer from "react-player";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import { getProductValidateStateSelector } from "../../redux/productDetailsValidateSlice";
const style = {
   button: {},
   icon: {
      "&:hover": {
         color: "yellow",
      },
   },
};

export default function VideoPreview() {
   const video = useSelector(getVideoPreviewSelector);
   const dispatch = useDispatch();
   const videoBlob = useSelector(getVideoBlobSelector);
   const { status } = useSelector(getProductValidateStateSelector);
   return (
      <div className={clsx(s.container, s.previewImg)}>
         <ReactPlayer url={video} alt="" width={"100%"} height={"100%"} />
         <div className={s.control}>
            <IconButton
               color="inputImage"
               sx={style.icon}
               onClick={() =>
                  dispatch(fileControlSlice.actions.openVideoEditor(true))
               }
            >
               <VideoSettingsIcon sx={style.icon} />
            </IconButton>
            <Divider
               sx={{ background: "red", height: "1rem" }}
               color="inputImage"
               orientation="vertical"
            />
            <IconButton
               color="inputImage"
               sx={style.icon}
               onClick={() =>{
                  if(!videoBlob && status === "UPDATE"){
                     dispatch(fileControlSlice.actions.changeDeleteVideo(true));
                  }
                  dispatch(fileControlSlice.actions.removeVideoPreview())
               }
               }
            >
               <DeleteOutlineIcon sx={style.icon} />
            </IconButton>
         </div>
      </div>
   );
}
