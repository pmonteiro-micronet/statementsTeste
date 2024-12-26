import React from "react";
import Backdrop from '@mui/material/Backdrop';

const LoadingBackdrop = ({ open }) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <img 
        src="/loading/extensionsLoader.gif" 
        alt="Loading..." 
        style={{ width: '100px', height: '100px' }}
      />
    </Backdrop>
  );
};

export default LoadingBackdrop;
