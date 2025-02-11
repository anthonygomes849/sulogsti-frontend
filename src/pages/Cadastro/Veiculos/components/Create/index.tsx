import React from "react";

import CustomModal from "../../../../../components/CustomModal";
import { IVeiculos } from "../../types/types";
import Form from "./Form";

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  onClear: () => void;
  onConfirm: () => void;
  selectedRow?: IVeiculos;
}

const CreateVeiculos: React.FC<Props> = (props: Props) => {
  return (
    <CustomModal title={props.isEdit ? "Editar" : "Cadastrar"} onClose={props.onClear}>
      <Form isView={props.isView} selectedRow={props.selectedRow} onConfirm={props.onConfirm} isEdit={props.isEdit} onClose={props.onClear} />
    </CustomModal>
  );
};

export default CreateVeiculos;
