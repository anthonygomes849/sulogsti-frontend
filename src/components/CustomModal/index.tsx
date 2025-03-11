import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
} from "@mui/material";
import React from "react";
import CloseIcon from "../../assets/images/CloseModalIcon.svg";
import { DialogHeader } from "../ui/dialog";

// import { Container } from './styles';

interface Props {
  title?: string;
  children: JSX.Element;
  header?: JSX.Element;
  // childrenFooter: JSX.Element;
  isScreenLg?: boolean;
  onClose: () => void;
  // onConfirm: () => void;
  // onCancel: () => void;
}

const CustomModal: React.FC<Props> = (props: Props) => {
  const BootstrapDialog = styled(Dialog)(() => ({
    "& .MuiPaper-root": {
      minWidth: props.isScreenLg ? "900px" : "500px",
      // minHeight: '90%',
      borderRadius: "10px",
    },
    "& .MuiDialogContent-root": {
      minWidth: "500px",
      maxWidth: "1400px",
      overflow: "hidden",
      // padding: theme.spacing(2),
      padding: 0,
      background: "#EBE6E6",
    },
    "& .MuiDialogActions-root": {
      // width: '100%',
      // minWidth: '800px',
      justifyContent: "flex-start",
      // padding: theme.spacing(1),
      // marginLeft: '0.850rem'
    },
    "& .MuiDialogHeader-root": {
      height: "44px",
    },
    "& .MuiDialogFooter-root": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "54px",
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
      <DialogHeader className="">
        {props.header ? (
          <>{props.header}</>
        ) : (
          <DialogTitle
            sx={{
              m: 0,
              // p: 2,
              // fontSize: "1.5rem",
              // fontWeight: "bold",
              // color: "#282828",
            }}
            className="text-xl font-semibold"
            id="customized-dialog-title"
          >
            {props.title}
          </DialogTitle>
        )}

        <IconButton
          aria-label="close"
          onClick={() => {
            props.onClose();
            if(!window.location.pathname.includes('triagens')) {

              window.location.reload();
            }
          }}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 2,
            color: theme.palette.grey[500],
          })}
        >
          <img src={CloseIcon} className="w-4 h-4" />
        </IconButton>
      </DialogHeader>

      <DialogContent style={{ maxWidth: "100%" }}>
        {props.children}
      </DialogContent>
      {/* 
      <DialogFooter>
        
      </DialogFooter> */}
    </BootstrapDialog>
  );
};

export default CustomModal;
