import {
   Box,
   Chip,
   Input,
   MenuItem,
   Rating,
   Select,
   Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
   getListVouchers,
   productDetailsSelector,
} from "../../redux/productDetailsSlice";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";

const CustomFiltera = ({ applyValue, item }) => {
   const handleFilterChange = (event) => {
      console.log(event.target.value, item, applyValue);
      let newItem = { ...item, value: event.target.value };
      applyValue(newItem);
   };

   return (
      <Box>
         <Typography
            sx={{ padding: "0", fontSize: "1.6rem", lineHeight: "1.6rem" }}
         >
            value
         </Typography>
         <Input
            placeholder="Filter..."
            value={item.value}
            onChange={handleFilterChange}
         />
      </Box>
   );
};
const CustomFilteraStatus = ({ applyValue, item }) => {
   const handleFilterChange = (event) => {
      console.log(event.target.value, item, applyValue);
      let newItem = { ...item, value: event.target.value };
      applyValue(newItem);
   };

   return (
      <Box>
         <Typography
            sx={{ padding: "0", fontSize: "1.6rem", lineHeight: "1.6rem" }}
         >
            value
         </Typography>
         <Select
            defaultValue={""}
            value={item.value}
            onChange={handleFilterChange}
            sx={{ width: "100%" }}
            MenuProps={{ disableScrollLock: true }}
         >
            <MenuItem value={9}>ALL</MenuItem>
            <MenuItem value={0}>PENDING</MenuItem>
            <MenuItem value={1}>PROCESSING</MenuItem>
            <MenuItem value={2}>SHIPPED</MenuItem>
            <MenuItem value={3}>SHIPPING</MenuItem>
            <MenuItem value={4}>DELIVERED</MenuItem>
         </Select>
      </Box>
   );
};
const CustomFilterPaymentMethod = ({ applyValue, item }) => {
   const handleFilterChange = (event) => {
      console.log(event.target.value, item, applyValue);
      let newItem = { ...item, value: event.target.value };
      applyValue(newItem);
   };

   return (
      <Box>
         <Typography
            sx={{ padding: "0", fontSize: "1.6rem", lineHeight: "1.6rem" }}
         >
            value
         </Typography>
         <Select
            defaultValue={""}
            value={item.value}
            onChange={handleFilterChange}
            sx={{ width: "100%" }}
            MenuProps={{ disableScrollLock: true }}
         >
            <MenuItem value={"9"}>ALL</MenuItem>
            <MenuItem value={"PAYPAL"}>PAYPAL</MenuItem>
            <MenuItem value={"DELIVERY"}>COD</MenuItem>
         </Select>
      </Box>
   );
};
const CustomFilterTransactionStatus = ({ applyValue, item }) => {
   const handleFilterChange = (event) => {
      console.log(event.target.value, item, applyValue);
      let newItem = { ...item, value: event.target.value };
      applyValue(newItem);
   };

   return (
      <Box>
         <Typography
            sx={{ padding: "0", fontSize: "1.6rem", lineHeight: "1.6rem" }}
         >
            value
         </Typography>
         <Select
            defaultValue={""}
            value={item.value}
            onChange={handleFilterChange}
            sx={{ width: "100%" }}
            MenuProps={{ disableScrollLock: true }}
         >
            <MenuItem value={9}>ALL</MenuItem>
            <MenuItem value={1}>PROCESSING</MenuItem>
            <MenuItem value={2}>SUCCESS</MenuItem>
            <MenuItem value={3}>REFUNDED</MenuItem>
         </Select>
      </Box>
   );
};
const CustomFilterAdminUser = ({ applyValue, item }) => {
   const handleFilterChange = (event) => {
      console.log(event.target.value, item, applyValue);
      let newItem = { ...item, value: event.target.value };
      applyValue(newItem);
   };

   return (
      <Box>
         <Typography
            sx={{ padding: "0", fontSize: "1.6rem", lineHeight: "1.6rem" }}
         >
            value
         </Typography>
         <Select
            defaultValue={""}
            value={item.value}
            onChange={handleFilterChange}
            sx={{ width: "100%" }}
            MenuProps={{ disableScrollLock: true }}
         >
            <MenuItem value={"9"}>ALL</MenuItem>
            <MenuItem value={1}>VERIFY</MenuItem>
            <MenuItem value={-1}>NOT VERIFY</MenuItem>
            <MenuItem value={-2}>BANNED</MenuItem>
         </Select>
      </Box>
   );
};
const CustomFilterAdminPromotionType = ({ applyValue, item }) => {
   const handleFilterChange = (event) => {
      console.log(event.target.value, item, applyValue);
      let newItem = { ...item, value: event.target.value };
      applyValue(newItem);
   };

   return (
      <Box>
         <Typography
            sx={{ padding: "0", fontSize: "1.6rem", lineHeight: "1.6rem" }}
         >
            value
         </Typography>
         <Select
            defaultValue={"9"}
            value={item.value}
            onChange={handleFilterChange}
            sx={{ width: "100%" }}
            MenuProps={{ disableScrollLock: true }}
         >
            <MenuItem value={9}>ALL</MenuItem>
            <MenuItem value={1}>Discount</MenuItem>
            <MenuItem value={2}>Shipping</MenuItem>
         </Select>
      </Box>
   );
};
const CustomFilterPromotionSelection = ({ applyValue, item }) => {
   const { listVouchers } = useSelector(productDetailsSelector);
   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(getListVouchers());
   }, []);
   const handleFilterChange = (event) => {
      console.log(event.target.value, item, applyValue);
      let newItem = { ...item, value: event.target.value };
      applyValue(newItem);
   };

   return (
      <Box>
         <Typography
            sx={{ padding: "0", fontSize: "1.6rem", lineHeight: "1.6rem" }}
         >
            value
         </Typography>

         {listVouchers.length === 0 ? (
            <Typography>
               <em>None</em>
            </Typography>
         ) : (
            <>
               <Select
                  defaultValue={""}
                  value={item.value}
                  onChange={handleFilterChange}
                  sx={{ width: "100%" }}
                  MenuProps={{ disableScrollLock: true }}
               >
                  {listVouchers.map((item) => (
                     <MenuItem value={item.id}>
                        {" "}
                        <Chip
                           color={"table"}
                           variant="outlined"
                           label={`${item.name} - ${item.discountRate}%`}
                        />
                     </MenuItem>
                  ))}
               </Select>
            </>
         )}
      </Box>
   );
};
const CustomFilterDate = ({ applyValue, item }) => {
   const [dateForm, setDateForm] = useState({
      dateFrom: 0,
      dateTo: -1,
   });
   const handleFrom = (value) => {
      const milliseconds = Date.parse(value);
      setDateForm((state) => {
         return { ...state, dateFrom: milliseconds };
      });
   };
   const handleTo = (value) => {
      console.log(value, item, applyValue);
      const milliseconds = Date.parse(value);
      setDateForm((state) => {
         return { ...state, dateTo: milliseconds };
      });
   };
   useEffect(() => {
      const newValue = JSON.stringify(dateForm);
      console.log(newValue);
      applyValue({ ...item, value: newValue });
   }, [dateForm]);

   return (
      <>
         <Box display="flex" flexDirection={"column"} gap={1}>
            <Box>
               <DatePicker
                  label={"From"}
                  format="DD/MM/YYYY"
                  onChange={handleFrom}
               />
            </Box>
            <Box>
               <DatePicker
                  label={"To"}
                  format="DD/MM/YYYY"
                  onChange={handleTo}
               />
            </Box>
         </Box>
      </>
   );
};
const CustomFilterRating = ({ applyValue, item }) => {
   const handleFilterChange = (e, value) => {
      applyValue({ ...item, value: value });
   };
   return (
      <Box
         sx={{
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center",
            height: 48,
            pl: "20px",
         }}
      >
         <Rating
            name="custom-rating-filter-operator"
            placeholder="Filter value"
            value={Number(item.value)}
            onChange={handleFilterChange}
            //   ref={ratingRef}
         />
         <Typography>{item.value}</Typography>
      </Box>
   );
};
export const operatorSelectStatusAdminUser = {
   label: "select",
   value: "=",
   InputComponent: CustomFilterAdminUser,
   getValueAsString: (value) => value,
};
export const operatorDate = {
   label: "date",
   value: "Range",
   InputComponent: CustomFilterDate,
   getValueAsString: (value) => `${JSON.stringify(value)}`,
};
export const operatorSelectPromotion = {
   label: "select",
   value: "Contain",
   InputComponent: CustomFilterPromotionSelection,
   getValueAsString: (value) => value,
};
export const operatorSelectStatus = {
   label: "select",
   value: "=",
   InputComponent: CustomFilteraStatus,
   getValueAsString: (value) => value,
};
export const operatorAdminSelectTransaction = {
   label: "select",
   value: "=",
   InputComponent: CustomFilterTransactionStatus,
   getValueAsString: (value) => value,
};

