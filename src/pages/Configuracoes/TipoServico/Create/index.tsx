import React from 'react';
import CustomModal from '../../../../components/CustomModal';
import Form from './Form';
import { ITipoServico } from './types/types';

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  onClear: () => void;
  onConfirm: () => void;
  selectedRow?: ITipoServico;
}

const Create: React.FC<Props> = (props: Props) => {
  return (
    <CustomModal title={props.isEdit ? 'Editar' : "Cadastrar"} onClose={props.onClear}>
      <Form isView={props.isView} selectedRow={props.selectedRow} onConfirm={props.onConfirm} isEdit={props.isEdit} onClose={props.onClear} />
    </CustomModal>
  );
}

export default Create;