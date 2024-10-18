import React from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
interface Props {
  isOpen?: boolean;
  onCancel?: any;
  onConfirm?: any;
}

const ModalDelete: React.FC<Props> = ({
  isOpen,
  onCancel,
  onConfirm,
}: Props) => {
  return (
    <Modal isOpen={isOpen} style={{ position: 'absolute', zIndex: '999999' }}>
      <ModalBody>
       Deseja realmente remove esse registro?
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onConfirm}>
          Confirmar
        </Button>{' '}
        <Button color="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};


export default ModalDelete;