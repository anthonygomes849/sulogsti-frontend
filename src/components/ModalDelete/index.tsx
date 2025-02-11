import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { Button } from "reactstrap";
import CloseModalIcon from "../../assets/images/closeIcon.svg";
import { DialogFooter, DialogHeader } from "../ui/dialog";

interface Props {
  isOpen?: boolean;
  onCancel?: any;
  onConfirm?: any;
  row?: string;
}

const ModalDelete: React.FC<Props> = ({ onConfirm, onCancel, row }: Props) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: "10px",
    },
    "& .MuiDialogContent-root": {
      // minWidth: "500px",
      // maxWidth: "1000px",
      width: 'max-content',
      overflow: "hidden",
      padding: 0,
      // padding: theme.spacing(2),
      // background: "#EBE6E6",
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
      onClose={onCancel}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <DialogHeader>
        <DialogTitle
          className="text-xl text-[#000] font-bold"
          id="customized-dialog-title"
        >
          Deseja remover o registro?
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
          <img src={CloseModalIcon} />
        </IconButton>
        <div className="w-full h-[1px] bg-[#ccc]" />
      </DialogHeader>

      <DialogContent>
        <>
          <div className="flex items-center justify-start p-5">
            <span className="text-base font-light text-[#495055] w-[73%]">Por favor, confirme que você deseja remover o seguinte registro: <b className="text-base font-bold text-[#495055]">{row}</b></span>
          </div>
          <div className="w-full h-[1px] bg-[#ccc]" />
        </>
      </DialogContent>
      <DialogFooter>
        <div className="flex items-center justify-end p-3">
          <Button
            className="w-20 h-8 rounded-full bg-[#F9FAFA] text-sm text-[#000] mr-2 font-bold"
            style={{ border: "1px solid #DBDEDF" }}
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            className="w-20 h-8 rounded-full bg-[#0C4A85] text-sm text-[#fff] font-bold"
            onClick={onConfirm}
          >
            Remover
          </Button>
        </div>
      </DialogFooter>
    </BootstrapDialog>
  );
};

export default ModalDelete;
