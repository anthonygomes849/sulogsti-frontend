import { ValueFormatterParams } from 'ag-grid-community';
import React, { useState } from 'react';
import Grid from '../../../components/Grid';
import { ColumnDef } from '../../../components/Grid/model/Grid';
import { formatDateTimeBR, maskedPlate } from '../../../helpers/format';
import { useModal } from '../../../hooks/ModalContext';
import CreateMensalista from './Create';
import { IMensalista } from './types/types';

// import { Container } from './styles';

const ListMensalista: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: 'placa',
      headerName: 'Placa',
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return maskedPlate(params.value);
        }
      }
    },
    {
      field: 'mensalista_transportadora.razao_social_transportadora',
      headerName: 'Razão Social',
      filter: true,
      width: 300
    },
    {
      field: 'ativo',
      headerName: 'Ativo',
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return "SIM"
        }
        return "NÃO"
      }
    },
    {
      field: 'data_historico',
      headerName: "Data Modificação",
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return formatDateTimeBR(params.value);
        }
      }
    }
  ]);
  const [selectedRow, setSelectedRow] = useState<IMensalista>();
  const { isModalOpen, closeModal, openModal } = useModal();

  return (
    <>
    {isModalOpen && (
        <CreateMensalista
          isView={false}
          isEdit={false}
          selectedRow={selectedRow}
          onClear={() => closeModal()}
          onConfirm={() => {
            window.location.reload();
          }}
        />
      )}
    <div className='flex flex-col w-full h-screen'>
      <div className='flex w-screen'>
        <Grid
          columns={columns}
          filters={[]}
          pagination
          path='/listar/mensalistas'
          onUpdate={() => {}}
          onDelete={() => {}}
          onView={() => {}}
          status={[]}
          />
      </div>
    </div>
          </>
  );
}

export default ListMensalista;