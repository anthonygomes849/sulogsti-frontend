import React from 'react';
import CustomModal from "../../../../components/CustomModal";
import {ITransportadoras} from "../types/types.ts";

interface Props {
    isView?: boolean;
     isEdit?: boolean;
     onClear: () => void;
     onConfirm: () => void;
     selectedRow?: ITransportadoras;
}

const Create: React.FC<Props> = (props: Props) => {
  return (
    <CustomModal title={props.isEdit ? "Editar" : "Cadastrar"} onClose={props.onClear}>
        <></>
    </CustomModal>
  );
}

export default Create;