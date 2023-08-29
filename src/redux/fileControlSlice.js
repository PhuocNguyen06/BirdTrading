import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import { convertImageUrlToBase64, dataAsyncUrlToFile } from "../utils/myUtils";
const initialState = {
   listImagesPreview: [],
   currentEdit: {},
   isOpenEdit: false,
   videoPreview: "",
   videoBlob: "",
   isVideoOpenEdit: false,
   errorMessage: "",
   listImageRemove: [],
   deleteVideo: false,
};
const fileControlSlice = createSlice({
   name: "fileControlSlice",
   initialState: initialState,
   reducers: {
      openVideoEditor: (state, action) => {
         state.isVideoOpenEdit = action.payload;
      },
      addVideoPreview: (state, action) => {
         state.videoPreview = action.payload;
      },
      addImagesPreview: (state, action) => {
         console.log(action.payload, "image preview");
         state.listImagesPreview?.push(action.payload);
         state.currentEdit = {
            id: 0,
            src: "",
         };
      },

      openEditor: (state, action) => {
         state.isOpenEdit = action.payload;
      },
      changeCurrentEdit: (state, action) => {
         console.log(action.payload);
         state.currentEdit = action.payload;
      },
      cropImage: (state, action) => {
         state.listImagesPreview.map((image) => {
            if (image.id === action.payload.id) {
               image.src = action.payload.src;
               image.file = action.payload.file;
               return image;
            } else {
               return image;
            }
         });
      },
      removeImage: (state, action) => {
         console.log(action.payload);

         state.listImagesPreview = state.listImagesPreview.filter(
            (image) => image.id !== action.payload.id
         );
      },
      setErrorMessage: (state, action) => {
         state.errorMessage = action.payload;
      },
      removeVideoPreview: (state, action) => {
         state.videoPreview = "";
         console.log(current(state));
      },
      setVideoBlob: (state, action) => {
         state.videoBlob = action.payload;
      },
      clearData: (state, action) => {
         return initialState;
      },
      changeListRemoveUpdate: (state, action) => {
         const removeImage = state.listImagesPreview.find(
            (image) => image.id === action.payload
         );
         console.log(removeImage);
         if (removeImage) {
            if (!removeImage.file) {
               console.log(removeImage.src, 'remove image')
               state.listImageRemove.push(removeImage.src);
            } else {
               console.log(removeImage.src, 'not remove')
            }
         }
      },
      changeDeleteVideo: (state, action) => {
         state.deleteVideo = action.payload;
      }
   },
   extraReducers: (builder) =>
      builder
         .addCase(getListImagesForUpdate.fulfilled, (state, action) => {
            const { listImagesPreview, videoPreview } = action.payload;
            state.listImagesPreview = listImagesPreview;
            state.videoPreview = videoPreview;
         })
         .addCase(getListImagesForUpdate.pending, (state, action) => {})
         .addCase(getListImagesForUpdate.rejected, (state, action) => {
            console.log(action.payload, "errorrrrrrrrrr");
         }),
});

export default fileControlSlice;

export const getListImagesForUpdate = createAsyncThunk(
   "fileControlSlice/getListImagesForUpdate",
   async ({ listImage, video }) => {
      const listImagePreview = listImage.map((image) => {
         return { id: v4(), src: image };
      });
      return {
         listImagesPreview: listImagePreview,
         videoPreview: video,
      };
   }
);
export const getListImagesPreviewSelector = (state) =>
   state.fileControlSlice.listImagesPreview;
export const getOpenEditSelector = (state) => state.fileControlSlice.isOpenEdit;
export const getCurrentEditSelector = (state) =>
   state.fileControlSlice.currentEdit;
export const getVideoPreviewSelector = (state) =>
   state.fileControlSlice.videoPreview;
export const getIdVideoEditorSelector = (state) =>
   state.fileControlSlice.isVideoOpenEdit;

export const getErrorMessageSelector = (state) =>
   state.fileControlSlice.errorMessage;
export const getVideoBlobSelector = (state) => state.fileControlSlice.videoBlob;


export const getListImageRemoveSelector = state => state.fileControlSlice.listImageRemove;

export const getDeleteVideoSelector = state => state.deleteVideo;