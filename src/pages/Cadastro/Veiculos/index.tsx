import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useRef, useState } from "react";

import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import ModalDelete from "../../../components/ModalDelete";
import Loading from "../../../core/common/Loading";
import { STATUS_VEICULO } from "../../../helpers/status";
import api from "../../../services/api";

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
  const [entityId, setEntityId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const gridRef = useRef<any>();

  const onDelete = useCallback(async (rowId: number | null) => {
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
      <Loading loading={loading} />
      {isRemove && (
        <ModalDelete
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() => onDelete(entityId)}
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
            onDelete={(rowId: number) => {
              console.log(rowId);
              setIsRemove(!isRemove);
              setEntityId(rowId);
            }}
            status={STATUS_VEICULO}
          />
        </div>
      </div>
    </>
  );
};

export default ListVeiculo;
