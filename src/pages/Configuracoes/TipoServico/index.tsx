import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useRef, useState } from "react";
import PlusButtonIcon from "../../../assets/images/PlusButtonIcon.svg";
import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import ModalDelete from "../../../components/ModalDelete";
import Loading from "../../../core/common/Loading";
import { formatDateBR } from "../../../helpers/format";
import { useModal } from "../../../hooks/ModalContext";
import api from "../../../services/api";
import Create from "./Create";
import { ITipoServico } from "./Create/types/types";
import Info from "./Info";

// import { Continer } from './styles';

const ListTipoServico: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: "tipo_servico",
      headerName: "Tipo Serviço",
      flex: 2,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "data_historico",
      headerName: "Data Modificação",
      flex: 2,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return formatDateBR(params.value);
        }
      },
    },
  ]);

  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRows] = useState<ITipoServico>();
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const gridRef = useRef<any>();

  const { isModalOpen, closeModal, openModal } = useModal();

  const onDelete = useCallback(async (rowId?: number) => {
    try {
      setLoading(true);
      const body = {
        id_tipo_servico: rowId,
      };

      await api.post("/deletar/tipoServicos", body);

      setLoading(false);

      setIsRemove(false);

      window.location.reload();
    } catch {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {isModalOpen && (
        <Create
          isView={isView}
          isEdit={isEdit}
          selectedRow={selectedRow}
          onClear={() => {
            closeModal();
            setIsEdit(false);
          }}
          onConfirm={() => {
            window.location.reload();
          }}
        />
      )}

      <Loading loading={loading} />

      {isRemove && (
        <ModalDelete
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() => onDelete(selectedRow?.id_tipo_servico)}
          row={selectedRow?.tipo_servico}
        />
      )}
      {isView && (
        <Info
          data={selectedRow}
          title="Conhecer - Tipo do Serviço"
          onClose={() => setIsView(!isView)}
        />
      )}

      <div className="flex flex-col w-full h-screen bg-[#F5F5F5] p-5">
        <div className="flex items-center justify-between w-full mb-3">
          <div>
            <h1 className="text-2xl text-[#000000] font-bold">
              Tipo de Serviços
            </h1>
          </div>
          <div className="mr-14">
            <button
              className="flex items-center justify-center h-12 w-36 bg-[#062D4E] text-[#FFFFFF] text-sm font-light border-none rounded-full"
              onClick={() => openModal()}
            >
              Adicionar <img src={PlusButtonIcon} alt="" className="ml-2" />
            </button>
          </div>
        </div>
        <div className="flex w-screen">
          <Grid
            ref={gridRef}
            columns={columns}
            filters={[]}
            pagination
            path="/listar/tipoServicos"
            status={[]}
            onDelete={(data: any) => {
              setIsRemove(!isRemove);
              setSelectedRows(data);
            }}
            onView={(data: any) => {
              setSelectedRows(data);
              setIsView(!isView);
            }}
            onUpdate={(data: any) => {
              setSelectedRows(data);
              setIsEdit(!isEdit);
              openModal();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ListTipoServico;
