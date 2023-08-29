import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import shopOrderSlice, {
   getOrderFilterPaging,
   getShopOrderTableSelector,
} from "../../redux/shopOrderSlice";
import s from "./shopOrderDataGrid.module.scss";
import clsx from "clsx";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import {
   Box,
   Button,
   Chip,
   Input,
   List,
   ListItem,
   ListItemText,
   MenuItem,
   Popover,
   Select,
   Tooltip,
   Typography,
} from "@mui/material";
import moment from "moment";
import ListPromotionInDataGrid from "../list-promotion-in-data-grid/ListPromotionInDataGrid";
import { v4 } from "uuid";
import { api } from "../../api/api";
import { DatePicker } from "@mui/x-date-pickers";
import {
   getListVouchers,
   productDetailsSelector,
} from "../../redux/productDetailsSlice";
import { formatNumber } from "../../utils/myUtils";
import { operatorDate, operatorIDEqual, operatorPriceFrom, operatorSelectPaymenMethod, operatorSelectPromotion, operatorSelectStatus } from "../filter-table-common/FiterTableCommon";

export default function ShopOrderDataGrid() {
   const apiRef = useGridApiRef();
   const [paginationModel, setPaginationModel] = useState({
      pageSize: 10, // Default page size
      page: 0, // Default page number
   });
   const dispatch = useDispatch();
   const {
      data,
      rowModesModel,
      currentPage,
      isLoading,
      totalOrders,
      listSelected,
      mode,
   } = useSelector(getShopOrderTableSelector);
   const handlePageChange = (page) => {
      setPaginationModel((prevPaginationModel) => ({
         ...prevPaginationModel,
         page,
      }));
   };
   useEffect(() => {
      return () => {
         dispatch(shopOrderSlice.actions.resetState())
      }
   }, []);
   const handleRowSelectionModelChange = (newRowSelectionModel, a) => {
      console.log(newRowSelectionModel);
      let newListSelected = [];
      if (apiRef.current) {
         newListSelected = newRowSelectionModel.map((rowId) =>
            apiRef.current.getRow(rowId)
         );
      }
      if (mode === "view") {
         dispatch(
            shopOrderSlice.actions.changeListSelectedRows(newListSelected)
         );
      }
   };
   const handleSortModelChange = React.useCallback((sortModel) => {
      // Here you save the data you need from the sort model
      if (sortModel[0]) {
         dispatch(shopOrderSlice.actions.changeSortDirection(sortModel[0]));
         setPaginationModel({
            pageSize: 10, // Default page size
            page: 0,
         });
      } else {
         dispatch(
            shopOrderSlice.actions.changeSortDirection({
               field: "",
               sort: "",
            })
         );
         setPaginationModel({
            pageSize: 10, // Default page size
            page: 0,
         });
      }
   }, []);
   const onFilterChange = (filterModel) => {
      // Here you save the data you need from the filter model
      let filterObject = filterModel.items[0];
      if (
         !filterObject ||
         filterObject.value === undefined ||
         filterObject.value === ""
      ) {
         filterObject = {
            field: "",
            value: "",
            operator: "",
         };
      }
      dispatch(shopOrderSlice.actions.changeOrderSearchInfo(filterObject));
      setPaginationModel({
         pageSize: 10, // Default page size
         page: 0,
      });
   };
   const handleRowChange = (row) => {};
   useEffect(() => {
      dispatch(getOrderFilterPaging(paginationModel.page + 1));
   }, [paginationModel]);
   useEffect(() => {
      dispatch(shopOrderSlice.actions.changeTab(1));
   }, []);

   return (
      <div className={clsx(s.container, "box-shadow")}>
         <DataGrid
            editMode="row"
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
            filterMode="server"
            onFilterModelChange={onFilterChange}
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowChange}
            checkboxSelection
            isRowSelectable={(params) => mode === "view"}
            onRowSelectionModelChange={handleRowSelectionModelChange}
            disableRowSelectionOnClick
            rowSelectionModel={listSelected.map((row) => row.id)}
            apiRef={apiRef}
            columns={columns}
            rowCount={totalOrders}
            rowsPerPageOptions={10}
            page={currentPage - 1}
            rows={data}
            // editMode={isEditingEnabled ? "row" : "none"}
            slots={{
               toolbar: GridToolbar,
            }}
            onPageChange={handlePageChange}
            loading={isLoading}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            sx={{
               boxShadow: 2,
               border: 2,
               color: "hsl(0, 0%, 1%)",
               borderColor: "hsla(74, 100%, 95%, 0)",
               "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
               },
            }}
         />
      </div>
   );
}

