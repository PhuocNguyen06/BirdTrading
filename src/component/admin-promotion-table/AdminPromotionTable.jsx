import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import adminPromotionSlice, {
   getAdminPromotionTableDataAndPaging,
   getAdminPromotionTableSelector,
} from "../../redux/adminPromotionSlice";
import s from "./adminPromotionTable.module.scss";
import { useGridApiRef } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { formatNumber } from "../../utils/myUtils";
import {
   operatorAdminPromotionType,
   operatorDate,
   operatorIDEqual,
   operatorNameContain,
   operatorPriceFrom,
} from "../filter-table-common/FiterTableCommon";
import moment from "moment";
import { Tooltip, Typography } from "@mui/material";
export default function AdminPromotionTable() {
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
      totalElement,
      listSelected,
      mode,
   } = useSelector(getAdminPromotionTableSelector);
   const handlePageChange = (page) => {
      setPaginationModel((prevPaginationModel) => ({
         ...prevPaginationModel,
         page,
      }));
   };
   useEffect(() => {
      return () => {
         dispatch(adminPromotionSlice.actions.resetState());
      };
   }, []);

   const handleSortModelChange = React.useCallback((sortModel) => {
      // Here you save the data you need from the sort model
      if (sortModel[0]) {
         dispatch(
            adminPromotionSlice.actions.changeSortDirection(sortModel[0])
         );
         setPaginationModel({
            pageSize: 10, // Default page size
            page: 0,
         });
      } else {
         dispatch(
            adminPromotionSlice.actions.changeSortDirection({
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
      dispatch(adminPromotionSlice.actions.changeOrderSearchInfo(filterObject));
      setPaginationModel({
         pageSize: 10, // Default page size
         page: 0,
      });
   };
   const handleRowChange = (row) => {};
   useEffect(() => {
      dispatch(getAdminPromotionTableDataAndPaging(paginationModel.page + 1));
   }, [paginationModel]);
   useEffect(() => {
      dispatch(adminPromotionSlice.actions.changeTab(1));
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
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      width: 200,
      filterOperators: [operatorNameContain],

   },
   {
      field: "description",
      headerClassName: "super-app-theme--header",
      headerName: "Description",
      width: 300,
      filterOperators: [operatorNameContain],
      renderCell: ({ value }) => {
         return (
            <>
               <Tooltip
                  title={<div dangerouslySetInnerHTML={{ __html: value }} />}
               >
                  <Typography
                     noWrap
                     dangerouslySetInnerHTML={{ __html: value }}
                  ></Typography>
               </Tooltip>
            </>
         );
      },
   },
   {
      field: "discount",
      headerClassName: "super-app-theme--header",
      headerName: "Discount",
      valueFormatter: ({ value }) => formatNumber(value),
      filterOperators: [operatorPriceFrom],
      filterable: true,
      width: 150,
   },
   {
      field: "minimumOrderValue",
      headerClassName: "super-app-theme--header",
      headerName: "Minimum Order Value",
      valueFormatter: ({ value }) => formatNumber(value),
      filterOperators: [operatorPriceFrom],
      filterable: true,
      width: 200,
   },
   {
      field: "usageLimit",
      headerClassName: "super-app-theme--header",
      headerName: "Usage Limit",
      type: "number",
      filterOperators: [operatorPriceFrom],
      width: 150,
   },
   {
      field: "used",
      headerClassName: "super-app-theme--header",
      headerName: "Used",
      width: 100,
      type: "number",
      filterOperators: [operatorPriceFrom],

   },
   {
      field: "type",
      headerClassName: "super-app-theme--header",
      headerName: "Type",
      width: 150,
      filterOperators: [operatorAdminPromotionType],
   },
   {
      field: "startDate",
      headerClassName: "super-app-theme--header",
      headerName: "Start Date",
      width: 200,
      filterOperators: [operatorDate],
      valueFormatter: (params) => moment(params.value).format("HH:mm DD/MM/YY"),
   },
   {
      field: "endDate",
      headerClassName: "super-app-theme--header",
      headerName: "End Date",
      filterOperators: [operatorDate],
      valueFormatter: (params) => moment(params.value).format("HH:mm DD/MM/YY"),
      width: 200,
   },
];
