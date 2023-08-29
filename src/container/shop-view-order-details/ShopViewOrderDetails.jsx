import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";
import { breadCrumbs } from "./../../config/constant";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import { Box, Chip, Divider, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import theme from "../../style/theme";
import clsx from "clsx";
import { formatNumber, formatQuantity } from "../../utils/myUtils";
import moment from "moment";
let breadCrumbPath = [breadCrumbs.ORDER, breadCrumbs.ORDER_DETAILS];

const boxStyle = {
   backgroundColor: theme.palette.template5.main,
   borderRadius: "0.8rem",
};
export default function ShopViewOrderDetails() {
   useBreadCrumb(breadCrumbPath);
   const params = useParams();
   const [orderDetails, setOrderDetails] = useState(null);
   useEffect(() => {
      if (params.orderId) {
         getOrderDetailsByOrderId(params.orderId);
      }
   }, [params]);
   const getOrderDetailsByOrderId = async (id) => {
      try {
         const res = await api.get(`shop-owner/order-detail/order/${id}`);
         const data = await res.data;
         console.log(data);
         setOrderDetails(data);
      } catch (e) {
         console.error(e);
      }
   };
   return (
      <Box width={"100%"} p={"4rem 5rem"}>
         {orderDetails ? (
            <Grid2 container spacing={4}>
               <Grid2 xs={7}>
                  <Box
                     sx={{ ...boxStyle, padding: "2rem 1.5rem" }}
                     className={clsx("box-shadow")}
                     display={"flex"}
                     flexDirection={"column"}
                     gap={2}
                  >
                     <Box>
                        <Typography variant="h4">Order details</Typography>
                        <Divider color="template7.main" />
                     </Box>
                     <Box
                        sx={{
                           display: "flex",
                           flexDirection: "column",
                           gap: "2.4rem",
                        }}
                     >
                        {orderDetails.orderDetails ? (
                           <>
                              {orderDetails.orderDetails.map((details) => (
                                 <Grid2
                                    container
                                    key={details.id}
                                    sx={{
                                       backgroundColor:
                                          theme.palette.template2.main,
                                       boxShadow: "2px 3px 5px #7b7b7b5f",
                                    }}
                                 >
                                    <Grid2
                                       xs={2}
                                       sx={{ border: "1px solid #161616" }}
                                    >
                                       <img
                                          style={{ width: "100%" }}
                                          src={details.imgUrl}
                                          alt=""
                                       />
                                    </Grid2>
                                    <Grid2
                                       xs={5}
                                       display={"flex"}
                                       alignItems={"center"}
                                       sx={{ padding: "0.8rem" }}
                                    >
                                       <Typography
                                          variant="h5"
                                          color="template7.main"
                                       >
                                          {details.productName}
                                       </Typography>
                                    </Grid2>
                                    <Grid2
                                       xs={5}
                                       display={"flex"}
                                       flexDirection={"column"}
                                       justifyContent={"center"}
                                       alignItems={"center"}
                                    >
                                       <Typography sx={{ fontSize: "2rem" }}>
                                          {formatNumber(details.price)} x{" "}
                                          {formatQuantity(details.quantity)}
                                       </Typography>
                                       <Box>
                                          {details.listPromotion.map(
                                             (promotion) => (
                                                <Chip
                                                   key={promotion.id}
                                                   variant="outlined"
                                                   color="paypal"
                                                   label={
                                                      <Typography>
                                                         {promotion.name} -{" "}
                                                         {
                                                            promotion.discountRate
                                                         }
                                                         %
                                                      </Typography>
                                                   }
                                                />
                                             )
                                          )}
                                       </Box>
                                    </Grid2>
                                 </Grid2>
                              ))}
                           </>
                        ) : (
                           ""
                        )}
                     </Box>
                  </Box>
               </Grid2>
               <Grid2
                  xs={5}
                  sx={{
                     display: "flex",
                     flexDirection: "column",
                     gap: "2.4rem",
                  }}
               >
                  <Box
                     sx={{ ...boxStyle, padding: "2rem 1rem" }}
                     className={clsx("box-shadow")}
                     display={"flex"}
                     flexDirection={"column"}
                     gap={"1rem"}
                  >
                     <Box>
                        <Typography variant="h4" color={"paypal.contrastText"}>
                           Order date:{" "}
                           {moment(orderDetails.createdDate).format(
                              "HH:mm DD/MM/YY"
                           )}
                        </Typography>
                        <Divider color="template7.main" />
                     </Box>
                     <Box
                        display={"flex"}
                        flexDirection={"column"}
                        gap={"1rem"}
                        p="2rem 2rem"
                     >
                        <Box display={"flex"} justifyContent={"space-between"}>
                           <Typography variant="h5">Total price:</Typography>{" "}
                           <Typography variant="h5" color={"template8.main"}>
                              {formatNumber(orderDetails.totalPriceProduct)}
                           </Typography>
                        </Box>
                        <Box display={"flex"} justifyContent={"space-between"}>
                           <Typography variant="h5">Shipping fee:</Typography>{" "}
                           <Typography variant="h5" color={"template8.main"}>
                              {formatNumber(orderDetails.shippingFee)}
                           </Typography>
                        </Box>
                        <Divider />
                        <Box display={"flex"} justifyContent={"space-between"}>
                           <Typography variant="h5">Total payment:</Typography>{" "}
                           <Typography variant="h5" color={"template8.main"}>
                              {formatNumber(
                                 +orderDetails.shippingFee +
                                    +orderDetails.totalPriceProduct
                              )}
                           </Typography>
                        </Box>
                     </Box>
                  </Box>
                  <Box
                     sx={{ ...boxStyle, padding: "2rem 1.5rem" }}
                     className={clsx("box-shadow")}
                     display={"flex"}
                     flexDirection={"column"}
                     gap={2}
                  >
                     <Box>
                        <Typography variant="h4" color={"paypal.contrastText"}>
                           Status
                        </Typography>
                        <Divider color="template7.main" />
                     </Box>
                     <Box
                        display={"flex"}
                        flexDirection={"column"}
                        gap={"2rem"}
                     >
                        <Box display={"flex"} justifyContent={"space-between"}>
                           <Typography variant="h5">Last update:</Typography>{" "}
                           <Typography variant="h5" color={"template8.main"}>
                              {moment(orderDetails.lastedUpdate).format(
                                 "HH:mm DD/MM/YY"
                              )}
                           </Typography>
                        </Box>
                        <Box display={"flex"} justifyContent={"space-between"}>
                           <Typography variant="h5">Current:</Typography>{" "}
                           <Typography variant="h5" color={"template8.main"}>
                              {orderDetails.orderStatus}
                           </Typography>
                        </Box>
                        <Box display={"flex"} justifyContent={"space-between"}>
                           <Typography variant="h5">Payment method:</Typography>{" "}
                           <Typography variant="h5" color={"template8.main"}>
                              {orderDetails.paymentMethod}
                           </Typography>
                        </Box>
                     </Box>
                  </Box>
                  <Box
                     sx={{ ...boxStyle, padding: "2rem 1.5rem" }}
                     className={clsx("box-shadow")}
                     display={"flex"}
                     flexDirection={"column"}
                     gap={2}
                  >
                     <Box>
                        <Typography variant="h4" color={"paypal.contrastText"}>
                           Delivery information
                        </Typography>
                        <Divider color="template7.main" />
                     </Box>
                     <Box
                        display={"flex"}
                        flexDirection={"column"}
                        gap={"2rem"}
                     >
                        <Box display={"flex"} justifyContent={"space-around"}>
                           <Typography variant="h5">
                              {orderDetails.address?.fullName}
                           </Typography>
                           <Divider
                              orientation="vertical"
                              color="template8.contrastText"
                           />
                           <Typography variant="h5">
                              {orderDetails.address?.phone}
                           </Typography>{" "}
                        </Box>
                        <Box display={"flex"} justifyContent={"space-between"}>
                           <Typography variant="h5" color={"template8.main"}>
                              {orderDetails.address?.address}
                           </Typography>
                        </Box>
                     </Box>
                  </Box>
               </Grid2>
            </Grid2>
         ) : (
            ""
         )}
      </Box>
   );
}
