import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import adminShopOwnerSlice, {
   getShopOwnerTablePagingAndFilter,
   getShopOwnerTableSelector,
} from "../../redux/adminShopOwnerSlice";
import clsx from "clsx";
import s from "./adminShopOwnerTable.module.scss";
import moment from "moment";
import { Avatar, Box, Chip, Tooltip, Typography } from "@mui/material";

export default function AdminShopOwnerTable() {
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
      totalShopOwner,
      listSelected,
      mode,
   } = useSelector(getShopOwnerTableSelector);
   const handlePageChange = (page) => {
      setPaginationModel((prevPaginationModel) => ({
         ...prevPaginationModel,
         page,
      }));
   };
   useEffect(() => {
      return () => {
         dispatch(adminShopOwnerSlice.actions.resetState());
      };
   }, []);
   const handleRowSelectionModelChange = (newRowSelectionModel, a) => {
      dispatch(
         adminShopOwnerSlice.actions.changeListSelectedRows(
            newRowSelectionModel
         )
      );
   };
   const handleSortModelChange = React.useCallback((sortModel) => {
      // Here you save the data you need from the sort model
      if (sortModel[0]) {
         dispatch(
            adminShopOwnerSlice.actions.changeSortDirection(sortModel[0])
         );
         setPaginationModel({
            pageSize: 10, // Default page size
            page: 0,
         });
      } else {
         dispatch(
            adminShopOwnerSlice.actions.changeSortDirection({
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
      dispatch(adminShopOwnerSlice.actions.changeOrderSearchInfo(filterObject));
      setPaginationModel({
         pageSize: 10, // Default page size
         page: 0,
      });
   };
   const handleRowChange = (row) => {};
   useEffect(() => {
      dispatch(getShopOwnerTablePagingAndFilter(paginationModel.page + 1));
   }, [paginationModel]);
   useEffect(() => {
      dispatch(adminShopOwnerSlice.actions.changeTab(1));
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
            rowCount={totalShopOwner}
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
   },
   {
      field: "shopName",
      headerClassName: "super-app-theme--header",
      headerName: "Shop Name",
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
      width: 200,
      renderCell: (params) => {
         return (
            <Tooltip title={params.value}>
               <Typography noWrap>{params.value}</Typography>
            </Tooltip>
         );
      },
   },

   {
      field: "shopPhone",
      headerClassName: "super-app-theme--header",
      headerName: "Shop Phone",
      width: 150,
   },
   {
      field: "address",
      headerClassName: "super-app-theme--header",
      headerName: "Address",
      width: 500,
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
      renderCell: (params) => {
         let value = params.value;
         let theme = "success";
         if (value === "BAN") {
            value = "BANNED";
            theme = "error";
         }
         return <Chip label={value} variant="outlined" color={theme} />;
      },
   },
   {
      field: "createdDate",
      headerClassName: "super-app-theme--header",
      headerName: "Created Date",
      width: 200,
      valueFormatter: (params) => moment(params.value).format("HH:mm DD/MM/YY"),
   },
];
