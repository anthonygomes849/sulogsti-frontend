import { ValueFormatterParams } from 'ag-grid-community';
import React, { useCallback, useState } from 'react';
import Grid from '../../../components/Grid';
import { ColumnDef } from '../../../components/Grid/model/Grid';
import ModalDelete from '../../../components/ModalDelete';
import Loading from '../../../core/common/Loading';
import { formatDateTimeBR } from '../../../helpers/format';
import { useModal } from '../../../hooks/ModalContext';
import api from '../../../services/api';
import CreateMensalista from './Create';
import { IMensalista } from './types/types';

// import { Container } from './styles';

const ListMensalista: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: 'placa',
      headerName: 'Placa',
      filter: true,
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
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { isModalOpen, closeModal, openModal } = useModal();


  const onDelete = useCallback(async (entityId?: number) => {
    try {
      setLoading(true);

      const body = {
        id_mensalista: entityId,
      };

      await api.post('/deletar/mensalistas', body);

      setLoading(false);

      setIsRemove(false);

      window.location.reload();
    }catch{
      setLoading(false);
    }
  }, [])

  return (
    <>
    <Loading loading={loading} />
    {isModalOpen && (
        <CreateMensalista
          isView={isView}
          isEdit={isEdit}
          selectedRow={selectedRow}
          onClear={() => closeModal()}
          onConfirm={() => {
            window.location.reload();
          }}
        />
      )}
      {isRemove && (
        <ModalDelete
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() => onDelete(selectedRow?.id_mensalista)}
        />
      )}
    <div className='flex flex-col w-full h-screen'>
      <div className='flex w-screen'>
        <Grid
          columns={columns}
          filters={[]}
          pagination
          path='/listar/mensalistas'
          onUpdate={(data: any) => {
            setSelectedRow(data);
            setIsEdit(!isEdit);
            openModal();
          }}
          onDelete={(data: any) => {
            setIsRemove(!isRemove);
            setSelectedRow(data);
          }}
          onView={(data: any) => {
            setSelectedRow(data);
            setIsView(!isView);
            openModal();
          }}
          status={[]}
          />
      </div>
    </div>
          </>
  );
}

export default ListMensalista;