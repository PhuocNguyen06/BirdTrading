import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import shopOrderSlice, {
   getShopOrderTableSelector,
} from "../../redux/shopOrderSlice";
import clsx from "clsx";
import s from "./shopOrderDetailsDataGrid.module.scss";
import shopOrderDetailsSlice, {
   getOrderDetailsFilterPaging,
   getShopOrderDetailsSelector,
   getShopOrderDetailsTableSelector,
} from "../../redux/shopOrderDetailsSlice";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import moment from "moment";
import {
   operatorDate,
   operatorIDEqual,
   operatorPriceFrom,
   operatorRatingFrom,
   operatorTypeContain,
} from "../filter-table-common/FiterTableCommon";
import { formatNumber, formatQuantity } from "../../utils/myUtils";
import { Box, Rating, Typography } from "@mui/material";

export default function ShopOrderDetailsDataGrid() {
   const {
      data,
      isLoading,
      totalOrdersDetails,
      listSelected,
      mode,
      currentPage,
   } = useSelector(getShopOrderDetailsTableSelector);
   const apiRef = useGridApiRef();
   const [paginationModel, setPaginationModel] = useState({
      pageSize: 10, // Default page size
      page: 0, // Default page number
   });
   useEffect(() => {
      dispatch(getOrderDetailsFilterPaging(paginationModel.page + 1));
   }, [paginationModel]);
   useEffect(() => {
      dispatch(shopOrderSlice.actions.changeTab(2));
   }, []);
   const dispatch = useDispatch();
   const handlePageChange = (page) => {
      setPaginationModel((prevPaginationModel) => ({
         ...prevPaginationModel,
         page,
      }));
   };

   const handleRowSelectionModelChange = (newRowSelectionModel, a) => {
      console.log(newRowSelectionModel);
      let newListSelected = [];
      if (apiRef.current) {
         newListSelected = newRowSelectionModel.map((rowId) =>
            apiRef.current.getRow(rowId)
         );
      }
      dispatch(
         shopOrderDetailsSlice.actions.changeListSelectedRows(newListSelected)
      );
   };
   const handleSortModelChange = React.useCallback((sortModel) => {
      // Here you save the data you need from the sort model
      if (sortModel[0]) {
         dispatch(
            shopOrderDetailsSlice.actions.changeSortDirection(sortModel[0])
         );
         setPaginationModel({
            pageSize: 10, // Default page size
            page: 0,
         });
      } else {
         dispatch(
            shopOrderDetailsSlice.actions.changeSortDirection({
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
   useEffect(() => {
      return () => {
         dispatch(shopOrderDetailsSlice.actions.resetState());
      };
   }, []);
   const onFilterChange = (filterModel) => {
      console.log(filterModel);
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
      dispatch(
         shopOrderDetailsSlice.actions.changeOrderSearchInfo(filterObject)
      );
      setPaginationModel({
         pageSize: 10, // Default page size
         page: 0,
      });
   };
   return (
      <div className={clsx(s.container, "box-shadow")}>
         <DataGrid
            // onProcessRowUpdateError={handleProcessRowUpdateError}
            // processRowUpdate={handleProcessRowUpdate}
            editMode="row"
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
            filterMode="server"
            onFilterModelChange={onFilterChange}
            checkboxSelection
            isRowSelectable={(params) => mode === "view"}
            onRowSelectionModelChange={handleRowSelectionModelChange}
            disableRowSelectionOnClick
            rowSelectionModel={listSelected.map((row) => row.id)}
            apiRef={apiRef}
            columns={columns}
            rowCount={totalOrdersDetails}
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
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "ID",
      width: 100,
      filterOperators: [operatorIDEqual],
      filterable: true,
   },
   {
      field: "name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Name",
      filterOperators: [operatorTypeContain],
      width: 250,
   },
   {
      field: "orderId",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Order ID",
      type: "number",
      width: 150,
      filterOperators: [operatorIDEqual],
      filterable: true,
   },
   {
      field: "productId",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Product ID",
      width: 150,
      valueFormatter: ({ value }) => `${value}`,
      filterOperators: [operatorIDEqual],
      filterable: true,
   },
   {
      field: "price",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Price",
      type: "number",
      width: 150,
      valueFormatter: ({ value }) => formatNumber(value),
      filterOperators: [operatorPriceFrom],
      filterable: true,
   },

   {
      field: "promotionRate",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Promotion Rate",
      valueFormatter: ({ value }) => `${value}%`,
      filterable: false,
      type: "number",
      width: 150,
   },
   {
      field: "quantity",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Quantity",
      type: "number",
      filterable: false,
      valueFormatter: ({ value }) => formatQuantity(value),
      width: 150,
   },
   {
      field: "reviewRating",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Review Rating",
      width: 150,
      filterOperators: [operatorRatingFrom],
      renderCell: (params) => {
         return (
            <Box display={"flex"} gap={"0.8rem"}>
               <Rating readOnly value={Number(params.value)} precision={0.5} />
            </Box>
         );
      },
   },
   {
      field: "createdDate",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Create Date",
      width: 200,
      filterOperators: [operatorDate],
      valueFormatter: (params) => moment(params.value).format("DD/MM/YY HH:mm"),
   },
];
