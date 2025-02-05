import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useState } from "react";
import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import ModalDelete from "../../../components/ModalDelete";
import Loading from "../../../core/common/Loading";
import { formatDateTimeBR } from "../../../helpers/format";
import { STATUS_OPERACAO_PATIO_SERVICOS } from "../../../helpers/status";
import { useModal } from "../../../hooks/ModalContext";
import api from "../../../services/api";
import CreateOperacaoPatioServico from "./Create";
import { IOperacoesPatioServicos } from "./types/types";

const ListOperacoesPatioServicos: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: "entrada_veiculo.placa_dianteira",
      headerName: "Placa Dianteira Entrada",
      filter: true,
    },
    {
      field: "saida_veiculo.placa_dianteira",
      headerName: "Placa Dianteira Saída",
      filter: true,
    },
    {
      field: "entrada_veiculo.data_hora",
      headerName: "Data/Hora Entrada",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return formatDateTimeBR(params.value);
        }
      }
    },
    {
      field: "saida_veiculo.data_hora",
      headerName: "Data/Hora Saída",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return formatDateTimeBR(params.value);
        }
      }
    },
    {
      field: "tipo_servico.tipo_servico",
      headerName: "Tipo de Servico",
      filter: true,
      width: 300,
    },
    {
      field: "ativo",
      headerName: "Ativo",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return "SIM";
        }
        return "NÃO";
      },
    },
    {
      field: "data_historico",
      headerName: "Data Modificação",
      flex: 1,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return formatDateTimeBR(params.value);
        }
      },
    },
  ]);
  const [selectedRow, setSelectedRow] = useState<IOperacoesPatioServicos>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { isModalOpen, closeModal, openModal } = useModal();

  const onDelete = useCallback(async (entityId?: number) => {
    try {
      setLoading(true);

      const body = {
        id_operacao_patio_servico: entityId,
      };

      await api.post("/deletar/operacoesPatioServico", body);

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
      {isModalOpen && (
        <CreateOperacaoPatioServico
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
          onConfirm={() => onDelete(selectedRow?.id_operacao_patio_servico)}
        />
      )}
      <div className="flex flex-col w-full h-screen">
        <div className="flex w-screen">
          <Grid
            columns={columns}
            filters={[]}
            pagination
            path="/listar/operacoesPatioServico"
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
            isShowStatus
            status={STATUS_OPERACAO_PATIO_SERVICOS}
          />
        </div>
      </div>
    </>
  );
};

export default ListOperacoesPatioServicos;
