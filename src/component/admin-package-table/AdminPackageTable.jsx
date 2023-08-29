import React, { useEffect, useState } from "react";
import s from "./adminPackageTable.module.scss";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import adminPackageSlice, {
   getAdminPackageTableSelector,
   getPackagePagingAndFilter,
} from "../../redux/adminPackageSlice";
import clsx from "clsx";
import moment from "moment";
import { Box, Chip, Tooltip, Typography } from "@mui/material";
import { formatNumber } from "../../utils/myUtils";
import {
   operatorAdminSelectTransaction,
   operatorDate,
   operatorIDEqual,
   operatorNameContain,
   operatorPriceFrom,
   operatorSelectPaymenMethod,
} from "../filter-table-common/FiterTableCommon";

export default function AdminPackageTable() {
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
      totalPackage,
      listSelected,
      mode,
   } = useSelector(getAdminPackageTableSelector);
   const handlePageChange = (page) => {
      setPaginationModel((prevPaginationModel) => ({
         ...prevPaginationModel,
         page,
      }));
   };
   useEffect(() => {
      return () => {
         dispatch(adminPackageSlice.actions.resetState());
      };
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
            adminPackageSlice.actions.changeListSelectedRows(newListSelected)
         );
      }
   };
   const handleSortModelChange = React.useCallback((sortModel) => {
      // Here you save the data you need from the sort model
      if (sortModel[0]) {
         dispatch(adminPackageSlice.actions.changeSortDirection(sortModel[0]));
         setPaginationModel({
            pageSize: 10, // Default page size
            page: 0,
         });
      } else {
         dispatch(
            adminPackageSlice.actions.changeSortDirection({
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
      dispatch(adminPackageSlice.actions.changeOrderSearchInfo(filterObject));
      setPaginationModel({
         pageSize: 10, // Default page size
         page: 0,
      });
   };
   const handleRowChange = (row) => {};
   useEffect(() => {
      dispatch(getPackagePagingAndFilter(paginationModel.page + 1));
   }, [paginationModel]);
   useEffect(() => {
      dispatch(adminPackageSlice.actions.changeTab(1));
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
            rowCount={totalPackage}
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
      width: 70,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorIDEqual],
   },
   {
      field: "accountId",
      headerName: "Account ID",
      width: 120,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorIDEqual],
   },
   {
      field: "fullName",
      headerName: "Full Name",
      width: 120,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorNameContain],

      renderCell: (params) => {
         return (
            <Tooltip title={params.value}>
               <Typography noWrap>{params.value}</Typography>
            </Tooltip>
         );
      },
   },
   {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 140,
      filterOperators: [operatorNameContain],

      headerClassName: "super-app-theme--header",
   },
   {
      field: "address",
      headerName: "Address",
      width: 300,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorNameContain],
      renderCell: (params) => {
         return (
            <Tooltip title={params.value}>
               <Typography noWrap>{params.value}</Typography>
            </Tooltip>
         );
      },
   },
   {
      field: "paymentMethod",
      headerName: "Payment Method",
      width: 150,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorSelectPaymenMethod],
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
      field: "payerEmail",
      headerName: "Payer Email",
      width: 180,
      headerClassName: "super-app-theme--header",

      valueFormatter: ({ value }) => (value === "DELIVERY" ? "COD" : "PAYPAL"),
      renderCell: (params) => {
         let value = "Not have";
         if (params.value) {
            value = params.value;
         }
         return (
            <Tooltip title={value}>
               <Typography noWrap>{value}</Typography>
            </Tooltip>
         );
      },
   },
   {
      field: "transactionStatus",
      headerName: "Transaction Status",
      sortable: false,
      width: 160,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorAdminSelectTransaction],
      renderCell: (params) => {
         let value = params.value;
         let theme = "success";
         if (value === "PROCESSING") {
            theme = "primary";
         } else if (value === "REFUNDED") {
            theme = "danger";
         }
         return (
            <Box display={"flex"} gap={1}>
               <Chip
                  label={value + `(${params.row.statusOrders})`}
                  color={theme}
                  variant="outlined"
               />
               <Typography>{}</Typography>
            </Box>
         );
      },
   },
   {
      field: "totalPayment",
      headerName: "Total Payment",
      width: 140,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorPriceFrom],
      valueFormatter: ({ value }) => formatNumber(value),
   },

   {
      field: "createdDateTransaction",
      headerName: "Created Date",
      width: 180,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorDate],
      valueFormatter: (params) => moment(params.value).format("HH:mm DD/MM/YY"),
   },
   {
      field: "lastedUpdateTransaction",
      headerName: "Last Update",
      width: 180,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorDate],
      valueFormatter: (params) => moment(params.value).format("HH:mm DD/MM/YY"),
   },
];
