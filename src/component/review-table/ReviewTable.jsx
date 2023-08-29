import React, { useEffect, useState } from "react";
import reviewSlice, {
   getReviewDataTable,
   getReviewSliceSelector,
   getReviewTableSelector,
} from "../../redux/reviewSlice";
import shopOrderSlice, {
   getShopOrderTableSelector,
} from "../../redux/shopOrderSlice";
import { GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import clsx from "clsx";
import s from "./reviewTable.module.scss";
import { Box, Rating } from "@mui/material";
import {
   operatorDate,
   operatorIDEqual,
   operatorRatingFrom,
   operatorTypeContain,
} from "../filter-table-common/FiterTableCommon";
import moment from "moment";
export default function ReviewTable() {
   const apiRef = useGridApiRef();
   const [paginationModel, setPaginationModel] = useState({
      pageSize: 10, // Default page size
      page: 0, // Default page number
   });
   const dispatch = useDispatch();
   const { data, currentPage, isLoading, totalElement, listSelected, mode } =
      useSelector(getReviewTableSelector);
   const handlePageChange = (page) => {
      setPaginationModel((prevPaginationModel) => ({
         ...prevPaginationModel,
         page,
      }));
   };
   useEffect(() => {
      return () => {
         dispatch(reviewSlice.actions.resetState());
      };
   }, []);
   const handleRowSelectionModelChange = (newRowSelectionModel) => {
      dispatch(
         reviewSlice.actions.changeListSelectedRows(newRowSelectionModel)
      );
   };
   const handleSortModelChange = React.useCallback((sortModel) => {
      // Here you save the data you need from the sort model
      if (sortModel[0]) {
         dispatch(reviewSlice.actions.changeSortDirection(sortModel[0]));
         setPaginationModel({
            pageSize: 10, // Default page size
            page: 0,
         });
      } else {
         dispatch(
            reviewSlice.actions.changeSortDirection({
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
      dispatch(reviewSlice.actions.changeReviewSearchInfo(filterObject));
      setPaginationModel({
         pageSize: 10, // Default page size
         page: 0,
      });
   };
   const handleRowChange = (row) => {};
   useEffect(() => {
      dispatch(getReviewDataTable(paginationModel.page + 1));
   }, [paginationModel]);

   return (
      <>
         {
            <div className={clsx(s.container, "box-shadow")}>
               <DataGrid
                  editMode="row"
                  sortingMode="server"
                  onSortModelChange={handleSortModelChange}
                  filterMode="server"
                  onFilterModelChange={onFilterChange}
                  onRowModesModelChange={handleRowChange}
                  checkboxSelection
                  isRowSelectable={(params) => mode === "view"}
                  onRowSelectionModelChange={handleRowSelectionModelChange}
                  disableRowSelectionOnClick
                  rowSelectionModel={listSelected}
                  apiRef={apiRef}
                  columns={columns}
                  rowCount={totalElement}
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
         }
      </>
   );
}

const columns = [
   {
      field: "id",
      headerClassName: "super-app-theme--header",
      headerName: "ID",
      filterOperators: [operatorIDEqual],
      width: 100,
   },
   {
      field: "orderDetailId",
      headerClassName: "super-app-theme--header",
      headerName: "Order Detail ID",
      filterOperators: [operatorIDEqual],
      width: 150,
   },
   {
      field: "customerName",
      headerClassName: "super-app-theme--header",
      headerName: "Customer Name",
      filterOperators: [operatorTypeContain],
      width: 200,
   },
   {
      field: "productName",
      headerClassName: "super-app-theme--header",
      headerName: "Product Name",
      filterOperators: [operatorTypeContain],
      width: 350,
   },
   {
      field: "rating",
      headerClassName: "super-app-theme--header",
      headerName: "Rating",
      width: 300,
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
      field: "reviewDate",
      headerClassName: "super-app-theme--header",
      headerName: "Review Date",
      width: 300,
      filterOperators: [operatorDate],
      valueFormatter: (params) => moment(params.value).format("DD/MM/YY HH:mm"),
   },
];
