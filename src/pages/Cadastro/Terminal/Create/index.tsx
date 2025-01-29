import React from 'react';
import CustomModal from '../../../../components/CustomModal';
import { useBreadcrumb } from '../../../../hooks/BreadCrumbContext';
import Form from './Form';
import { ITerminal } from './types/types';

// import { Container } from './styles';
interface Props {
  isView?: boolean;
  isEdit?: boolean;
  onClear: () => void;
  onConfirm: () => void;
  selectedRow?: ITerminal;
}



const Create: React.FC<Props> = (props: Props) => {
  const { breadcrumb } = useBreadcrumb();

  return (
   <CustomModal title={`${breadcrumb[breadcrumb.length - 1]} Terminal`} onClose={props.onClear}>
      <Form isView={props.isView} selectedRow={props.selectedRow} onConfirm={props.onConfirm} isEdit={props.isEdit} />
    </CustomModal>
  );
}

export default Create;