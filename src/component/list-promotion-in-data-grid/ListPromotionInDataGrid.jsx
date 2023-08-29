




import { Button, List, ListItem, ListItemText, Popover, Typography } from '@mui/material';
import React, { useState } from 'react'

export default function ListPromotionInDataGrid({params}) {
   console.log(params, 'ListPromotionInDataGrid')
   const [anchorEl, setAnchorEl] = useState(null);
       const promotions = params.value || [];
 
       const handlePopoverOpen = (event) => {
         event.stopPropagation()
         setAnchorEl(event.currentTarget);
       };
 
       const handlePopoverClose = (event) => {
         event.stopPropagation()
         setAnchorEl(null);
       };
 
       const open = Boolean(anchorEl);
 
       return (
         <>
           <Typography
             onMouseEnter={handlePopoverOpen}
             onMouseLeave={handlePopoverClose}
             aria-haspopup="true"
           >
             Hover to View
           </Typography>
           <Popover
             id="promotions-popover"
             open={open}
             disableScrollLock={true}
             anchorEl={anchorEl}
             onClose={handlePopoverClose}
             anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'left',
             }}
             transformOrigin={{
               vertical: 'top',
               horizontal: 'left',
             }}
           >
             {/* <List>
               asdfjasfasfasdfasfasfasd
               {promotions.map((promotion, index) => (
                 <ListItem key={index}>
                   <ListItemText primary={promotion} />
                 </ListItem>
               ))}
             </List> */}
           </Popover>
         </>
       );
}
