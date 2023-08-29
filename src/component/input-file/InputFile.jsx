import Cropper from "react-cropper";
import "./Demo.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { api } from "./../../api/api";
import axios from "axios";
import { dataAsyncUrlToFile, objectToBlob } from "../../utils/myUtils";

const defaultSrc =
   "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

const Demo = () => {
   const [image, setImage] = useState();
   const [cropData, setCropData] = useState("#");
   const cropperRef = useRef(null);
   const [imageFile, setImageFile] = useState(null);
   const onChange = async (e) => {
      e.preventDefault();

      let files;
      if (e.dataTransfer) {
         files = e.dataTransfer.files;
         console.log("dataTransfer", e.target.files, "target");
      } else if (e.target) {
         files = e.target.files;
         setImageFile(e.target.files[0]);
         console.log("target", e.target.file);
      }
      const reader = new FileReader();
      reader.onload = () => {
         setImage(reader.result);
      };
      if (files[0]) reader?.readAsDataURL(files[0]);
      cropperRef.current?.cropper.setCropBoxData({
         top: 0,
         left: 0,
         width: 200,
         height: 200,
      });
   };
   const getCropData = () => {
      if (typeof cropperRef.current?.cropper !== "undefined") {
         setCropData(
            cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
         );
      }
   };

   const onCrop = () => {};
   const a = () => {
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
            width: 200,
            height: 200,
         });
         setCropData(
            cropperRef.current?.cropper?.getCroppedCanvas()?.toDataURL()
         );
      }
   };

   const handleSubmit = async () => {
      try {
         console.log(
            cropperRef.current?.cropper?.getCroppedCanvas()?.toDataURL(),
            "urlllllllll"
         );
         const file = await dataAsyncUrlToFile(
            cropperRef.current?.cropper?.getCroppedCanvas()?.toDataURL(),
            "test.png"
         );
         const formData = new FormData();
         formData.append("multipart", file);
         formData.append("multipart", imageFile);
         formData.append(
            "data",
            objectToBlob({
               name: "basdfasdfasdfaasdfasfasdfsdfasdfasdfird",
               price: 1.2321321321,
               description: "ahiasdfasdfasdfasdfhi 123123123123",
            })
         );
         const res = await api.post("/upload", formData);
         const data = await res.data;
      } catch (e) {
         console.error(e);
      }
   };
   return (
      <div>
         <div style={{ width: "100%" }}>
            <input type="file" onChange={onChange} />
            <button>Use default img</button>
            <button onClick={handleSubmit}>Submit image</button>
            <br />
            <br />
            <div style={{ width: "100%" }}>
               <Cropper
                  style={{ height: "200px", width: "200px" }}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  ref={cropperRef}
                  aspectRatio={1}
                  viewMode={0}
                  guides={true}
                  minCropBoxHeight={100}
                  minCropBoxWidth={100}
                  background={true}
                  responsive={true}
                  checkOrientation={false}
                  modal={true}
                  crop={onCrop}
                  ready={a}
               />
            </div>
         </div>
         <div>
            <div className="box" style={{ width: "50%", float: "right" }}>
               <h1>Preview</h1>
               <div
                  className="img-preview"
                  style={{ width: "100%", float: "left", height: "300px" }}
               />
            </div>
            <div
               className="box"
               style={{ width: "50%", float: "right", height: "300px" }}
            >
               <h1>
                  <span>Crop</span>
                  <button style={{ float: "right" }} onClick={getCropData}>
                     Crop Image
                  </button>
               </h1>
               <img style={{ width: "100%" }} src={cropData} alt="cropped" />
            </div>
         </div>
         <br style={{ clear: "both" }} />
      </div>
   );
};

export default Demo;
