import React from 'react';
import CustomModal from '../../../../components/CustomModal';
import { useBreadcrumb } from '../../../../hooks/BreadCrumbContext';
import { IMensalista } from '../types/types';
import Form from './Form';


interface Props {
  isView?: boolean;
  isEdit?: boolean;
  onClear: () => void;
  onConfirm: () => void;
  selectedRow?: IMensalista;
}

const CreateMensalista: React.FC<Props> = (props: Props) => {
  const { breadcrumb } = useBreadcrumb();

  return (
    <CustomModal title={props.isEdit ? "Editar" : "Cadastrar"} onClose={props.onClear}>
      <Form isView={props.isView} selectedRow={props.selectedRow} onConfirm={props.onConfirm} isEdit={props.isEdit} onClose={props.onClear} />
    </CustomModal>
  );
}

export default CreateMensalista;