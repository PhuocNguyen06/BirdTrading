import s from "./inputImageFile.module.scss";
import clsx from "clsx";
import React from "react";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { iconStyleAdded } from "./commonStyle";
import { useDispatch, useSelector } from "react-redux";
import fileControlSlice, {
   getErrorMessageSelector,
   getIdVideoEditorSelector,
   getOpenEditSelector,
   getVideoPreviewSelector,
} from "../../redux/fileControlSlice";
import { Alert, Divider, Modal, Snackbar } from "@mui/material";
import ReactPlayer from "react-player";
import { dataAsyncUrlToFile } from "../../utils/myUtils";
export default function InputVideoFile({ quantity }) {
   const hiddenFileInput = React.useRef(null);
   const dispatch = useDispatch();
   const video = useSelector(getVideoPreviewSelector);
   const openModel = useSelector(getIdVideoEditorSelector);
   const error = useSelector(getErrorMessageSelector);
   const handleClick = (event) => {
      hiddenFileInput.current.click();
   };

   const validateSelectedFile = (selectedFile, setError) => {
      const MIN_FILE_SIZE = 1024; // 1MB
      const MAX_FILE_SIZE = 1024 * 10; // 5MB

      if (!selectedFile) {
         return false;
      }

      const fileSizeKiloBytes = selectedFile.size / 1024;
      console.log(fileSizeKiloBytes, "not error");
      if (fileSizeKiloBytes > MAX_FILE_SIZE) {
         dispatch(
            fileControlSlice.actions.setErrorMessage(
               `The video file size of ${Number(
                  +fileSizeKiloBytes / 1024
               ).toFixed(1)}MB exceeds the maximum limit allowed.`
            )
         );
         return false;
      }
      return true;
   };
   const handleAddVideo = (e) => {
      e.preventDefault();
      let files;
      if (e.dataTransfer) {
         files = e.dataTransfer.files;
      } else if (e.target) {
         files = e.target.files;
      }
      const isValidSize = validateSelectedFile(files[0]);
      if (isValidSize) {
         const reader = new FileReader();
         reader.onload = async () => {
            console.log(reader.result);
            const file = await dataAsyncUrlToFile(reader.result, "video");
            dispatch(fileControlSlice.actions.addVideoPreview(reader.result));
            dispatch(fileControlSlice.actions.setVideoBlob(file));
         };
         if (files[0]) reader?.readAsDataURL(files[0]);
      } else {
         console.log("erorrrrrrrrrrrr");
      }
   };
   return (
      <>
         <div
            className={clsx(s.container, s.imageAdded, s.ripple)}
            onClick={handleClick}
         >
            <VideoCallIcon sx={iconStyleAdded} />
            <span style={{ textAlign: "center" }}>
               Add video
               <br />({quantity})
            </span>
            <input
               ref={hiddenFileInput}
               type="file"
               style={{ display: "none" }}
               accept="video/*"
               onChange={handleAddVideo}
            />
         </div>

         <Modal
            open={openModel}
            onClose={() =>
               dispatch(fileControlSlice.actions.openVideoEditor(false))
            }
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
         >
            <div className={s.modal}>
               <div id="modal-modal-title" className={s.title}>
                  <h1>Preview video</h1>
               </div>
               <Divider />
               <div id="modal-modal-description" className={s.videoControl}>
                  <ReactPlayer
                     controls
                     url={video}
                     alt=""
                     width={"100%"}
                     height={"100%"}
                  />
               </div>
            </div>
         </Modal>
      </>
   );
}