const columns = [
   {
      field: "id",
      headerName: "ID",
      headerAlign: "center",
      type: "number",
      headerClassName: "super-app-theme--header",
      width: 90,
      filterOperators: [operatorIDEqual],
      filterable: true,
   },
   {
      field: "totalPrice",
      headerAlign: "center",
      headerName: "Total Price",
      type: "number",
      headerClassName: "super-app-theme--header",
      width: 120,
      valueFormatter: ({ value }) => formatNumber(value),
      filterOperators: [operatorPriceFrom],
      filterable: true,
   },
   {
      field: "orderStatus",
      headerAlign: "center",
      
      headerClassName: "super-app-theme--header",
      headerName: "Status",
      type: "text",
      width: 120,
      filterable: true,
      filterOperators: [operatorSelectStatus],
      valueFormatter: ({ value }) => {
         return value.status;
      },
      sortable: false,
      renderCell: (params) => {
         let colorTheme = "primary";
         if (params.value.id === 0) {
            colorTheme = "template10";
         }
         if (params.value.id === 2) {
            colorTheme = "template9";
         }
         if(params.value.id === 3){
            colorTheme = "shipping";
         }
         if(params.value.id === 4){
            colorTheme = "delivered";
         }
         
         return (
            <Chip
               color={colorTheme}
               variant="filled"
               label={params.value.status}
            />
         );
      },
   },
   {
      field: "shippingFee",
      headerAlign: "center",
      headerName: "Shipping Fee",
      headerClassName: "super-app-theme--header",
      type: "number",
      width: 130,
      valueFormatter: ({ value }) => formatNumber(value),
      filterOperators: [operatorPriceFrom],
      filterable: true,
   },
   {
      headerAlign: "center",
      field: "paymentMethod",
      headerClassName: "super-app-theme--header",
      headerName: "Payment Method",
      type: "text",
      width: 160,
      filterOperators: [operatorSelectPaymenMethod],
      valueFormatter: ({ value }) => value === "DELIVERY" ? "COD" : "PAYPAL",
      sortable: false,

      renderCell: (params) => {
         console.log(params.value);
         let colorTheme = "success";
         if (params.value === "PAYPAL") {
            colorTheme = "paypal";
         }
         if (params.value === "DELIVERY") {
            colorTheme = "delivery";
         }
         return (
            <Chip
               color={colorTheme}
               variant="filled"
               label={params.value === "DELIVERY" ? "COD" : "PAYPAL"}
            />
         );
      },
   },
   {
      headerAlign: "center",
      field: "promotionsShop",
      headerClassName: "super-app-theme--header",
      headerName: "Promotions",
      width: 200,
      type: "custom",
      sortable: false,

      filterOperators: [operatorSelectPromotion],
      valueFormatter: ({ value }) => {
         return value
            .map(
               (item) =>
                  `${item.quantity} x ${item.name} - ${item.discountRate}`
            )
            .join(", ");
      },
      renderCell: (params) => {
         const promotions = params.value;
         if (promotions.length === 0) {
            return (
               <Typography>
                  <em>None</em>
               </Typography>
            );
         }
         return (
            <Tooltip
               placement="bottom-start"
               title={
                  <>
                     <List dense>
                        {promotions.map((promotion, index) => (
                           <ListItem key={promotion.id}>
                              <Chip
                                 color={"template4"}
                                 variant="outlined"
                                 label={`${promotion.quantity} x ${promotion.name} - ${promotion.discountRate}%`}
                              />
                           </ListItem>
                        ))}
                     </List>
                  </>
               }
            >
               <Typography noWrap>
                  {promotions.map((promotion) => {
                     return (
                        <Chip
                           color={"template8"}
                           variant="outlined"
                           label={`${promotion.quantity} x ${promotion.name} - ${promotion.discountRate}%`}
                        />
                     );
                  })}
               </Typography>
            </Tooltip>
         );
      },
   },
   {
      headerAlign: "center",
      field: "createdDate",
      headerClassName: "super-app-theme--header",
      headerName: "Created Date",
      type: "number",
      width: 200,
      filterOperators: [operatorDate],
      valueFormatter: (params) =>
      moment(params.value).format("DD/MM/YY HH:mm"),
   },
   {
      headerAlign: "center",
      field: "lastedUpdate",
      headerClassName: "super-app-theme--header",
      headerName: "Last Updated",
      type: "number",
      width: 200,
      filterOperators: [operatorDate],
      valueFormatter: (params) =>
         moment(params.value).format("DD/MM/YY HH:mm"),
   },
];
