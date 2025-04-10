import React, {useCallback, useState} from 'react';
import {DialogFooter, DialogHeader} from "../../../../../../../../../../../components/ui/dialog.tsx";
import {Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import CloseModalIcon from "../../../../../../../../../../../assets/images/closeIcon.svg";
import {Button } from "reactstrap";
import {styled} from "@mui/material/styles";
import api from "../../../../../../../../../../../services/api.ts";
import Loading from "../../../../../../../../../../../core/common/Loading";
import Content from "./Content";
import {FrontendNotification} from "../../../../../../../../../../../shared/Notification";

interface Props {
    onConfirm: () => void;
    onCancel: () => void;
}

const BootstrapDialog = styled(Dialog)(() => ({
    "& .MuiPaper-root": {
        borderRadius: "10px",
        zIndex: "99999999999px"
    },
    "& .MuiDialogContent-root": {
        minWidth: "500px",
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

const ReversedPayment: React.FC<Props> = (props: Props) => {
    const [textInput, setTextInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = useCallback(async (value: string) => {
        try {
            setLoading(true);

            const body = {
                cpf: value.replaceAll(".", "").replace("-", "")
            };

            const response = await api.post('/operacaopatio/cpfSupervisor', body);

            if(response.status === 200 && response.data) {
                props.onConfirm();
            } else {
                FrontendNotification("CPF Supervisor inválido", "warning");
            }

            setLoading(false);
        }catch{
            setLoading(false);
        }
    }, []);

    const handleChange = useCallback((value: string) => {
        setTextInput(value);
    }, [])

    return (
        <BootstrapDialog
            // onClose={onCancel}
            aria-labelledby="customized-dialog-title"
            open={true}
        >
            <Loading loading={loading} />
            <DialogHeader>
                <DialogTitle
                    className="text-xl text-[#000] font-bold"
                    id="customized-dialog-title"
                >
                    Estornar
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={props.onCancel}
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
                   <Content onChange={(value: string) => handleChange(value)} value={textInput} />
                    <div className="w-full h-[1px] bg-[#ccc]" />
            </DialogContent>
            <DialogFooter>
                <div className="flex items-center justify-end p-3">
                    <Button
                        className="w-20 h-8 rounded-full bg-[#F9FAFA] text-sm text-[#000] mr-2 font-bold"
                        style={{ border: "1px solid #DBDEDF" }}
                        onClick={props.onCancel}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="w-24 h-8 rounded-full bg-[#0C4A85] text-sm text-[#fff] font-bold"
                        onClick={() => handleSubmit(textInput)}
                    >
                        Confirmar
                    </Button>
                </div>
            </DialogFooter>
        </BootstrapDialog>

    )
}

export default ReversedPayment;