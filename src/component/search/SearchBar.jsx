import styled from "@emotion/styled";
import { InputBase, alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import s from "./searchBar.module.scss";

import clsx from "clsx";
const Search = styled("div")(({ theme }) => ({
   position: "relative",
   borderRadius: '100rem',
   backgroundColor: alpha(theme.palette.common.white, 0.15),
   "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
   },
   marginLeft: 0,
   width: "100%",
   [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
   },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
   padding: theme.spacing(0, 2),
   height: "100%",
   position: "absolute",
   display: "flex",
   alignItems: "center",
   justifyContent: "center",
   // "&:hover" : {
   //    cursor: "pointer",
   //    backgroundColor:  alpha(theme.palette.common.white, 0.75),
   // }
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
   color: "inherit",
   "& .MuiInputBase-input": {
      zIndex: '1',
      padding: theme.spacing(1, 1, 1, 0),
      fontSize: "2rem",
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "",
      color: theme.palette.template5.main,
      [theme.breakpoints.up("sm")]: {
         width: "12ch",
         "&:focus": {
            width: "20ch",
         },
      },
   },
}));

export default function SearchBar() {
   return (
      <Search>
         <SearchIconWrapper className={clsx(s.icon)}>
            <SearchIcon sx={{ fontSize: "2rem" }} />
         </SearchIconWrapper>
         <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => {}}
         />
      </Search>
   );
}
