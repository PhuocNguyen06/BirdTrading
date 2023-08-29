import axios from "axios";

import qs from "qs";
import { BASE_URL } from "./url_config";

export const api = axios.create({
   baseURL: `${process.env.REACT_APP_BASE_URL}`,
   withCredentials: true,
   headers: {
      "Access-Control-Allow-Origin": "*",
   },
});
api.defaults.paramsSerializer = (params) =>
   qs.stringify(params, { arrayFormat: "repeat" });

api.interceptors.request.use(
   (config) => {
      if (!config.headers.Authorization) {
         const token = localStorage.getItem("token");
         if (token) {
            config.headers.Authorization = `Bearer ${token}`;
         }
      }
      console.log(config);
      return config;
   },
   (error) => Promise.reject(error)
);
api.interceptors.response.use(
   (response) => {
      console.log(response);
      // Edit response config
      return response;
   },
   (error) => {
      console.log(error);
      if (error.response.status === 423) {
         console.log("error 423");
         window.location.href = "/handle-banned?auth=403";
      } else if (error.response.status === 406) {
         window.location.href = "/login?auth=406";
      } else if (error.response.status === 401) {
         console.log(error.response)
         window.location.href = `${process.env.REACT_APP_REDIRECT_USER}login?error=6`;
      } else {
         throw error;
      }
   }
);
