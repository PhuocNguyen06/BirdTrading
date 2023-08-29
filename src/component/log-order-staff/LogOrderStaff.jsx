import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import clsx from "clsx";
import moment from "moment";
import React from "react";
import s from "./logOrderStaff.module.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logStaffSlice, {
   getLogStaffTable,
   getLogStaffTableSelector,
} from "../../redux/logStaffSlice";
import { useEffect } from "react";
import { Chip } from "@mui/material";
import {
   operatorDate,
   operatorIDEqual,
   operatorNameContain,
   operatorSelectStatus,
} from "../filter-table-common/FiterTableCommon";
import shopStaffSlice from "../../redux/shopStaffSlice";
export default function LogOrderStaff() {
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
      totalElements,
      listSelected,
      mode,
   } = useSelector(getLogStaffTableSelector);
   const handlePageChange = (page) => {
      setPaginationModel((prevPaginationModel) => ({
         ...prevPaginationModel,
         page,
      }));
   };
   useEffect(() => {
      dispatch(shopStaffSlice.actions.changeTab(3));
   }, []);
   useEffect(() => {
      return () => {
         dispatch(logStaffSlice.actions.resetState());
      };
   }, []);
   const handleRowSelectionModelChange = (newRowSelectionModel, a) => {
      const isChangeStatus = newRowSelectionModel.some(
         (row) => apiRef.current.getRow(row).status === "NOT_VERIFY"
      );
      dispatch(logStaffSlice.actions.changeCanChangeStatusUser(isChangeStatus));
      dispatch(
         logStaffSlice.actions.changeListSelectedRows(newRowSelectionModel)
      );
   };
   const handleSortModelChange = React.useCallback((sortModel) => {
      // Here you save the data you need from the sort model
      if (sortModel[0]) {
         dispatch(logStaffSlice.actions.changeSortDirection(sortModel[0]));
         setPaginationModel({
            pageSize: 10, // Default page size
            page: 0,
         });
      } else {
         dispatch(
            logStaffSlice.actions.changeSortDirection({
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
      dispatch(logStaffSlice.actions.changeOrderSearchInfo(filterObject));
      setPaginationModel({
         pageSize: 10, // Default page size
         page: 0,
      });
   };
   const handleRowChange = (row) => {};
   useEffect(() => {
      dispatch(getLogStaffTable(paginationModel.page + 1));
   }, [paginationModel]);
   useEffect(() => {
      dispatch(logStaffSlice.actions.changeTab(1));
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
            rowSelectionModel={listSelected}
            apiRef={apiRef}
            columns={columns}
            rowCount={totalElements}
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
      flex: 1,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorIDEqual],
   },
   {
      field: "orderId",
      headerName: "Order ID",
      flex: 1,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorIDEqual],
   },
   {
      field: "staffId",
      headerName: "Staff ID",
      flex: 1,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorIDEqual],
   },
   {
      field: "staffUsername",
      headerName: "Staff Username",
      flex: 2,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorNameContain],
   },
   {
      field: "orderStatus",
      headerName: "Order Status",
      flex: 2,
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorSelectStatus],
      sortable: false,

      filterable: true,
      filterOperators: [operatorSelectStatus],
      valueFormatter: ({ value }) => {
         return value.status;
      },
      renderCell: (params) => {
         let colorTheme = "primary";
         if (params.value.id === 0) {
            colorTheme = "template10";
         }
         if (params.value.id === 2) {
            colorTheme = "template9";
         }
         if (params.value.id === 3) {
            colorTheme = "shipping";
         }
         if (params.value.id === 4) {
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
      field: "timestamp",
      headerName: "Change time",
      flex: 2,
      valueFormatter: (params) => moment(params.value).format("HH:mm DD/MM/YY"),
      headerClassName: "super-app-theme--header",
      filterOperators: [operatorDate],
   },
];
