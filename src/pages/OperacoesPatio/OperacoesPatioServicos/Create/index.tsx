import React from "react";
import CustomModal from "../../../../components/CustomModal";
import { useBreadcrumb } from "../../../../hooks/BreadCrumbContext";
import { IOperacoesPatioServicos } from "../types/types";
import Form from "./Form";

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  onClear: () => void;
  onConfirm: () => void;
  selectedRow?: IOperacoesPatioServicos;
}


const CreateOperacaoPatioServico: React.FC<Props> = (props: Props) => {
  const { breadcrumb } = useBreadcrumb();

  return (
    <CustomModal title={`${breadcrumb[breadcrumb.length - 1]} Operação Patio Serviços`} onClose={props.onClear}>
      <Form isView={props.isView} selectedRow={props.selectedRow} onConfirm={props.onConfirm} isEdit={props.isEdit} />
    </CustomModal>
  )
};

export default CreateOperacaoPatioServico;
