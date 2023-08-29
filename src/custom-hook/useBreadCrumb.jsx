import { useEffect } from "react";
import { useDispatch } from "react-redux";
import sideBarSlice from "../redux/sideBarSlice";

export default function useBreadCrumb(breadCrumbsPath, isDisabled) {
   const dispatch = useDispatch();
   useEffect(() => {
      
      dispatch(sideBarSlice.actions.changeBreadCrumb(breadCrumbsPath));
      if (breadCrumbsPath) {
         const firstBreadCrumb = breadCrumbsPath[0];
         dispatch(
            sideBarSlice.actions.changeCurrentActive(firstBreadCrumb?.id)
         );
      }
   }, []);
}
