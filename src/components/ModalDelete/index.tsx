import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogActions, DialogTitle, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { Button } from "reactstrap";

interface Props {
  isOpen?: boolean;
  onCancel?: any;
  onConfirm?: any;
}

const ModalDelete: React.FC<Props> = ({ onConfirm, onCancel }: Props) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      minWidth: '500px',
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      minWidth: '500px',
      padding: theme.spacing(1),
    },
  }));

  return (
    <BootstrapDialog
      onClose={onCancel}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontSize: '16px' }} className="text-sm" id="customized-dialog-title">
       Confirma remoção?
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onCancel}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 2,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <div className="w-full h-[1px] bg-[#ccc]" />
      <DialogActions sx={{ padding: '20px' }}>
        <Button className="w-full h-9 rounded-md bg-[#003459] text-sm text-[#fff]" onClick={onConfirm}>
          Confirmar
        </Button>
        <Button className="w-full h-9 rounded-md bg-[#6C757D] text-sm text-[#fff]" onClick={onCancel}>
          Cancelar
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default ModalDelete;
