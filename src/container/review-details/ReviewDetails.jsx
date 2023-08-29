import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/api";
import useBreadCrumb from "../../custom-hook/useBreadCrumb";
import { breadCrumbs } from "../../config/constant";
import {
   Avatar,
   Box,
   Divider,
   Rating,
   Skeleton,
   Typography,
} from "@mui/material";
import theme from "../../style/theme";
import moment from "moment";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

let breadCrumbPath = [breadCrumbs.REVIEWS, breadCrumbs.REVIEWS_DETAILS];

export default function ReviewDetails() {
   useBreadCrumb(breadCrumbPath);
   const params = useParams();
   const [reviewDetails, setReviewDetails] = useState();
   useEffect(() => {
      getReviewDetailsById();
   }, []);
   const getReviewDetailsById = async () => {
      try {
         const res = await api.get(`/shop-owner/reviews/${params.reviewId}`);
         const data = await res.data;
         console.log(data);
         setReviewDetails(data);
      } catch (err) {}
   };
   return (
      <Box pt={3} width="80%" display={"flex"} flexDirection={"column"} gap={3}>
         {reviewDetails ? (
            <>
               <Typography variant="h4">
                  Review details #{params.reviewId}
               </Typography>
               <Box
                  sx={{
                     width: "100%",
                     backgroundColor: theme.palette.template5.main,
                     borderRadius: "0.8rem",
                  }}
                  height="fit-content"
                  p={"2rem 3rem"}
                  display={"flex"}
                  flexDirection={"column"}
                  gap={2}
               >
                  <Box m={1}>
                     <Typography variant="h5" color={"delivered.main"}>
                        Order details
                     </Typography>
                     <Divider />
                  </Box>
                  <Grid2 container>
                     <Grid2 xs={2}>
                        <Typography>Order details:</Typography>
                     </Grid2>
                     <Grid2 xs={10}>
                        <Typography>
                           {" "}
                           <Link
                              to={`/order/order-details/${reviewDetails.orderId}`}
                           >
                              #{reviewDetails.orderDetailId}
                           </Link>
                        </Typography>
                     </Grid2>
                  </Grid2>
                  <Grid2 container>
                     <Grid2 xs={2}>
                        <Typography>Product name:</Typography>
                     </Grid2>
                     <Grid2 xs={10}>
                        <Typography>
                           {" "}
                           <Link
                              to={`/products/update-product/${reviewDetails.productId}`}
                           >
                              {reviewDetails.productName}
                           </Link>
                        </Typography>
                     </Grid2>
                  </Grid2>
               </Box>
               <Box
                  sx={{
                     width: "100%",
                     backgroundColor: theme.palette.template5.main,
                     borderRadius: "0.8rem",
                  }}
                  height="fit-content"
                  p={"2rem 3rem"}
               >
                  <Box m={1}>
                     <Box display={"flex"} justifyContent={"space-between"}>
                        <Typography variant="h5" color={"delivered.main"}>
                           Review
                        </Typography>
                        <Typography variant="h5" color={"delivered.main"}>
                           {moment(reviewDetails.reviewDate).format(
                              "HH:mm DD/MM/YYYY"
                           )}
                        </Typography>
                     </Box>
                     <Divider />
                  </Box>

                  <Box display={"flex"} gap={1} alignItems={"center"}>
                     <Avatar
                        src={reviewDetails?.account?.imgUrl}
                        sx={{ width: "8rem", height: "8rem" }}
                     />
                     <Typography variant="h5">
                        {reviewDetails?.account?.fullName}
                     </Typography>
                     <Rating
                        value={reviewDetails.rating}
                        readOnly
                        precision={0.5}
                     />
                  </Box>
                  <Box mt={2}>
                     <Box width={"fit-content"}>
                        <Typography sx={{ fontSize: "2rem" }}>
                           Comment
                        </Typography>
                        <Divider />
                     </Box>
                     <div
                        style={{ fontSize: "2rem" }}
                        dangerouslySetInnerHTML={{
                           __html: `${reviewDetails.description}`,
                        }}
                     />
                  </Box>
                  <Box height={"fit-content"} display={"flex"} gap={2}>
                     {reviewDetails?.imgUrl?.map((img) => (
                        <Box
                           key={`${img}`}
                           sx={{ width: "20rem", height: "fit-content" }}
                        >
                           <img src={img} style={{ width: "100%" }} alt="" />
                        </Box>
                     ))}
                  </Box>
               </Box>
            </>
         ) : (
            <Skeleton />
         )}
      </Box>
   );
}
