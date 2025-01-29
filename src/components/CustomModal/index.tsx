import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton, styled } from '@mui/material';
import React from 'react';


// import { Container } from './styles';

interface Props {
  title: string;
  children: JSX.Element;
  isScreenLg?: boolean;
  onClose: () => void;
}

const CustomModal: React.FC<Props> = (props: Props) => {

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root" : {
      minWidth: props.isScreenLg ? '800px' : '500px',
    },
    "& .MuiDialogContent-root": {
      minWidth: '500px',
      maxWidth: '1000px',
      overflow: 'hidden',
      padding: theme.spacing(2),
     
    },
    "& .MuiDialogActions-root": {
      // width: '100%',
      // minWidth: '800px',
      justifyContent: 'flex-start',
      // padding: theme.spacing(1),
      // marginLeft: '0.850rem'
    },
  }));

  return (
    <BootstrapDialog
      onClose={() => {
        props.onClose();
        window.location.reload();
      }}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontSize: '1.5rem', fontWeight: 'bold', color: '#282828' }} className="text-sm" id="customized-dialog-title">
        {props.title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          props.onClose();
          window.location.reload();
        }}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 2,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon className="w-10 h-10" style={{ width: 30, height: 30 }} />
      </IconButton>
      <DialogContent style={{ maxWidth: '100%' }}>
        {props.children}
      </DialogContent>
      
    </BootstrapDialog>
  );
}

export default CustomModal;