export const operatorSelectPaymenMethod = {
   label: "select",
   value: "=",
   InputComponent: CustomFilterPaymentMethod,
   getValueAsString: (value) => value,
};
export const operatorAdminPromotionType= {
   label: "select",
   value: "=",
   InputComponent: CustomFilterAdminPromotionType,
   getValueAsString: (value) => value,
};
export const operatorPriceFrom = {
   label: ">=",
   value: ">=",
   InputComponent: CustomFiltera,
   getValueAsString: (value) => value,
};
export const operatorNameContain = {
   label: "Contain",
   value: "Contain",
   InputComponent: CustomFiltera,
   getValueAsString: (value) => value,
};
export const operatorTypeContain = {
   label: "Contain",
   value: "Contain",
   InputComponent: CustomFiltera,
   getValueAsString: (value) => value,
};
export const operatorIDEqual = {
   label: "=",
   value: "=",
   InputComponent: CustomFiltera,
   getValueAsString: (value) => value,
};

export const operatorSelect = {
   label: "select",
   value: "=",
   InputComponent: CustomFilteraStatus,
   getValueAsString: (value) => value,
};

export const operatorRatingFrom = {
   label: "from",
   value: ">=",
   InputComponent: CustomFilterRating,
   getValueAsString: (value) => value,
};
