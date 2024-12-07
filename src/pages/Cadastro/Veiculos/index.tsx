import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useRef, useState } from "react";

import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import ModalDelete from "../../../components/ModalDelete";
import Loading from "../../../core/common/Loading";
import { STATUS_VEICULO } from "../../../helpers/status";
import { useModal } from "../../../hooks/ModalContext";
import api from "../../../services/api";
import CreateVeiculos from "./components/Create";
import { IVeiculos } from "./types/types";

// import { Container } from './styles';

const ListVeiculo: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: "placa",
      headerName: "Placa",
      cellStyle: { textAlign: "left", marginLeft: "1rem" },
      filter: true,
    },
    {
      field: "uf_estado",
      headerName: "Estado",
      cellStyle: { textAlign: "left" },
      filter: true,
    },
    {
      field: "tipo_parte_veiculo",
      headerName: "Motorizado",
      cellStyle: { textAlign: "left" },
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return "SIM";
        }
        return "NÃO";
      },
    },
    {
      field: "renavam",
      headerName: "RENAVAM",
      cellStyle: { textAlign: "left" },
      filter: true,
    },
    {
      field: "rntrc",
      headerName: "RNTRC",
      filter: true,
    },
    {
      field: "data_expiracao_rntrc",
      headerName: "Expiraçao do RNTRC",
      filter: true,
    },
    {
      field: "ano_exercicio_crlv",
      headerName: "Ano de Exercício do CRLV",
      filter: true,
    },
    {
      field: "livre_acesso_patio",
      headerName: "Livre Acesso ao Pátio",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return "SIM";
        }
        return "NÃO";
      },
    },
    {
      field: "data_inativacao",
      headerName: "Data Inativação",
    },
    {
      field: "dias_inativacao",
      headerName: "Dias de Inativação",
    },
    {
      field: "motivo_inativacao",
      headerName: "Motivo da Inativação",
    },
    {
      field: "data_historico",
      headerName: "Data de Modificação",
    },
  ]);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRows] = useState<IVeiculos>();
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { isModalOpen, closeModal, openModal } = useModal();

  const gridRef = useRef<any>();

  const onDelete = useCallback(async (rowId?: number) => {
    try {
      setLoading(true);
      const body = {
        id_veiculo: rowId,
      };

      await api.post("/deletar/veiculos", body);

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
        <CreateVeiculos
          isView={isView}
          isEdit={isEdit}
          selectedRow={selectedRow}
          onClear={() => closeModal()}
          onConfirm={() => {
            window.location.reload();
          }}
        />
      )}
      <Loading loading={loading} />
      {isRemove && (
        <ModalDelete
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() => onDelete(selectedRow?.id_veiculo)}
        />
      )}
      <div className="flex flex-col w-full h-screen">
        <div className="flex w-screen">
          <Grid
            ref={gridRef}
            columns={columns}
            filters={[]}
            pagination
            path="/listar/veiculos"
            onDelete={(data: any) => {
              setIsRemove(!isRemove);
              setSelectedRows(data);
            }}
            status={STATUS_VEICULO}
            onView={(data: any) => {
              setSelectedRows(data);
              setIsView(!isView);
              openModal();
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

export default ListVeiculo;
