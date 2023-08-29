import {
   DataGrid,
   useGridApiRef,
   GridToolbar,
   useGridApiContext,
} from "@mui/x-data-grid";
import s from "./adminProductsTable.module.scss";
import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import {
   Box,
   Chip,
   Input,
   MenuItem,
   Select,
   Tooltip,
   Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import clsx from "clsx";
import productShopSlice, {
   getProductTableAndPaging,
   getProductTableAndPagingInAdmin,
   productTableSelector,
} from "../../redux/productsShopSlice";
import { api } from "../../api/api";
import {
   operatorIDEqual,
   operatorNameContain,
   operatorPriceFrom,
   operatorSelect,
   operatorTypeContain,
} from "../filter-table-common/FiterTableCommon";
import { formatNumber, formatQuantity } from "../../utils/myUtils";

export default function AdminProductsTable() {
   const tableData = useSelector(productTableSelector);
   const dispatch = useDispatch();
   const apiRef = useGridApiRef();
   const [paginationModel, setPaginationModel] = useState({
      pageSize: 10, // Default page size
      page: 0, // Default page number
   });

   const onFilterChange = (filterModel) => {
      // Here you save the data you need from the filter model
      console.log(filterModel, "filter model");
      let filterObject = filterModel.items[0];
      console.log(filterObject, "filter object");
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
      dispatch(productShopSlice.actions.changeProductSearchInfo(filterObject));
      setPaginationModel({
         pageSize: 10, // Default page size
         page: 0,
      });
   };

   useEffect(() => {
      dispatch(getProductTableAndPagingInAdmin(paginationModel.page + 1));
   }, [paginationModel]);
   const handleSortModelChange = React.useCallback((sortModel) => {
      // Here you save the data you need from the sort model
      if (sortModel[0]) {
         dispatch(productShopSlice.actions.changeSortDirection(sortModel[0]));
         setPaginationModel({
            pageSize: 10, // Default page size
            page: 0,
         });
      } else {
         dispatch(
            productShopSlice.actions.changeSortDirection({
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
   const handleRowChange = (row) => {};

   useEffect(() => {
      return () => {
         dispatch(productShopSlice.actions.changeListSelectedRows([]));
         dispatch(productShopSlice.actions.resetState());
      };
   }, []);

   const handleProcessRowUpdate = async (newRow, oldRow) => {
      // Make the HTTP request to save in the backend
      try {
         const response = await api.put("/shop-owner/products/quantity", [
            {
               id: newRow.id,
               quantity: newRow.quantity,
            },
         ]);
         const data = await response.data;
      } catch (e) {
         console.log(e);
      }
      return newRow;
   };
   const handleProcessRowUpdateError = (newRow, oldRow) => {};
   const handleRowSelectionModelChange = (newRowSelectionModel) => {
      if (tableData.mode === "view") {
         dispatch(
            productShopSlice.actions.changeListSelectedRows(
               newRowSelectionModel
            )
         );
      }
   };
   return (
      <>
         <div className={clsx(s.container, "box-shadow")}>
            {tableData ? (
               <DataGrid
                  checkboxSelection
                  isRowSelectable={(params) => tableData?.mode === "view"}
                  onRowSelectionModelChange={handleRowSelectionModelChange}
                  onProcessRowUpdateError={handleProcessRowUpdateError}
                  processRowUpdate={handleProcessRowUpdate}
                  editMode="row"
                  initialState={{
                     pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  sortingMode="server"
                  onSortModelChange={handleSortModelChange}
                  filterMode="server"
                  onFilterModelChange={onFilterChange}
                  disableRowSelectionOnClick
                  rowSelectionModel={tableData?.listSelected}
                  apiRef={apiRef}
                  columns={columns}
                  rowCount={tableData.totalProduct}
                  rowsPerPageOptions={[10]}
                  paginationModel={paginationModel}
                  paginationMode="server"
                  onPaginationModelChange={setPaginationModel}
                  page={tableData?.currentPage - 1}
                  rows={tableData?.data}
                  // editMode={isEditingEnabled ? "row" : "none"}
                  slots={{
                     toolbar: GridToolbar,
                  }}
                  loading={tableData?.isLoading}
                  disableColumnMenu
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
            ) : (
               ""
            )}
         </div>
      </>
   );
}

const columns = [
   {
      field: "id",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "ID",
      width: 100,
      filterable: true,
      filterOperators: [operatorIDEqual],
   },
   {
      field: "shopId",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Shop ID",
      width: 100,
      filterable: true,
      filterOperators: [operatorIDEqual],
   },
   {
      field: "name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Name",
      width: 200,
      filterable: true,
      filterOperators: [operatorNameContain],
   },
   {
      field: "price",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Price",
      width: 80,
      valueFormatter: ({ value }) => formatNumber(value),
      filterable: true,
      filterOperators: [operatorPriceFrom],
   },
   {
      field: "discountedPrice",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Discounted price",
      valueFormatter: ({ value }) => formatNumber(value),
      width: 120,
      filterable: false,
   },
   {
      field: "quantity",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Quantity",
      type: "number",
      width: 120,
      valueFormatter: ({ value }) => formatQuantity(value),
      editable: true,
      filterable: false,
      // preProcessEditCellProps: (params) => {
      //    console.log(params);
      //    const hasError = Number(+params.props.value) > 10000;
      //    return { ...params.props, error: hasError };
      // },
   },
   {
      field: "type",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Type",
      width: 150,
      renderCell: (params) => params.value?.name || "",
      filterable: true,
      valueFormatter: ({ value }) => value.name,
      filterOperators: [operatorTypeContain],
   },
   {
      field: "status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 120,
      filterable: true,
      sortable: false,
      filterOperators: [operatorSelect],
      renderCell: (params) => {
         let colorTheme = "success";
         let statusString = "Active";
         if (params.value === 0) {
            colorTheme = "template10";
            statusString = "Inactive";
         } else if (params.value === 2) {
            statusString = "Banned";
            colorTheme = "error";
         }
         return (
            <Chip
               color={colorTheme}
               variant="outlined"
               sx={{ fontWeight: "1000" }}
               label={statusString}
            />
         );
      },
   },
   {
      field: "totalOrders",
      headerName: "Total Orders",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      type: "number",
      filterable: false,
   },
   // {
   //    field: "star",
   //    headerName: "Star",
   //    headerClassName: "super-app-theme--header",
   //    headerAlign: "center",
   //    type: "number",
   //    filterable: false,
   // },
   // {
   //    field: "totalReviews",
   //    headerName: "Total Reviews",
   //    headerClassName: "super-app-theme--header",
   //    headerAlign: "center",
   //    type: "number",
   //    width: 150,
   //    filterable: false,
   // },
   {
      field: "createDate",
      headerName: "Create Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      filterable: false,

      valueFormatter: (params) => moment(params.value).format("DD/MM/YY HH:mm"),
   },
   {
      field: "lastUpdate",
      headerName: "Last Update",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      filterable: false,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YY HH:mm"),
   },
];
