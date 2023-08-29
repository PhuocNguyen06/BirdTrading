import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userRoleSelector } from "../redux/userInfoSlice";

export default function useAuthenticate(roles) {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const userRole = useSelector(userRoleSelector);

   useEffect(() => {

      console.log(userRole, roles);
      const isExist = roles.find(role => role.code === userRole);
      if(!isExist) {
         console.error('Unauthorized');
         navigate('/page-not-found')
      }
   }, []);

}
