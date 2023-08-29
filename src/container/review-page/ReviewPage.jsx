import React from "react";
import ReviewTable from "../../component/review-table/ReviewTable";
import ReviewBarController from "../../component/review-bar-controller/ReviewBarController";
import s from "./reviewPage.module.scss";
import { breadCrumbs } from "../../config/constant";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";

let breadCrumbPath = [breadCrumbs.REVIEWS];
export default function ReviewPage() {
   useBreadCrumb(breadCrumbPath)
   return (
      <div className={s.container}>
         <div className={s.headerTable}>
            <h2>Review manager</h2>
            <ReviewBarController />
         </div>
         <div style={{ height: "60rem", width: "100%" }}>
            <ReviewTable />
         </div>
      </div>
   );
}
