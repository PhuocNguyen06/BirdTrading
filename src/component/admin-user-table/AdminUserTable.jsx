import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import s from "./adminUserTable.module.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import adminUserSlice, {
   getUserTablePagingAndFilter,
   getUserTableSelector,
} from "../../redux/adminUserSlice";
import clsx from "clsx";
import moment from "moment";
import { Avatar, Box, Chip, Tooltip, Typography } from "@mui/material";
import {
   operatorDate,
   operatorIDEqual,
   operatorNameContain,
   operatorSelectPaymenMethod,
   operatorSelectStatusAdminUser,
} from "../filter-table-common/FiterTableCommon";

export default function AdminUserTable() {
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
      totalUsers,
      listSelected,
      mode,
   } = useSelector(getUserTableSelector);
   const handlePageChange = (page) => {
      setPaginationModel((prevPaginationModel) => ({
         ...prevPaginationModel,
         page,
      }));
   };
   useEffect(() => {
      return () => {
         dispatch(adminUserSlice.actions.resetState());
      };
   }, []);
   const handleRowSelectionModelChange = (newRowSelectionModel, a) => {
      const isChangeStatus = newRowSelectionModel.some(row => apiRef.current.getRow(row).status === 'NOT_VERIFY')
      dispatch(
         adminUserSlice.actions.changeCanChangeStatusUser(isChangeStatus)
         );
      dispatch(
         adminUserSlice.actions.changeListSelectedRows(newRowSelectionModel)
      );
   };
   const handleSortModelChange = React.useCallback((sortModel) => {
      // Here you save the data you need from the sort model
      if (sortModel[0]) {
         dispatch(adminUserSlice.actions.changeSortDirection(sortModel[0]));
         setPaginationModel({
            pageSize: 10, // Default page size
            page: 0,
         });
      } else {
         dispatch(
            adminUserSlice.actions.changeSortDirection({
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
      dispatch(adminUserSlice.actions.changeOrderSearchInfo(filterObject));
      setPaginationModel({
         pageSize: 10, // Default page size
         page: 0,
      });
   };
   const handleRowChange = (row) => {};
   useEffect(() => {
      dispatch(getUserTablePagingAndFilter(paginationModel.page + 1));
   }, [paginationModel]);
   useEffect(() => {
      dispatch(adminUserSlice.actions.changeTab(1));
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
            rowCount={totalUsers}
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
      headerName: "ID",
      width: 100,
      filterOperators: [operatorIDEqual],
   },
   {
      field: "fullName",
      headerClassName: "super-app-theme--header",
      headerName: "Full Name",
      filterOperators: [operatorNameContain],
      width: 250,
      renderCell: (params) => {
         return (
            <Tooltip title={params.value}>
               <Box display="flex" alignItems={"center"} gap={1}>
                  <Avatar src={params.row.avtUrl} />{" "}
                  <Typography noWrap>{params.value}</Typography>
               </Box>
            </Tooltip>
         );
      },
   },
   {
      field: "email",
      headerClassName: "super-app-theme--header",
      headerName: "Email",
      width: 250,
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
      headerClassName: "super-app-theme--header",
      headerName: "Phone Number",
      filterOperators: [operatorNameContain],
      width: 150,
   },
   {
      field: "address",
      headerClassName: "super-app-theme--header",
      headerName: "Address",
      width: 300,
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
      field: "status",
      headerClassName: "super-app-theme--header",
      headerName: "Status",
      width: 150,
      sortable: false,
      filterOperators: [operatorSelectStatusAdminUser],
      renderCell: (params) => {
         let theme = "shipping";
         if (params.value === "NOT_VERIFY") {
            theme = "template8";
         } else if (params.value === "BANNED") {
            theme = "error";
         }
         return <Chip label={params.value} variant="outlined" color={theme} />;
      },
   },
   {
      field: "createdDate",
      headerClassName: "super-app-theme--header",
      headerName: "Created Date",
      width: 200,
      filterOperators: [operatorDate],
      valueFormatter: (params) => moment(params.value).format("HH:mm DD/MM/YY"),
   },
];
