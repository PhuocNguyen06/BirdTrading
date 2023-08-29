import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import shopStaffSlice, {
   getShopStaffSelector,
   getShopStaffs,
} from "../../redux/shopStaffSlice";
import clsx from "clsx";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import s from "./shopStaffDataGrid.module.scss";
import { Chip } from "@mui/material";
import { userInfoSliceSelector } from "../../redux/userInfoSlice";
export default function ShopStaffDataGrid() {
   const {info} = useSelector(userInfoSliceSelector);
   const apiRef = useGridApiRef();
   const [paginationModel, setPaginationModel] = useState({
      pageSize: 10, // Default page size
      page: 0, // Default page number
   });
   const { dataTable, currentPage, isLoading, totalStaff, listSelected } =
      useSelector(getShopStaffSelector);
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(shopStaffSlice.actions.changeTab(1));
   }, []);
   useEffect(() => {
      dispatch(getShopStaffs(paginationModel.page + 1));
   }, [paginationModel]);
   const handlePageChange = (page) => {
      setPaginationModel((prevPaginationModel) => ({
         ...prevPaginationModel,
         page,
      }));
   };
   console.log(listSelected);
   const handleRowSelectionModelChange = (newRowSelectionModel) => {
      dispatch(
         shopStaffSlice.actions.changeListSelectedRows(newRowSelectionModel)
      );
   };
   console.log(paginationModel);
   return (
      <div className={clsx(s.container, "box-shadow")}>
         <DataGrid
            editMode="row"
            checkboxSelection
            // isRowSelectable={(params) => mode === "view"}
            onRowSelectionModelChange={handleRowSelectionModelChange}
            disableRowSelectionOnClick
            rowSelectionModel={listSelected}
            apiRef={apiRef}
            columns={columns}
            rowCount={totalStaff}
            rowsPerPageOptions={10}
            page={currentPage}
            rows={dataTable}
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
      width: 150,
   },
   {
      field: "shopId",
      headerClassName: "super-app-theme--header",
      headerName: "Shop ID",
      width: 100,
   },
   {
      field: "userName",
      headerClassName: "super-app-theme--header",
      headerName: "Username",
      width: 600,
   },
   {
      field: "status",
      headerClassName: "super-app-theme--header",
      headerName: "Status",
      width: 200,
      valueFormatter: ({value}) => value ==="VERIFY"? "Active": "BANNED" ,
      renderCell: (params) => {
         let colorTheme = "success";
         let value = params.value;
         if (params.value === "VERIFY") {
            colorTheme = "table";
            value = "ACTIVE"
         }
         if (params.value === "BANNED") {
            colorTheme = "error";
         }
         return (
            <Chip color={colorTheme} variant="outlined" label={value} />
         );
      },
   },
];
